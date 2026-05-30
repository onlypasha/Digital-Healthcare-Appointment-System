namespace healthcare_api.Messaging.Events
{
    public record DoctorApprovedEvent(
        long DoctorId,
        string Name,
        string Email
    );
}
