using System;
using System.Linq;
using System.Threading.Tasks;
using healthcare_api.Db;
using healthcare_api.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Service
{
    public class AppointmentReminderJob : IAppointmentReminderJob
    {
        private readonly TrxDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<AppointmentReminderJob> _logger;

        public AppointmentReminderJob(TrxDbContext context, IEmailService emailService, ILogger<AppointmentReminderJob> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task SendTomorrowAppointmentRemindersAsync()
        {
            var tomorrowStart = DateTime.UtcNow.Date.AddDays(1);
            var tomorrowEnd = tomorrowStart.AddDays(1);

            _logger.LogInformation("Running H-1 Appointment Reminder job for date range: {Start} to {End}", tomorrowStart, tomorrowEnd);

            var appointments = await _context.Appointments
                .Include(a => a.Patients).ThenInclude(p => p!.User)
                .Include(a => a.Doctors).ThenInclude(d => d!.User)
                .Include(a => a.Doctors).ThenInclude(d => d!.Specialization)
                .Where(a => a.AppointmentsDate >= tomorrowStart && a.AppointmentsDate < tomorrowEnd)
                .Where(a => a.Status != "Cancelled" && a.Status != "Completed")
                .ToListAsync();

            _logger.LogInformation("Found {Count} appointment(s) scheduled for tomorrow.", appointments.Count);

            foreach (var appt in appointments)
            {
                var patientEmail = appt.Patients?.User?.Email;
                var patientName = appt.Patients?.User?.Name ?? "Pasien";
                var doctorName = appt.Doctors?.User?.Name ?? "Dokter";
                var specialization = appt.Doctors?.Specialization?.Name ?? "-";
                var appointmentTime = appt.AppointmentsDate.HasValue 
                    ? appt.AppointmentsDate.Value.ToString("dd MMMM yyyy HH:mm") 
                    : "-";

                if (!string.IsNullOrWhiteSpace(patientEmail))
                {
                    var subject = "Pengingat Jadwal Appointment (H-1) - Digital Healthcare";
                    var body = $@"
                        <h3>Halo, {patientName}!</h3>
                        <p>Ini adalah pengingat bahwa Anda memiliki jadwal konsultasi besok:</p>
                        <ul>
                            <li><strong>Dokter:</strong> Dr. {doctorName} ({specialization})</li>
                            <li><strong>Waktu:</strong> {appointmentTime} WIB</li>
                            <li><strong>Nomor Antrean:</strong> #{appt.QueueNumber}</li>
                            <li><strong>Keluhan:</strong> {appt.Complaint ?? "-"}</li>
                        </ul>
                        <p>Mohon hadir tepat waktu sesuai jadwal yang telah ditentukan.</p>
                        <br/>
                        <p>Salam hangat,<br/>Tim Digital Healthcare</p>";

                    await _emailService.SendEmailAsync(patientEmail, subject, body);
                }
            }
        }
    }
}
