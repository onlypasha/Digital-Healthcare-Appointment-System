using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace healthcare_api.Service
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _smtpSettings = configuration.GetSection("SmtpSettings").Get<SmtpSettings>() ?? new SmtpSettings();
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                _logger.LogWarning("Email recipient address is empty. Skipping email sending.");
                return;
            }

            if (string.IsNullOrWhiteSpace(_smtpSettings.SenderEmail) || string.IsNullOrWhiteSpace(_smtpSettings.Password))
            {
                _logger.LogError("SMTP settings (SenderEmail or Password) are missing or empty. Cannot send email.");
                return;
            }

            try
            {
                using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port);
                client.UseDefaultCredentials = false; // Harus di-set sebelum Credentials
                client.Credentials = new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.Password);
                client.EnableSsl = _smtpSettings.EnableSsl;

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                _logger.LogInformation("Email successfully sent to {ToEmail} with subject: '{Subject}'", toEmail, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {ToEmail}. Error: {Message}", toEmail, ex.Message);
            }
        }
    }
}
