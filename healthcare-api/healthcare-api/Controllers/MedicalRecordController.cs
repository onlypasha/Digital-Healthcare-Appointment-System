using System.Security.Claims;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MedicalRecordController(IMedicalRecordService service) : ControllerBase
    {
        private readonly IMedicalRecordService _service = service;

        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<MedicalRecordResponseDto>> CreateMedicalRecord([FromBody] CreateMedicalRecordDto request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            var result = await _service.CreateMedicalRecordAsync(request, userId, role);
            if (result == null)
            {
                return BadRequest("Gagal membuat rekam medis. Pastikan ID janji temu benar dan Anda memiliki otorisasi.");
            }

            return Ok(result);
        }
    }
}
