using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Reporting;

public partial class FactDoctorPerformance
{
    public int Id { get; set; }

    public string? DoctorName { get; set; }

    public string? Specialization { get; set; }

    public int? Year { get; set; }

    public int? Month { get; set; }

    public int? TotalPatientsHandled { get; set; }

    public DateOnly? LastSyncDate { get; set; }

    public int? TotalRevenueGenerated { get; set; }
}
