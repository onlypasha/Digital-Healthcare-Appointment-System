using System.Collections.Generic;
using System.Threading.Tasks;
using healthcare_api.Data;

namespace healthcare_api.Interface
{
    public interface ITeleconsultationService
    {
        Task<long?> StartSessionAsync(StartTeleconsultationDto request, long userId, string role);
        Task<bool> EndSessionAsync(EndTeleconsultationDto request, long userId, string role);
        Task<bool> CanAccessSessionAsync(long teleconsultationId, long userId, string role);
        Task<MessageResponseDto?> SaveMessageAsync(SendMessageDto request, long senderId);
        Task<List<MessageResponseDto>> GetChatHistoryAsync(long teleconsultationId, long userId, string role);
    }
}
