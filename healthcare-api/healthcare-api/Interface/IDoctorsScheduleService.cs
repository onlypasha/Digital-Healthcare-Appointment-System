using healthcare_api.Data;
using healthcare_api.Models.Transactional;

namespace healthcare_api.Interface
{
    public interface IDoctorsScheduleService
    {
        Task<DoctorsSchedule> CreateDoctorScheduleAsync(CreateDoctorScheduleRequestDto request);
        Task<List<DoctorScheduleResponseDto>> GetAllDoctorSchedulesAsync();
    }
}
