namespace healthcare_api.Interface
{
    public interface IDoctorService
    {
        Task<bool> ApproveDoctorAsync(long userId);
        Task<bool> DisableDoctorAsync(long userId);
    }
}
