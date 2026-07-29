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
    public class PatientsController(IPatientsService service) : ControllerBase
    {
        private readonly IPatientsService _service = service;

        [HttpGet("profile")]
        public async Task<ActionResult<PatientsResponseDto>> GetMyProfile()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return Unauthorized();

            var profile = await _service.GetPatientsProfileByIdAsync(userId);
            if (profile == null)
            {
                return NotFound("Profil pasien tidak ditemukan.");
            }

            return Ok(profile);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<PatientsResponseDto>> GetPatientById(long id)
        {
            var profile = await _service.GetPatientsProfileByIdAsync(id);
            if (profile == null)
            {
                return NotFound("Pasien tidak ditemukan.");
            }

            return Ok(profile);
        }
    }
}
