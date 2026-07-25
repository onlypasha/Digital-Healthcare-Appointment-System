using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Interface;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Messaging.Consumers
{
    public class BookAppointmentConsumer(IAppointmentService appointmentService, ILogger<BookAppointmentConsumer> logger) 
        : IConsumer<BookAppointmentRequest>
    {
        public async Task Consume(ConsumeContext<BookAppointmentRequest> context)
        {
            var request = context.Message;
            logger.LogInformation("Processing BookAppointmentRequest for Patient UserId: {UserId}, Doctor: {DoctorId}", 
                request.UserId, request.DoctorId);

            try
            {
                var bookDto = new BookAppointmentDto
                {
                    DoctorId = request.DoctorId,
                    AppointmentsDate = request.AppointmentsDate,
                    Complaint = request.Complaint
                };

                var appointment = await appointmentService.BookAppointmentAsync(request.UserId, bookDto);

                if (appointment == null)
                {
                    logger.LogWarning("BookAppointmentRequest failed: Invalid schedule or doctor status for Doctor: {DoctorId}", request.DoctorId);
                    await context.RespondAsync(new BookAppointmentResponse
                    {
                        Success = false,
                        ErrorMessage = "Jadwal dokter tidak tersedia pada tanggal tersebut, atau data dokter tidak aktif."
                    });
                    return;
                }

                logger.LogInformation("BookAppointmentRequest completed successfully. Appointment ID: {AppointmentId}", appointment.Id);
                await context.RespondAsync(new BookAppointmentResponse
                {
                    Success = true,
                    Appointment = appointment
                });
            }
            catch (System.Exception ex)
            {
                logger.LogError(ex, "Error processing BookAppointmentRequest for Patient UserId: {UserId}", request.UserId);
                await context.RespondAsync(new BookAppointmentResponse
                {
                    Success = false,
                    ErrorMessage = "Terjadi kesalahan internal saat memproses janji temu: " + ex.Message
                });
            }
        }
    }
}
