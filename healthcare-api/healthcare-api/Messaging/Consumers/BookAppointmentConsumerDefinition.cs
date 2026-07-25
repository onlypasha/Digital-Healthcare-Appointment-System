using MassTransit;

namespace healthcare_api.Messaging.Consumers
{
    public class BookAppointmentConsumerDefinition : ConsumerDefinition<BookAppointmentConsumer>
    {
        protected override void ConfigureConsumer(IReceiveEndpointConfigurator endpointConfigurator, IConsumerConfigurator<BookAppointmentConsumer> consumerConfigurator, IRegistrationContext context)
        {
            // Limit consumer concurrency to 1 to serialize request processing per node
            endpointConfigurator.ConcurrentMessageLimit = 1;
            
            // Add retry policy for DB concurrency exceptions (like unique index violations or locks)
            endpointConfigurator.UseMessageRetry(r => r.Interval(3, System.TimeSpan.FromMilliseconds(200)));
        }
    }
}
