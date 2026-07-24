using System;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class MedicalRecordService(TrxDbContext context) : IMedicalRecordService
    {
        private readonly TrxDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<MedicalRecordResponseDto?> CreateMedicalRecordAsync(CreateMedicalRecordDto request, long userId, string role)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctors!).ThenInclude(d => d.User)
                .Include(a => a.Patients!).ThenInclude(p => p.User)
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentsId);

            if (appointment == null)
            {
                return null;
            }

            // Otorisasi: Jika role Doctor, pastikan janji temu ini memang milik dokter yang sedang login
            if (role == "Doctor" && (appointment.Doctors == null || appointment.Doctors.UserId != userId))
            {
                return null;
            }

            var medicalRecord = new MedicalRecord
            {
                AppointmentsId = appointment.Id,
                PatientsId = appointment.PatientsId,
                DoctorsId = appointment.DoctorsId,
                Diagnosis = request.Diagnosis,
                Prescription = request.Prescription,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.MedicalRecords.Add(medicalRecord);

            // Perbarui status janji temu menjadi Completed jika belum completed
            if (appointment.Status != "Completed")
            {
                appointment.Status = "Completed";
            }

            await _context.SaveChangesAsync();

            return new MedicalRecordResponseDto
            {
                Id = medicalRecord.Id,
                CreatedAt = medicalRecord.CreatedAt,
                AppointmentsId = medicalRecord.AppointmentsId,
                PatientsId = medicalRecord.PatientsId,
                PatientName = appointment.Patients?.User?.Name,
                DoctorsId = medicalRecord.DoctorsId,
                DoctorName = appointment.Doctors?.User?.Name,
                Diagnosis = medicalRecord.Diagnosis,
                Prescription = medicalRecord.Prescription,
                Notes = medicalRecord.Notes
            };
        }
    }
}
