using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class AppointmentService(TrxDbContext context) : IAppointmentService
    {
        private readonly TrxDbContext context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<AppointmentResponseDto?> BookAppointmentAsync(long userId, BookAppointmentDto request)
        {
            await using var transaction = await context.Database.BeginTransactionAsync();

            // ponytail: FOR UPDATE lock on Doctor row serializes concurrent bookings for same doctor.
            // Includes User + Specialization in same query to eliminate the duplicate doctor fetch below.
            var doctor = await context.Doctors
                .FromSqlRaw("SELECT * FROM \"Doctors\" WHERE \"Id\" = {0} FOR UPDATE", request.DoctorId)
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync();

            if (doctor?.User == null || doctor.User.Status != "Active") return null;

            var patient = await context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return null;

            var englishDay = request.AppointmentsDate.DayOfWeek.ToString();
            // ponytail: indoDay needed because DoctorsSchedule.DayOfWeek may be stored in Indonesian
            string indoDay = englishDay switch
            {
                "Sunday" => "Minggu", "Monday" => "Senin", "Tuesday" => "Selasa",
                "Wednesday" => "Rabu", "Thursday" => "Kamis", "Friday" => "Jumat",
                "Saturday" => "Sabtu", _ => ""
            };

            var hasSchedule = await context.DoctorsSchedules.AnyAsync(s =>
                s.DoctorsId == request.DoctorId && s.DayOfWeek != null &&
                (s.DayOfWeek.ToLower() == englishDay.ToLower() || s.DayOfWeek.ToLower() == indoDay.ToLower()));

            if (!hasSchedule) return null;

            var dateOnly = request.AppointmentsDate.Date;
            var queueNum = await context.Appointments.CountAsync(a =>
                a.DoctorsId == request.DoctorId &&
                a.AppointmentsDate.HasValue &&
                a.AppointmentsDate.Value.Date == dateOnly) + 1;

            var appointment = new Appointment
            {
                PatientsId = patient.Id,
                DoctorsId = request.DoctorId,
                AppointmentsDate = request.AppointmentsDate,
                QueueNumber = queueNum,
                Status = "Scheduled",
                Complaint = request.Complaint,
                CreatedAt = DateTime.UtcNow
            };

            context.Appointments.Add(appointment);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            // ponytail: explicit mapping, no AutoMapper
            return new AppointmentResponseDto
            {
                Id = appointment.Id,
                CreatedAt = appointment.CreatedAt,
                AppointmentsDate = appointment.AppointmentsDate,
                QueueNumber = appointment.QueueNumber,
                Status = appointment.Status,
                Complaint = appointment.Complaint,
                PatientsId = appointment.PatientsId,
                PatientName = patient.User?.Name ?? "Unknown Patient",
                DoctorsId = appointment.DoctorsId,
                DoctorName = doctor.User.Name,
                SpecializationName = doctor.Specialization?.Name
            };
        }

        public async Task<List<AppointmentResponseDto>> GetAppointmentsAsync(long userId, string role)
        {
            IQueryable<Appointment> query = context.Appointments
                .Include(a => a.Patients).ThenInclude(p => p!.User)
                .Include(a => a.Doctors).ThenInclude(d => d!.User)
                .Include(a => a.Doctors).ThenInclude(d => d!.Specialization);

            if (role == "Patient")
            {
                query = query.Where(a => a.Patients != null && a.Patients.UserId == userId);
            }
            else if (role == "Doctor")
            {
                query = query.Where(a => a.Doctors != null && a.Doctors.UserId == userId);
            }

            return await query.Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                CreatedAt = a.CreatedAt,
                AppointmentsDate = a.AppointmentsDate,
                QueueNumber = a.QueueNumber,
                Status = a.Status,
                Complaint = a.Complaint,
                PatientsId = a.PatientsId,
                PatientName = a.Patients != null && a.Patients.User != null ? a.Patients.User.Name : null,
                DoctorsId = a.DoctorsId,
                DoctorName = a.Doctors != null && a.Doctors.User != null ? a.Doctors.User.Name : null,
                SpecializationName = a.Doctors != null && a.Doctors.Specialization != null ? a.Doctors.Specialization.Name : null
            }).ToListAsync();
        }

        public async Task<bool> CancelAppointmentAsync(long id, long userId, string role)
        {
            var appt = await context.Appointments
                .Include(a => a.Patients)
                .Include(a => a.Doctors)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appt == null) return false;

            if (role == "Patient" && (appt.Patients == null || appt.Patients.UserId != userId))
                return false;

            if (role == "Doctor" && (appt.Doctors == null || appt.Doctors.UserId != userId))
                return false;

            appt.Status = "Cancelled";
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CompleteAppointmentAsync(long id, long userId, string role)
        {
            var appt = await context.Appointments
                .Include(a => a.Doctors)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appt == null) return false;

            if (role == "Doctor" && (appt.Doctors == null || appt.Doctors.UserId != userId))
                return false;

            appt.Status = "Completed";
            await context.SaveChangesAsync();
            return true;
        }
    }
}
