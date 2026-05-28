using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class DoctorService(TrxDbContext context) : IDoctorService
    {
        public async Task<bool> ApproveDoctorAsync(long userId)
        {
            var user = await context.Users.FindAsync(userId);

            if (user == null || user.Role != "Doctor")
            {
                return false;
            }

            // Merubah status dari InActive jadi Active
            user.Status = "Active";
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DisableDoctorAsync(long userId)
        {
            var user = await context.Users.FindAsync(userId);
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
                .ToListAsync();
        }

        public async Task<Doctor> UpdateDoctorAsync(long id, UpdateDoctorDto request)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null || user.Role != "Doctor")
            {
                return null;
            }

            var doctor = await context.Doctors.FirstOrDefaultAsync(d => d.UserId == id);
            if (doctor == null)
            {
                return null;
            }

            doctor.Specialization = request.Specialization ?? doctor.Specialization;
            doctor.ConsultationFee = request.ConsultationFee ?? doctor.ConsultationFee;
            doctor.Phone = request.Phone ?? doctor.Phone;

            await context.SaveChangesAsync();

            return doctor;
        }
    }
}
