namespace healthcare_api.Messaging.Events
{
    public record DoctorRegisteredEvent(
        long DoctorId,
        string Name,
        string Email,
        long SpecializationId
    );
}
