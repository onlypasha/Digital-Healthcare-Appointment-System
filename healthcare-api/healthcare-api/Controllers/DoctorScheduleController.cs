using healthcare_api.Db;
using healthcare_api.Data;
using healthcare_api.Models.Transactional;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using healthcare_api.Interface;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DoctorScheduleController(IDoctorsScheduleService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<DoctorScheduleResponseDto>>> GetAllDoctorSchedules()
        {
            var schedules = await service.GetAllDoctorSchedulesAsync();
            return Ok(schedules);
        }

        [HttpPost]
        public async Task<ActionResult<DoctorsSchedule>> CreateDoctorSchedule(CreateDoctorScheduleRequestDto request)
        {
            var schedule = await service.CreateDoctorScheduleAsync(request);
            if (schedule is null)
            {
                return BadRequest("Dokter tidak ditemukan, atau jadwal bentrok");
            }

            return Ok(schedule);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DoctorsSchedule>> UpdateDoctorSchedule(long id, EditDoctorScheduleDto request)
        {
            var schedule = await service.UpdateDoctorScheduleAsync(id, request);
            if (schedule is null)
            {
                return BadRequest("Jadwal tidak ditemukan, atau data yang dimasukkan bentrok.");
            }

            return Ok(schedule);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDoctorSchedule(long id)
        {
            var schedule = await service.DeleteDoctorScheduleAsync(id);
            if (schedule == null)
            {
                return NotFound($"Jadwal dengan ID {id} tidak ditemukan.");
            }

            return Ok(new { message = "Jadwal berhasil dihapus", id });
        }
    }
}
