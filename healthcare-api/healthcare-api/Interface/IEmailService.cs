using System.Threading.Tasks;

namespace healthcare_api.Interface
{
    public interface IEmailService
    {
        /// <summary>
        /// Mengirim email berbasis SMTP dengan subjek dan body HTML/plain text.
        /// </summary>
        /// <param name="toEmail">Alamat email penerima.</param>
        /// <param name="subject">Subjek email.</param>
        /// <param name="body">Isi pesan email (HTML didukung).</param>
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}