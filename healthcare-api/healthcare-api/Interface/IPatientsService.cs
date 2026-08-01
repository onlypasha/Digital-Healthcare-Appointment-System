using System.Threading.Tasks;
using healthcare_api.Data;

namespace healthcare_api.Interface
{
    public interface IPatientsService
    {
        Task<PatientsResponseDto?> GetPatientsProfileByIdAsync(long id);
        Task<PatientsResponseDto?> UpdatePatientProfileAsync(long userId, UpdatePatientProfileDto request);
    }
}