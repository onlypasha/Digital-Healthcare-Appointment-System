using System.Threading.Tasks;
using healthcare_api.Data;

namespace healthcare_api.Interface
{
    /// <summary>
    /// Service interface handling authentication and registration logic for doctors and patients.
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Registers a new patient account in the system.
        /// </summary>
        /// <param name="request">The patient registration payload.</param>
        /// <returns>The registered patient DTO details, or null if the email is already registered.</returns>
        Task<RegisterPatientDto?> RegisterPatientAsync(RegisterPatientDto request);

        /// <summary>
        /// Registers a new doctor account, which will initially be in a pending status.
        /// </summary>
        /// <param name="request">The doctor registration payload.</param>
        /// <returns>The registered doctor DTO details, or null if the email is already registered.</returns>
        Task<RegisterDoctorDto?> RegisterDoctorAsync(RegisterDoctorDto request);

        /// <summary>
        /// Authenticates users (Patient, Doctor, or Admin) and returns a signed JWT token.
        /// </summary>
        /// <param name="request">The login payload containing credentials.</param>
        /// <returns>A login response DTO with user metadata and JWT token, or null if credentials are invalid.</returns>
        Task<LoginResponseDto?> LoginAsync(LoginDto request);

        /// <summary>
        /// Handles user logout logic.
        /// </summary>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task LogoutAsync();
    }
}
