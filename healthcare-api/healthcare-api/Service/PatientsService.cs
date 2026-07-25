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
    }
}