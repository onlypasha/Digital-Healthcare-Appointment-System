using healthcare_api.Data;
using healthcare_api.Models.Transactional;

namespace healthcare_api.Interface
{
    public interface ISpecializationService
    {
        Task<List<Specialization>> GetSpecializationsAsync();
        Task<Specialization?> AddSpecializationAsync(AddSpecializationRequestDto request);
        Task<Specialization?> UpdateSpecializationAsync(long id, UpdateSpecializationRequestDto request);
        Task<bool> DeleteSpecializationAsync(long id);
    }
}
