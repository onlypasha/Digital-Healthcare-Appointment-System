using healthcare_api.Data;

namespace healthcare_api.Interface
{
    public interface IAuthService
    {
        Task<RegisterPatientDto?> RegisterPatientAsync(RegisterPatientDto request);
        Task<RegisterDoctorDto?> RegisterDoctorAsync(RegisterDoctorDto request);
        Task<LoginResponseDto?> LoginAsync(LoginDto request);
    }
}
