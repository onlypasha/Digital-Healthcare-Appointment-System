using System.Collections.Generic;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Models.Transactional;

namespace healthcare_api.Interface
{
    /// <summary>
    /// Service interface for managing medical specializations.
    /// </summary>
    public interface ISpecializationService
    {
        /// <summary>
        /// Retrieves the list of all medical specializations.
        /// </summary>
        /// <returns>A list of specializations.</returns>
        Task<List<Specialization>> GetSpecializationsAsync();

        /// <summary>
        /// Adds a new specialization.
        /// </summary>
        /// <param name="request">The specialization data payload.</param>
        /// <returns>The created Specialization object, or null if validation fails.</returns>
        Task<Specialization?> AddSpecializationAsync(AddSpecializationRequestDto request);

        /// <summary>
        /// Updates an existing specialization's name or description.
        /// </summary>
        /// <param name="id">The ID of the specialization to update.</param>
        /// <param name="request">The payload containing updated fields.</param>
        /// <returns>The updated Specialization object, or null if the specialization is not found.</returns>
        Task<Specialization?> UpdateSpecializationAsync(long id, UpdateSpecializationRequestDto request);

        /// <summary>
        /// Deletes a specialization if it is not currently linked to any doctor.
        /// </summary>
        /// <param name="id">The ID of the specialization to delete.</param>
        /// <returns>True if deletion succeeded, otherwise false.</returns>
        Task<bool> DeleteSpecializationAsync(long id);
    }
}
