using healthcare_api.Db;
using healthcare_api.Data;
using healthcare_api.Models.Transactional;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorScheduleController(TrxDbContext context) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<DoctorsSchedule>> CreateDoctorSchedule(CreateDoctorScheduleRequestDto request)
        {
            var isOverlap = await context.DoctorsSchedules.AnyAsync(s => 
                s.DoctorsId == request.DoctorsId && 
                s.DayOfWeek == request.DayOfWeek &&
                ((request.StartTime >= s.StartTime && request.StartTime < s.EndTime) ||
                 (request.EndTime > s.StartTime && request.EndTime <= s.EndTime) ||
                 (request.StartTime <= s.StartTime && request.EndTime >= s.EndTime)));

            if (isOverlap)
            {
                return BadRequest($"Jadwal dokter pada hari {request.DayOfWeek} di jam tersebut sudah ada atau tumpang tindih.");
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

            return Ok(newSchedule);
        }
    }
}
