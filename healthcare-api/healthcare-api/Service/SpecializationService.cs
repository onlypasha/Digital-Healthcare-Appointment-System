using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using healthcare_api.Data;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service
{
    public class SpecializationService(TrxDbContext context) : ISpecializationService
    {
        private readonly TrxDbContext context = context ?? throw new ArgumentNullException(nameof(context));

        public async Task<Specialization?> AddSpecializationAsync(AddSpecializationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Description))
            {
                return null;
            }

            var newSpecialization = new Specialization
            {
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
            };

            context.Specializations.Add(newSpecialization);
            await context.SaveChangesAsync();

            return newSpecialization;
        }

        public async Task<List<Specialization>> GetSpecializationsAsync()
        {
            return await context.Specializations.ToListAsync();
        }

        public async Task<Specialization?> UpdateSpecializationAsync(long id, UpdateSpecializationRequestDto request)
        {
            var specialization = await context.Specializations.FindAsync(id);
            if (specialization == null)
            {
                return null;
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                specialization.Name = request.Name;
            }

            if (!string.IsNullOrWhiteSpace(request.Description))
            {
                specialization.Description = request.Description;
            }

            await context.SaveChangesAsync();
            return specialization;
        }

        public async Task<bool> DeleteSpecializationAsync(long id)
        {
            var specialization = await context.Specializations
                .Include(s => s.Doctors)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (specialization == null)
            {
                return false;
            }

            // Cegah penghapusan jika masih ada dokter yang menggunakan spesialisasi ini
            if (specialization.Doctors.Any())
            {
                return false;
            }

            context.Specializations.Remove(specialization);
            await context.SaveChangesAsync();
            return true;
        }
    }
}
