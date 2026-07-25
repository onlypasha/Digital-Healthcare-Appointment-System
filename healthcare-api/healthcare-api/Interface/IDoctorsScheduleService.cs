using System.Collections.Generic;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Models.Transactional;

namespace healthcare_api.Interface
{
    /// <summary>
    /// Service interface for managing doctor schedules, with clash detection.
    /// </summary>
    public interface IDoctorsScheduleService
    {
        /// <summary>
        /// Creates a new work schedule for a doctor, validating that there is no time overlap.
        /// </summary>
        /// <param name="request">The schedule details containing Doctor ID, day, start, and end time.</param>
        /// <returns>The created DoctorsSchedule object, or null if validation fails.</returns>
        Task<DoctorsSchedule> CreateDoctorScheduleAsync(CreateDoctorScheduleRequestDto request);

        /// <summary>
        /// Retrieves the list of all work schedules across all doctors.
        /// </summary>
        /// <returns>A list of schedule response DTOs.</returns>
        Task<List<DoctorScheduleResponseDto>> GetAllDoctorSchedulesAsync();

        /// <summary>
        /// Updates an existing doctor schedule, performing clash detection.
        /// </summary>
        /// <param name="id">The ID of the schedule to update.</param>
        /// <param name="request">The updated schedule payload.</param>
        /// <returns>The updated DoctorsSchedule object, or null if validation fails.</returns>
        Task<DoctorsSchedule> UpdateDoctorScheduleAsync(long id, EditDoctorScheduleDto request);

        /// <summary>
        /// Deletes a doctor schedule.
        /// </summary>
        /// <param name="id">The ID of the schedule to delete.</param>
        /// <returns>The deleted DoctorsSchedule object, or null if the schedule was not found.</returns>
        Task<DoctorsSchedule> DeleteDoctorScheduleAsync(long id);
    }
}
