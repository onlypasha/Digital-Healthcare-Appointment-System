namespace healthcare_api.Data
{
    public class DoctorControllerResponse
    {
        public string message { get; set; } = string.Empty;
    }

    public class DoctorResponseDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public long? SpecializationId { get; set; }
        public string? SpecializationName { get; set; }
        public decimal? ConsultationFee { get; set; }
        public string? Phone { get; set; }
    }

    public class SpecializationResponseDto
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
