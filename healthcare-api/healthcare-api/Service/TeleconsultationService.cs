using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class TeleconsultationService(TrxDbContext context) : ITeleconsultationService
    {
        private readonly TrxDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<long?> StartSessionAsync(StartTeleconsultationDto request, long userId, string role)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctors)
                .Include(a => a.Patients)
                .Include(a => a.Teleconsultations)
                .FirstOrDefaultAsync(a => a.Id == request.AppointmentId);

            if (appointment == null) return null;

            // Authorization: Only the assigned doctor or patient can start it
            if (role == "Doctor" && appointment.Doctors?.UserId != userId) return null;
            if (role == "Patient" && appointment.Patients?.UserId != userId) return null;

            // Check if teleconsultation already exists
            var teleconsultation = appointment.Teleconsultations.FirstOrDefault();
            if (teleconsultation == null)
            {
                teleconsultation = new Teleconsultation
                {
                    AppointmentsId = appointment.Id,
                    StartTime = DateTime.UtcNow,
                    Status = "In Progress"
                };
                _context.Teleconsultations.Add(teleconsultation);
            }
            else if (teleconsultation.Status == "Completed")
            {
                return null; // Cannot start a completed session
            }

            await _context.SaveChangesAsync();
            return teleconsultation.Id;
        }

        public async Task<bool> EndSessionAsync(EndTeleconsultationDto request, long userId, string role)
        {
            var teleconsultation = await _context.Teleconsultations
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Doctors)
                .FirstOrDefaultAsync(t => t.Id == request.TeleconsultationId);

            if (teleconsultation == null || teleconsultation.Appointments == null) return false;

            // Only the assigned doctor can end the session
            if (role != "Doctor" || teleconsultation.Appointments.Doctors?.UserId != userId) return false;

            teleconsultation.EndTime = DateTime.UtcNow;
            teleconsultation.Status = "Completed";
            
            // Optionally, mark the appointment as completed too
            teleconsultation.Appointments.Status = "Completed";

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CanAccessSessionAsync(long teleconsultationId, long userId, string role)
        {
            var teleconsultation = await _context.Teleconsultations
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Doctors)
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Patients)
                .FirstOrDefaultAsync(t => t.Id == teleconsultationId);

            if (teleconsultation == null || teleconsultation.Appointments == null) return false;

            if (role == "Doctor" && teleconsultation.Appointments.Doctors?.UserId != userId) return false;
            if (role == "Patient" && teleconsultation.Appointments.Patients?.UserId != userId) return false;

            return true;
        }

        public async Task<MessageResponseDto?> SaveMessageAsync(SendMessageDto request, long senderId)
        {
            var teleconsultation = await _context.Teleconsultations
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Doctors)
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Patients)
                .FirstOrDefaultAsync(t => t.Id == request.TeleconsultationId);

            if (teleconsultation == null || teleconsultation.Status == "Completed" || teleconsultation.Appointments == null) 
                return null;

            // Authorization: sender must be the assigned doctor or patient
            bool isDoctor = teleconsultation.Appointments.Doctors?.UserId == senderId;
            bool isPatient = teleconsultation.Appointments.Patients?.UserId == senderId;
            
            if (!isDoctor && !isPatient) return null;

            var message = new TeleconsultationMessage
            {
                TeleconsultationId = request.TeleconsultationId,
                SenderId = senderId,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.TeleconsultationMessages.Add(message);
            await _context.SaveChangesAsync();

            return new MessageResponseDto
            {
                Id = message.Id,
                TeleconsultationId = message.TeleconsultationId ?? 0,
                SenderId = message.SenderId,
                Content = message.Content,
                CreatedAt = message.CreatedAt
            };
        }

        public async Task<List<MessageResponseDto>> GetChatHistoryAsync(long teleconsultationId, long userId, string role)
        {
            var teleconsultation = await _context.Teleconsultations
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Doctors)
                .Include(t => t.Appointments)
                .ThenInclude(a => a.Patients)
                .FirstOrDefaultAsync(t => t.Id == teleconsultationId);

            if (teleconsultation == null || teleconsultation.Appointments == null) return new List<MessageResponseDto>();

            // Authorization
            if (role == "Doctor" && teleconsultation.Appointments.Doctors?.UserId != userId) return new List<MessageResponseDto>();
            if (role == "Patient" && teleconsultation.Appointments.Patients?.UserId != userId) return new List<MessageResponseDto>();

            var messages = await _context.TeleconsultationMessages
                .Where(m => m.TeleconsultationId == teleconsultationId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    TeleconsultationId = m.TeleconsultationId ?? 0,
                    SenderId = m.SenderId,
                    Content = m.Content ?? string.Empty,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return messages;
        }
    }
}
