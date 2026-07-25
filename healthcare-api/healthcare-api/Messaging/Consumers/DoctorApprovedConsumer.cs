using healthcare_api.Messaging.Events;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Messaging.Consumers
{
    public class DoctorApprovedConsumer(ILogger<DoctorApprovedConsumer> logger) : IConsumer<DoctorApprovedEvent>
    {
        public Task Consume(ConsumeContext<DoctorApprovedEvent> context)
        {
            var message = context.Message;
            
            logger.LogInformation("NOTIFICATION: Doctor Approved. ID: {Id}, Name: {Name}, Email: {Email}. Sending welcome email to the doctor...", 
                message.DoctorId, message.Name, message.Email);
            
            return Task.CompletedTask;
        }
    }
}
