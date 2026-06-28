using System.Collections.Generic;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Models.Transactional;

namespace healthcare_api.Interface
{
    /// <summary>
    /// Service interface for administrator tasks regarding doctor accounts.
    /// </summary>
    public interface IDoctorService
    {
        Task<List<Doctor>> GetDoctorsAsync();
        Task<bool> ApproveDoctorAsync(long userId);
        Task<bool> DisableDoctorAsync(long userId);
        Task<Doctor?> UpdateDoctorAsync(long id, UpdateDoctorDto request);
        Task<Doctor?> GetDoctorConsultationFeeAsync(long id);
        Task<Doctor?> SetDoctorConsultationFeeAsync(long id, decimal fee);
    }
}
