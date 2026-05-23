using healthcare_api.Db;
using healthcare_api.Data;
using healthcare_api.Models.Transactional;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using healthcare_api.Service;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorScheduleController(TrxDbContext context, DoctorsScheduleService service) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DoctorsSchedule>> CreateDoctorSchedule(CreateDoctorScheduleRequestDto request)
        {
            var validate = await service.CreateDoctorScheduleAsync(request);
            if (validate is null)
            {
                return BadRequest("Dokter tidak ditemukan, atau jadwal bentrok");
            }

            return Ok(validate);
        }
    }
}
