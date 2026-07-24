using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class DoctorsScheduleService(TrxDbContext context) : IDoctorsScheduleService
    {
        private readonly TrxDbContext context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<DoctorsSchedule> CreateDoctorScheduleAsync(CreateDoctorScheduleRequestDto request)
        {
            var doctorExists = await context.Doctors.AnyAsync(d => d.Id == request.DoctorsId);
            if (!doctorExists)
            {
                return null;
            }

            // Validasi agar tidak ada jadwal bertabrakan (overlap)
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

        public async Task<DoctorsSchedule> UpdateDoctorScheduleAsync(long id, EditDoctorScheduleDto request)
        {
            var schedule = await context.DoctorsSchedules.FirstOrDefaultAsync(d => d.Id == id);
            if (schedule is null)
            {
                return null;
            }

            var doctorExists = await context.Doctors.AnyAsync(d => d.Id == request.DoctorsId);
            if (!doctorExists)
            {
                return null;
            }

            // Validasi overlap jadwal dengan mengabaikan ID yang sedang diubah
            var isOverlap = await context.DoctorsSchedules.AnyAsync(s =>
                s.Id != id &&
                s.DoctorsId == request.DoctorsId &&
                s.DayOfWeek == request.DayOfWeek &&
                ((request.StartTime >= s.StartTime && request.StartTime < s.EndTime) ||
                 (request.EndTime > s.StartTime && request.EndTime <= s.EndTime) ||
                 (request.StartTime <= s.StartTime && request.EndTime >= s.EndTime)));

            if (isOverlap)
            {
                return null;
            }

            schedule.DoctorsId = request.DoctorsId;
            schedule.DayOfWeek = request.DayOfWeek;
            schedule.StartTime = request.StartTime;
            schedule.EndTime = request.EndTime;

            await context.SaveChangesAsync();

            return schedule;
        }

        public async Task<List<DoctorScheduleResponseDto>> GetAllDoctorSchedulesAsync()
        {
            return await context.DoctorsSchedules
                .AsNoTracking()
                .Include(s => s.Doctors)
                    .ThenInclude(d => d.User)
                .Include(s => s.Doctors)
                    .ThenInclude(d => d.Specialization)
                .Select(s => new DoctorScheduleResponseDto
                {
                    Id = s.Id,
                    DoctorsId = s.DoctorsId,
                    DoctorName = s.Doctors != null && s.Doctors.User != null ? s.Doctors.User.Name : "Unknown",
                    Specialization = s.Doctors != null && s.Doctors.Specialization != null ? s.Doctors.Specialization.Name : null,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime
                })
                .ToListAsync();
        }

        public async Task<DoctorsSchedule> DeleteDoctorScheduleAsync(long id)
        {
            var schedule = await context.DoctorsSchedules.FirstOrDefaultAsync(s => s.Id == id);

            if (schedule == null)
            {
                return null;
            }

            context.Remove(schedule);
            await context.SaveChangesAsync();
            return schedule;
        }
    }
}
