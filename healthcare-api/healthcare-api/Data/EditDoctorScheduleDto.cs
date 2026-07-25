using healthcare_api.Models.Transactional;

namespace healthcare_api.Data
{
    public class EditDoctorScheduleDto
    {
        public long DoctorsId { get; set; }
        public string? DayOfWeek { get; set; }

        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }
    }
}
