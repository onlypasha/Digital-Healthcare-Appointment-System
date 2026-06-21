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
        /// <summary>
        /// Retrieves the list of all registered doctor accounts.
        /// </summary>
        /// <returns>A list of doctors.</returns>
        Task<List<Doctor>> GetDoctorsAsync();

        /// <summary>
        /// Approves a pending doctor account and changes their user status to Active.
        /// </summary>
        /// <param name="userId">The User ID associated with the doctor.</param>
        /// <returns>True if the doctor was successfully approved, otherwise false.</returns>
        Task<bool> ApproveDoctorAsync(long userId);

        /// <summary>
        /// Disables a doctor account and changes their user status to inactive.
        /// </summary>
        /// <param name="userId">The User ID associated with the doctor.</param>
        /// <returns>True if the doctor was successfully disabled, otherwise false.</returns>
        Task<bool> DisableDoctorAsync(long userId);

        /// <summary>
        /// Updates professional info (e.g. Specialization, Fee, Phone) for a doctor account.
        /// </summary>
        /// <param name="id">The User ID associated with the doctor.</param>
        /// <param name="request">The payload containing updated fields.</param>
        /// <returns>The updated Doctor model, or null if the doctor wasn't found.</returns>
        Task<Doctor?> UpdateDoctorAsync(long id, UpdateDoctorDto request);
    }
}
