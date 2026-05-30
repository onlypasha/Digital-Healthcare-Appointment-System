using healthcare_api.Data;
using healthcare_api.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController(IDoctorService service) : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult> GetDoctors()
        {
            var doctors = await service.GetDoctorsAsync();
            var response = doctors.Select(d => new DoctorResponseDto
            {
                Id = d.Id,
                Name = d.User?.Name ?? string.Empty,
                Email = d.User?.Email ?? string.Empty,
                Role = d.User?.Role ?? string.Empty,
                Status = d.User?.Status ?? string.Empty,
                SpecializationId = d.SpecializationId,
                SpecializationName = d.Specialization?.Name,
                ConsultationFee = d.ConsultationFee,
                Phone = d.Phone
            });
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpPut("update-doctor/{userId}")]
        public async Task<ActionResult> UpdateDoctor(long userId, [FromBody] UpdateDoctorDto request)
        {
            var doctor = await service.UpdateDoctorAsync(userId, request);

            if (doctor == null)
            {
                return NotFound("Dokter tidak ditemukan");
            }

            return Ok(new DoctorControllerResponse { message = "Data dokter berhasil diperbarui." });
        }
    }
}
