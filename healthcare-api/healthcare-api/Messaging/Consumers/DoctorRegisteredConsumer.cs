using System.Threading.Tasks;
using healthcare_api.Interface;
using healthcare_api.Messaging.Events;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Messaging.Consumers
{
    public class DoctorRegisteredConsumer(ILogger<DoctorRegisteredConsumer> logger, IEmailService emailService) : IConsumer<DoctorRegisteredEvent>
    {
        public async Task Consume(ConsumeContext<DoctorRegisteredEvent> context)
        {
            var message = context.Message;
            
            logger.LogInformation("NOTIFICATION: New Doctor Registered. ID: {Id}, Name: {Name}, Email: {Email}. Notifying Doctor...", 
                message.DoctorId, message.Name, message.Email);

            var subject = "Pendaftaran Akun Dokter - Digital Healthcare";
            var body = $@"
                <h3>Yth, Dr. {message.Name}</h3>
                <p>Terima kasih telah mendaftar di Care Connect.</p>
                <p>Status akun Anda saat ini <strong>Menunggu Persetujuan Admin (Pending)</strong>.</p>
                <p>Kami akan mengirimkan email pemberitahuan setelah akun Anda disetujui oleh Admin.</p>
                <br/>
                <p>Salam hangat,<br/>Tim Care Connect</p>";

            await emailService.SendEmailAsync(message.Email, subject, body);
        }
    }
}
