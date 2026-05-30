namespace healthcare_api.Data
{
    public class UpdateDoctorDto
    {
        public long? SpecializationId { get; set; }

        public decimal? ConsultationFee { get; set; }

        public string? Phone { get; set; }
    }
}
