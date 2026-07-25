namespace healthcare_api.Data
{
    public class DoctorScheduleResponseDto
    {
        public long Id { get; set; }
        public long? DoctorsId { get; set; }
        public string? DoctorName { get; set; }
        public string? Specialization { get; set; }
        public string? DayOfWeek { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
    }
}
