using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Security.Claims;
using healthcare_api.Interface;
using healthcare_api.Data;

namespace healthcare_api.Hubs
{
    [Authorize]
    public class TeleconsultationHub(ITeleconsultationService teleconsultationService) : Hub
    {
        private readonly ITeleconsultationService _teleconsultationService = teleconsultationService;

        public async Task JoinConsultation(long teleconsultationId)
        {
            var userIdStr = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return;
            var role = Context.User?.FindFirstValue(ClaimTypes.Role) ?? "";

            var canAccess = await _teleconsultationService.CanAccessSessionAsync(teleconsultationId, userId, role);
            if (!canAccess)
            {
                Context.Abort(); // Disconnect unauthorized users
                return;
            }

            // Add connection to a group specific to this teleconsultation
            await Groups.AddToGroupAsync(Context.ConnectionId, teleconsultationId.ToString());
        }

        public async Task LeaveConsultation(long teleconsultationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, teleconsultationId.ToString());
        }

        public async Task SendMessage(SendMessageDto request)
        {
            var userIdStr = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId)) return;
            
            var role = Context.User?.FindFirstValue(ClaimTypes.Role) ?? "";

            // Attempt to save the message via service layer (which handles authorization and DB insert)
            var savedMessage = await _teleconsultationService.SaveMessageAsync(request, userId);

            // If successfully saved, broadcast to everyone in the room
            if (savedMessage != null)
            {
                await Clients.Group(request.TeleconsultationId.ToString())
                    .SendAsync("ReceiveMessage", savedMessage);
            }
        }
    }
}
