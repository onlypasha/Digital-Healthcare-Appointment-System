namespace healthcare_api.Data
{
    public class CreateDoctorScheduleRequestDto
    {
        public long? DoctorsId { get; set; }

        public string? DayOfWeek { get; set; }

        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }
    }
}
