using healthcare_api.Db;
using healthcare_api.Interface;

namespace healthcare_api.Service
{
    public class DoctorService(TrxDbContext context) : IDoctorService
    {
        public async Task<bool> ApproveDoctorAsync(long userId)
        {
            var user = await context.Users.FindAsync(userId);

            if (user == null || user.Role != "Doctor")
            {
                return false;
            }

            // Merubah status dari InActive jadi Active
            user.Status = "Active";
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DisableDoctorAsync(long userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user == null || user.Role != "Doctor")
            {
                return false;
            }
            user.Status = "InActive";
            await context.SaveChangesAsync();
            return true;
        }
    }
}
