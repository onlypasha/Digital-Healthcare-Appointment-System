using healthcare_api.Data;
using healthcare_api.Models.Transactional;

namespace healthcare_api.Interface
{
    public interface IDoctorService
    {
        Task<List<Doctor>> GetDoctorsAsync();
        Task<bool> ApproveDoctorAsync(long userId);
        Task<bool> DisableDoctorAsync(long userId);
        Task<Doctor?> UpdateDoctorAsync(long  id, UpdateDoctorDto request);
        Task<List<Specialization>> GetSpecializationsAsync();
    }
}
