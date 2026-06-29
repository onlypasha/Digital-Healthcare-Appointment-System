using healthcare_api.Models.Reporting;

namespace healthcare_api.Interface;

public interface IBackupTrxToRpt
{
    /// <summary>Aggregates completed appointments per doctor for the given month and upserts into Fact_DoctorPerformances.</summary>
    Task<List<FactDoctorPerformance>> BackupDoctorPerformanceAsync(int year, int month);

    /// <summary>Aggregates appointment statistics for the given month and upserts into Fact_MonthlyAppointments.</summary>
    Task<FactMonthlyAppointment> BackupMonthlyAppointmentAsync(int year, int month);
}