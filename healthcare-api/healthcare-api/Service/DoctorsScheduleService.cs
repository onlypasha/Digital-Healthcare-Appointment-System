using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class DoctorsScheduleService(TrxDbContext context) : IDoctorsScheduleService
    {
        public async Task<DoctorsSchedule> CreateDoctorScheduleAsync(CreateDoctorScheduleRequestDto request)
        {
            // 1. Validasi apakah dokter ada
            var doctorExists = await context.Doctors.AnyAsync(d => d.Id == request.DoctorsId);
            if (!doctorExists)
            {
                return null;
            }

            // 2. Validasi apakah ada jadwal yang bertabrakan (overlap) untuk dokter yang sama
            var isOverlap = await context.DoctorsSchedules.AnyAsync(s =>
                s.DoctorsId == request.DoctorsId &&
                s.DayOfWeek == request.DayOfWeek &&
                ((request.StartTime >= s.StartTime && request.StartTime < s.EndTime) ||
                 (request.EndTime > s.StartTime && request.EndTime <= s.EndTime) ||
                 (request.StartTime <= s.StartTime && request.EndTime >= s.EndTime)));

            if (isOverlap)
            {
                return null;
            }

            var newSchedule = new DoctorsSchedule
            {
                DoctorsId = request.DoctorsId,
                DayOfWeek = request.DayOfWeek,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
            };

            context.DoctorsSchedules.Add(newSchedule);
            await context.SaveChangesAsync();

            return newSchedule;
        }

        public async Task<List<DoctorScheduleResponseDto>> GetAllDoctorSchedulesAsync()
        {
            return await context.DoctorsSchedules
                .AsNoTracking()
                .Include(s => s.Doctor)
                    .ThenInclude(d => d.User)
                .Select(s => new DoctorScheduleResponseDto
                {
                    Id = s.Id,
                    DoctorsId = s.DoctorsId,
                    DoctorName = s.Doctor != null && s.Doctor.User != null ? s.Doctor.User.Name : "Unknown",
                    Specialization = s.Doctor != null ? s.Doctor.Specialization : null,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime
                })
                .ToListAsync();
        }
    }
}
