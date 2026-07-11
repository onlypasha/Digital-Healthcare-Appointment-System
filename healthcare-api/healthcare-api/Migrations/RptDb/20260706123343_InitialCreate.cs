using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace healthcare_api.Migrations.RptDb
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Fact_DoctorPerformances",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DoctorName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Specialization = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Year = table.Column<int>(type: "int", nullable: true),
                    Month = table.Column<int>(type: "int", nullable: true),
                    TotalPatientsHandled = table.Column<int>(type: "int", nullable: true),
                    LastSyncDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TotalRevenueGenerated = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fact_DoctorPerformances", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Fact_MonthlyAppointments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: true),
                    Month = table.Column<int>(type: "int", nullable: true),
                    TotalAppointments = table.Column<int>(type: "int", nullable: true),
                    TotalCompleted = table.Column<int>(type: "int", nullable: true),
                    TotalCancelled = table.Column<int>(type: "int", nullable: true),
                    TotalTeleconsultations = table.Column<int>(type: "int", nullable: true),
                    TotalOnSitesVisit = table.Column<int>(type: "int", nullable: true),
                    LastSyncDate = table.Column<DateOnly>(type: "date", nullable: true),
                    TotalRevenue = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fact_MonthlyAppointments", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fact_DoctorPerformances");

            migrationBuilder.DropTable(
                name: "Fact_MonthlyAppointments");
        }
    }
}
