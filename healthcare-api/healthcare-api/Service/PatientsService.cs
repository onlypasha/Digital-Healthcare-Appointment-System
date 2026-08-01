using System;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class PatientsService(TrxDbContext context) : IPatientsService
    {
        private readonly TrxDbContext _context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<PatientsResponseDto?> GetPatientsProfileByIdAsync(long id)
        {
            var patient = await _context.Patients
                .AsNoTracking()
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id || p.UserId == id);

            if (patient == null)
            {
                return null;
            }

            return new PatientsResponseDto
            {
                Id = patient.Id,
                UserId = patient.UserId,
                Name = patient.User?.Name,
                Email = patient.User?.Email,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                BloodType = patient.BloodType,
                Phone = patient.Phone,
                Address = patient.Address,
                CreatedAt = patient.CreatedAt
            };
        }

        // Update profil pasien: hanya nomor HP, alamat, dan golongan darah
        public async Task<PatientsResponseDto?> UpdatePatientProfileAsync(long userId, UpdatePatientProfileDto request)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
            {
                return null;
            }

            if (request.Phone != null) patient.Phone = request.Phone;
            if (request.Address != null) patient.Address = request.Address;
            if (request.BloodType != null) patient.BloodType = request.BloodType;

            await _context.SaveChangesAsync();

            return new PatientsResponseDto
            {
                Id = patient.Id,
                UserId = patient.UserId,
                Name = patient.User?.Name,
                Email = patient.User?.Email,
                BirthDate = patient.BirthDate,
                Gender = patient.Gender,
                BloodType = patient.BloodType,
                Phone = patient.Phone,
                Address = patient.Address,
                CreatedAt = patient.CreatedAt
            };
        }
    }
}