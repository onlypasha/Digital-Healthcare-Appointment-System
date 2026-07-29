using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Reporting;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Service;

public class BackupTrxToRptService(TrxDbContext trx, RptDbContext rpt) : IBackupTrxToRpt
{
    public async Task<List<FactDoctorPerformance>> BackupDoctorPerformanceAsync(int year, int month)
    {
        // Agregasi performa dokter langsung melalui LINQ
        var rows = await trx.Appointments
            .Include(a => a.Doctors).ThenInclude(d => d!.User)
            .Include(a => a.Doctors).ThenInclude(d => d!.Specialization)
            .Where(a =>
                a.Status == "Completed" &&
                a.AppointmentsDate.HasValue &&
                a.AppointmentsDate.Value.Year == year &&
                a.AppointmentsDate.Value.Month == month)
            .GroupBy(a => new
            {
                DoctorName = a.Doctors!.User!.Name ?? "Unknown",
                Specialization = a.Doctors!.Specialization!.Name ?? "Unknown"
            })
            .Select(g => new
            {
                g.Key.DoctorName,
                g.Key.Specialization,
                TotalPatientsHandled = g.Count(),
                TotalRevenueGenerated = (int)g.Sum(a => (double)(a.Doctors!.ConsultationFee ?? 0))
            })
            .ToListAsync();

        var results = new List<FactDoctorPerformance>();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        foreach (var row in rows)
        {
            // Operasi Upsert: perbarui jika data sudah ada, buat baru jika belum
            var existing = await rpt.FactDoctorPerformances.FirstOrDefaultAsync(f =>
                f.DoctorName == row.DoctorName && f.Year == year && f.Month == month);

            if (existing != null)
            {
                existing.Specialization = row.Specialization;
                existing.TotalPatientsHandled = row.TotalPatientsHandled;
                existing.TotalRevenueGenerated = row.TotalRevenueGenerated;
                existing.LastSyncDate = today;
                results.Add(existing);
            }
            else
            {
                var fact = new FactDoctorPerformance
                {
                    DoctorName = row.DoctorName,
                    Specialization = row.Specialization,
                    Year = year,
                    Month = month,
                    TotalPatientsHandled = row.TotalPatientsHandled,
                    TotalRevenueGenerated = row.TotalRevenueGenerated,
                    LastSyncDate = today
                };
                rpt.FactDoctorPerformances.Add(fact);
                results.Add(fact);
            }
        }

        await rpt.SaveChangesAsync();
        return results;
    }

    public async Task<FactMonthlyAppointment> BackupMonthlyAppointmentAsync(int year, int month)
    {
        var appointments = await trx.Appointments
            .Where(a =>
                a.AppointmentsDate.HasValue &&
                a.AppointmentsDate.Value.Year == year &&
                a.AppointmentsDate.Value.Month == month)
            .ToListAsync();

        var totalRevenue = await trx.Appointments
            .Include(a => a.Doctors)
            .Where(a =>
                a.Status == "Completed" &&
                a.AppointmentsDate.HasValue &&
                a.AppointmentsDate.Value.Year == year &&
                a.AppointmentsDate.Value.Month == month)
            .SumAsync(a => (double)(a.Doctors!.ConsultationFee ?? 0));

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Kolom TotalTeleconsultations & TotalOnSiteVisit diset null (menunggu perancangan ulang DB)
        var existing = await rpt.FactMonthlyAppointments.FirstOrDefaultAsync(f =>
            f.Year == year && f.Month == month);

        if (existing != null)
        {
            existing.TotalAppointments = appointments.Count;
            existing.TotalCompleted = appointments.Count(a => a.Status == "Completed");
            existing.TotalCancelled = appointments.Count(a => a.Status == "Cancelled");
            existing.TotalRevenue = (int)totalRevenue;
            existing.LastSyncDate = today;
            await rpt.SaveChangesAsync();
            return existing;
        }

        var fact = new FactMonthlyAppointment
        {
            Year = year,
            Month = month,
            TotalAppointments = appointments.Count,
            TotalCompleted = appointments.Count(a => a.Status == "Completed"),
            TotalCancelled = appointments.Count(a => a.Status == "Cancelled"),
            TotalRevenue = (int)totalRevenue,
            LastSyncDate = today
        };

        rpt.FactMonthlyAppointments.Add(fact);
        await rpt.SaveChangesAsync();
        return fact;
    }
}
