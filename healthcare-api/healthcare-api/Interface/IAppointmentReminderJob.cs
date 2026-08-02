using System.Threading.Tasks;

namespace healthcare_api.Interface
{
    public interface IAppointmentReminderJob
    {
        /// <summary>
        /// Mengecek appointment yang dijadwalkan besok (H-1) dan mengirim email reminder ke masing-masing pasien.
        /// </summary>
        Task SendTomorrowAppointmentRemindersAsync();
    }
}
