using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace healthcare_api.Migrations
{
    /// <inheritdoc />
    public partial class AddTeleconsultationMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeleconsultationMessages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    TeleconsultationId = table.Column<long>(type: "bigint", nullable: true),
                    SenderId = table.Column<long>(type: "bigint", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TeleconsultationMessages_pkey", x => x.Id);
                    table.ForeignKey(
                        name: "TeleconsultationMessages_SenderId_fkey",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "TeleconsultationMessages_TeleconsultationId_fkey",
                        column: x => x.TeleconsultationId,
                        principalTable: "Teleconsultations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeleconsultationMessages_SenderId",
                table: "TeleconsultationMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_TeleconsultationMessages_TeleconsultationId",
                table: "TeleconsultationMessages",
                column: "TeleconsultationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeleconsultationMessages");
        }
    }
}
