using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using healthcare_api.Models.Reporting;

namespace healthcare_api.Db;

public partial class RptDbContext : DbContext
{
    public RptDbContext()
    {
    }

    public RptDbContext(DbContextOptions<RptDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<FactDoctorPerformance> FactDoctorPerformances { get; set; }

    public virtual DbSet<FactMonthlyAppointment> FactMonthlyAppointments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:RptConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FactDoctorPerformance>(entity =>
        {
            entity.ToTable("Fact_DoctorPerformances");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DoctorName)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Specialization)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FactMonthlyAppointment>(entity =>
        {
            entity.ToTable("Fact_MonthlyAppointments");

            entity.Property(e => e.Id).HasColumnName("id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
