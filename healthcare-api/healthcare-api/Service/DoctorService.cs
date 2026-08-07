using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using healthcare_api.Messaging.Events;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class DoctorService(TrxDbContext context, IPublishEndpoint publishEndpoint) : IDoctorService
    {
        private readonly TrxDbContext context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IPublishEndpoint publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));

        public async Task<bool> ApproveDoctorAsync(long userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || user.Role != "Doctor")
            {
                var doctorFallback = await context.Doctors.FindAsync(userId);
                if (doctorFallback != null)
                {
                    user = await context.Users.FindAsync(doctorFallback.UserId);
                }
            }

            if (user == null || user.Role != "Doctor")
            {
                return false;
            }

            user.Status = "Active";
            await context.SaveChangesAsync();

            // Publish event tidak boleh menggagalkan approval
            try
            {
                await publishEndpoint.Publish(new DoctorApprovedEvent(
                    user.Id,
                    user.Name ?? string.Empty,
                    user.Email ?? string.Empty
                ));
            }
            catch (Exception)
            {
                // Event gagal terkirim, tapi approval tetap berhasil
            }

            return true;
        }

        public async Task<bool> DisableDoctorAsync(long userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || user.Role != "Doctor")
            {
                var doctorFallback = await context.Doctors.FindAsync(userId);
                if (doctorFallback != null)
                {
                    user = await context.Users.FindAsync(doctorFallback.UserId);
                }
            }

            if (user == null || user.Role != "Doctor")
            {
                return false;
            }
            user.Status = "InActive";
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Doctor>> GetDoctorsAsync()
        {
            return await context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .ToListAsync();
        }

        public async Task<Doctor?> UpdateDoctorAsync(long id, UpdateDoctorDto request)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null || user.Role != "Doctor")
            {
                var doctorFallback = await context.Doctors.FindAsync(id);
                if (doctorFallback != null)
                {
                    user = await context.Users.FindAsync(doctorFallback.UserId);
                    if (user != null && user.Role == "Doctor")
                    {
                        // Because id was actually Doctor.Id, we should set id to UserId so the next query works
                        id = user.Id;
                    }
                }
            }

            if (user == null || user.Role != "Doctor")
            {
                return null;
            }

            var doctor = await context.Doctors.FirstOrDefaultAsync(d => d.UserId == id);
            if (doctor == null)
            {
                return null;
            }

            doctor.SpecializationId = request.SpecializationId ?? doctor.SpecializationId;
            doctor.ConsultationFee = request.ConsultationFee ?? doctor.ConsultationFee;
            doctor.Phone = request.Phone ?? doctor.Phone;

            await context.SaveChangesAsync();

            await context.Entry(doctor).Reference(d => d.Specialization).LoadAsync();

            return doctor;
        }

        public async Task<Doctor?> GetDoctorConsultationFeeAsync(long id)
        {
            return await context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Doctor?> SetDoctorConsultationFeeAsync(long id, decimal fee)
        {
            var doctor = await context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null)
            {
                return null;
            }

            doctor.ConsultationFee = fee;
            await context.SaveChangesAsync();
            return doctor;
        }
    }
}
