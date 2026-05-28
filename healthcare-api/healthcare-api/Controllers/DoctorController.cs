using healthcare_api.Data;
using healthcare_api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController(IDoctorService service) : ControllerBase
    {
        [HttpPut("approve-doctor/{userId}")]
        public async Task<ActionResult> ApproveDoctor(long userId)
        {
            var success = await service.ApproveDoctorAsync(userId);

            if (!success)
            {
                return NotFound("Dokter tidak ditemukan");
            }

            return Ok(new DoctorControllerResponse { message = "Akun Dokter telah disetujui dan diaktifkan." });
        }

        [HttpPut("disable-doctor/{userId}")]
        public async Task<ActionResult> DisableDoctor(long userId)
        {
            var success = await service.DisableDoctorAsync(userId);

            if (!success)
            {
                return NotFound("Dokter tidak ditemukan");
            }

            return Ok(new DoctorControllerResponse { message = "Akun Dokter telah di non-aktifkan." });
        }
    }
}
