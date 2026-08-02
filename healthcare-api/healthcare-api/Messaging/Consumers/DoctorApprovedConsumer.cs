using System.Threading.Tasks;
using healthcare_api.Interface;
using healthcare_api.Messaging.Events;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Messaging.Consumers
{
    public class DoctorApprovedConsumer(ILogger<DoctorApprovedConsumer> logger, IEmailService emailService) : IConsumer<DoctorApprovedEvent>
    {
        public async Task Consume(ConsumeContext<DoctorApprovedEvent> context)
        {
            var message = context.Message;
            
            logger.LogInformation("NOTIFICATION: Doctor Approved. ID: {Id}, Name: {Name}, Email: {Email}. Sending welcome email...", 
                message.DoctorId, message.Name, message.Email);

            var subject = "Akun Dokter Disetujui - Care Connect Service";
            var body = $@"
                <h3>Yth, Dr. {message.Name}</h3>
                <p>Akun Dokter Anda di Digital Healthcare telah <strong>disetujui dan diaktifkan</strong> oleh Admin.</p>
                <p>Bergabungnya Anda di Care Connect tentunya menjadi amunisi berharga bagi kami dalam terus memberikan pelayanan kesehatan terbaik untuk para pasien.</p>
                <br/>
                <p>Salam hangat, <br/>Tim Care Connect</p>";

            await emailService.SendEmailAsync(message.Email, subject, body);
        }
    }
}
