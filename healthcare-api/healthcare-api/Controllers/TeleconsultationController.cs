using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Interface;

namespace healthcare_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TeleconsultationController(ITeleconsultationService teleconsultationService) : ControllerBase
    {
        private readonly ITeleconsultationService _teleconsultationService = teleconsultationService;

        [HttpPost("start")]
        public async Task<IActionResult> StartSession([FromBody] StartTeleconsultationDto request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return Unauthorized();
            
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var teleconsultationId = await _teleconsultationService.StartSessionAsync(request, userId, role);
            if (teleconsultationId == null) return Forbid("You are not authorized to start this session or it is already completed.");

            return Ok(new { Message = "Teleconsultation session started.", TeleconsultationId = teleconsultationId });
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndSession([FromBody] EndTeleconsultationDto request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return Unauthorized();
            
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var success = await _teleconsultationService.EndSessionAsync(request, userId, role);
            if (!success) return Forbid("Only the assigned doctor can end this session.");

            return Ok(new { Message = "Teleconsultation session ended." });
        }

        [HttpGet("{teleconsultationId}/messages")]
        public async Task<IActionResult> GetMessages(long teleconsultationId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return Unauthorized();
            
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";

            var messages = await _teleconsultationService.GetChatHistoryAsync(teleconsultationId, userId, role);
            
            // If the service returns empty list, we just return it. 
            // The service already handles returning empty if unauthorized.
            return Ok(messages);
        }
    }
}
