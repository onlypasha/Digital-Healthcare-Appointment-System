using System.Collections.Generic;
using System.Threading.Tasks;
using healthcare_api.Data;

namespace healthcare_api.Interface
{
    public interface IMedicalRecordService
    {
        Task<MedicalRecordResponseDto?> CreateMedicalRecordAsync(CreateMedicalRecordDto request, long userId, string role);
        Task<List<MedicalRecordResponseDto>> GetMedicalRecordByUserIdAsync(long userId);
        Task<MedicalRecordResponseDto?> GetMedicalRecordByAppointmentIdAsync(long appointmentId);
    }
}