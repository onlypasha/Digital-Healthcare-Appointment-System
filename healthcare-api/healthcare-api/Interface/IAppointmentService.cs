using System.Collections.Generic;
using System.Threading.Tasks;
using healthcare_api.Data;

namespace healthcare_api.Interface
{
    /// <summary>
    /// Service interface handling appointment bookings, cancellation, completion, and retrieval.
    /// </summary>
    public interface IAppointmentService
    {
        /// <summary>
        /// Books a new appointment slot for a patient with a specific doctor.
        /// </summary>
        /// <param name="userId">The User ID of the patient booking the appointment.</param>
        /// <param name="request">The appointment details (Doctor, date/time, complaint).</param>
        /// <returns>A response DTO detailing the scheduled appointment with queue number, or null if the slot/doctor is invalid.</returns>
        Task<AppointmentResponseDto?> BookAppointmentAsync(long userId, BookAppointmentDto request);

        /// <summary>
        /// Retrieves appointments based on user ID and role context.
        /// </summary>
        /// <param name="userId">The active User ID calling the method.</param>
        /// <param name="role">The role of the active user (Patient, Doctor, or Admin).</param>
        /// <returns>A list of appointments matching the security filters.</returns>
        Task<List<AppointmentResponseDto>> GetAppointmentsAsync(long userId, string role);

        /// <summary>
        /// Cancels an existing appointment.
        /// </summary>
        /// <param name="id">The ID of the appointment to cancel.</param>
        /// <param name="userId">The User ID of the user requesting cancellation.</param>
        /// <param name="role">The role of the user (Patient, Doctor, or Admin).</param>
        /// <returns>True if the cancellation was successful, otherwise false.</returns>
        Task<bool> CancelAppointmentAsync(long id, long userId, string role);

        /// <summary>
        /// Marks an appointment as completed.
        /// </summary>
        /// <param name="id">The ID of the appointment to complete.</param>
        /// <param name="userId">The User ID of the user requesting completion.</param>
        /// <param name="role">The role of the user (Doctor or Admin).</param>
        /// <returns>True if the completion succeeded, otherwise false.</returns>
        Task<bool> CompleteAppointmentAsync(long id, long userId, string role);
    }
}
