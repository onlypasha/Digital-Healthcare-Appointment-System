using healthcare_api.Messaging.Events;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Messaging.Consumers
{
    public class DoctorRegisteredConsumer(ILogger<DoctorRegisteredConsumer> logger) : IConsumer<DoctorRegisteredEvent>
    {
        public Task Consume(ConsumeContext<DoctorRegisteredEvent> context)
        {
            var message = context.Message;
            
            logger.LogInformation("NOTIFICATION: New Doctor Registered. ID: {Id}, Name: {Name}, Email: {Email}. Notifying Admin for approval...", 
                message.DoctorId, message.Name, message.Email);
            
            return Task.CompletedTask;
        }
    }
}
