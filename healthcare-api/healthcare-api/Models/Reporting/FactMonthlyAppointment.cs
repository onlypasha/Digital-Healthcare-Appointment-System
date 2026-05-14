using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Reporting;

public partial class FactMonthlyAppointment
{
    public int Id { get; set; }

    public int? Year { get; set; }

    public int? Month { get; set; }

    public int? TotalAppointments { get; set; }

    public int? TotalCompleted { get; set; }

    public int? TotalCancelled { get; set; }

    public int? TotalTeleconsultations { get; set; }

    public int? TotalOnSitesVisit { get; set; }

    public DateOnly? LastSyncDate { get; set; }

    public int? TotalRevenue { get; set; }
}
