using System;
using System.Collections.Generic;
using healthcare_api.Models.Transactional;
using Microsoft.EntityFrameworkCore;

namespace healthcare_api.Db;

public partial class TrxDbContext : DbContext
{
    public TrxDbContext()
    {
    }

    public TrxDbContext(DbContextOptions<TrxDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<DoctorsSchedule> DoctorsSchedules { get; set; }

    public virtual DbSet<MedicalRecord> MedicalRecords { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Teleconsultation> Teleconsultations { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:TrxConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum("auth", "aal_level", new[] { "aal1", "aal2", "aal3" })
            .HasPostgresEnum("auth", "code_challenge_method", new[] { "s256", "plain" })
            .HasPostgresEnum("auth", "factor_status", new[] { "unverified", "verified" })
            .HasPostgresEnum("auth", "factor_type", new[] { "totp", "webauthn", "phone" })
            .HasPostgresEnum("auth", "oauth_authorization_status", new[] { "pending", "approved", "denied", "expired" })
            .HasPostgresEnum("auth", "oauth_client_type", new[] { "public", "confidential" })
            .HasPostgresEnum("auth", "oauth_registration_type", new[] { "dynamic", "manual" })
            .HasPostgresEnum("auth", "oauth_response_type", new[] { "code" })
            .HasPostgresEnum("auth", "one_time_token_type", new[] { "confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token" })
            .HasPostgresEnum("realtime", "action", new[] { "INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR" })
            .HasPostgresEnum("realtime", "equality_op", new[] { "eq", "neq", "lt", "lte", "gt", "gte", "in" })
            .HasPostgresEnum("storage", "buckettype", new[] { "STANDARD", "ANALYTICS", "VECTOR" })
            .HasPostgresExtension("extensions", "pg_stat_statements")
            .HasPostgresExtension("extensions", "pgcrypto")
            .HasPostgresExtension("extensions", "uuid-ossp")
            .HasPostgresExtension("vault", "supabase_vault");

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Appointments_pkey");

            entity.Property(e => e.AppointmentsDate).HasColumnType("timestamp without time zone");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.Status).HasColumnType("character varying");

            entity.HasOne(d => d.Doctors).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.DoctorsId)
                .HasConstraintName("Appointments_DoctorsId_fkey");

            entity.HasOne(d => d.Patients).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientsId)
                .HasConstraintName("Appointments_PatientsId_fkey");
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Doctors_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.Phone).HasColumnType("character varying");
            entity.Property(e => e.Specialization).HasColumnType("character varying");

            entity.HasOne(d => d.User).WithMany(p => p.Doctors)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("Doctors_UserId_fkey");
        });

        modelBuilder.Entity<DoctorsSchedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("DoctorsSchedule_pkey");

            entity.ToTable("DoctorsSchedule");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");

            entity.HasOne(d => d.Doctor).WithMany(p => p.DoctorsSchedules)
                .HasForeignKey(d => d.DoctorsId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("DoctorsSchedule_DoctorsId_fkey");
        });

        modelBuilder.Entity<MedicalRecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("MedicalRecords_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");

            entity.HasOne(d => d.Appointments).WithMany(p => p.MedicalRecords)
                .HasForeignKey(d => d.AppointmentsId)
                .HasConstraintName("MedicalRecords_AppointmentsId_fkey");

            entity.HasOne(d => d.Doctors).WithMany(p => p.MedicalRecords)
                .HasForeignKey(d => d.DoctorsId)
                .HasConstraintName("MedicalRecords_DoctorsId_fkey");

            entity.HasOne(d => d.Patients).WithMany(p => p.MedicalRecords)
                .HasForeignKey(d => d.PatientsId)
                .HasConstraintName("MedicalRecords_PatientsId_fkey");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Patients_pkey");

            entity.Property(e => e.BloodType).HasColumnType("character varying");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.Gender).HasColumnType("character varying");
            entity.Property(e => e.Phone).HasColumnType("character varying");

            entity.HasOne(d => d.User).WithMany(p => p.Patients)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("Patients_UserId_fkey");
        });

        modelBuilder.Entity<Teleconsultation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Teleconsultations_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.EndTime).HasColumnType("timestamp without time zone");
            entity.Property(e => e.StartTime).HasColumnType("timestamp without time zone");
            entity.Property(e => e.Status).HasColumnType("character varying");

            entity.HasOne(d => d.Appointments).WithMany(p => p.Teleconsultations)
                .HasForeignKey(d => d.AppointmentsId)
                .HasConstraintName("Teleconsultations_AppointmentsId_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            entity.Property(e => e.Email).HasColumnType("character varying");
            entity.Property(e => e.PasswordHash).HasColumnType("character varying");
            entity.Property(e => e.Role).HasColumnType("character varying");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("'Active'::character varying")
                .HasColumnType("character varying");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
