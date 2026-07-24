# Project: Digital Healthcare Appointment System (healthcare-api)

## Tech Stack
- **Framework**: .NET 10.0 ASP.NET Core Web API
- **Language**: C# 13
- **Primary Database (Transactional)**: PostgreSQL (EF Core via `Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Secondary Database (Reporting/Jobs)**: Microsoft SQL Server (EF Core via `Microsoft.EntityFrameworkCore.SqlServer`)
- **Authentication**: JWT Bearer Tokens (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **Real-Time Messaging**: ASP.NET Core SignalR (`/hubs/teleconsultation`)
- **Background Jobs**: Hangfire (`Hangfire.SqlServer`)
- **Event Bus / Message Queue**: MassTransit with SQL Server Transport
- **API Documentation**: OpenAPI + Scalar (`Scalar.AspNetCore`)

## Commands
- **Build**: `dotnet build`
- **Run Dev**: `dotnet run`
- **Add Migration (Trx PostgreSQL)**: `dotnet ef migrations add <MigrationName> --context TrxDbContext`
- **Add Migration (Rpt SQL Server)**: `dotnet ef migrations add <MigrationName> --context RptDbContext`
- **Update Database (Trx)**: `dotnet ef database update --context TrxDbContext`
- **Update Database (Rpt)**: `dotnet ef database update --context RptDbContext`

## Project Structure & Architecture
- **Controllers/**: API Controllers handling HTTP requests (`Appointment`, `Auth`, `Doctor`, `DoctorSchedule`, `Specialization`, `Teleconsultation`, `Backup`).
- **Service/** & **Interface/**: Core domain logic implemented behind interface abstractions (`IAppointmentService`, `IAuthService`, etc.).
- **Models/**: Data entities partitioned into:
  - `Models/Transactional/`: PostgreSQL domain models (`User`, `Doctor`, `Patient`, `Appointment`, `MedicalRecord`, `Teleconsultation`, `TeleconsultationMessage`, `DoctorsSchedule`, `Specialization`).
  - `Models/Reporting/`: SQL Server fact tables (`FactDoctorPerformance`, `FactMonthlyAppointment`).
- **Db/**: EF Core contexts:
  - `TrxDbContext`: PostgreSQL transactional context.
  - `RptDbContext`: SQL Server reporting context.
- **Messaging/**: Event consumers & message models using MassTransit.
- **Hubs/**: SignalR hubs for real-time teleconsultation chat.
- **Middleware/**: `GlobalExceptionHandler` returning `ProblemDetails`.

## Conventions & Rules
- Depend on interfaces (`ISomethingService`), registered in `Program.cs` as `Scoped`.
- Retain dual-database segregation: Operational data goes to Postgres (`TrxDbContext`), reporting facts go to SQL Server (`RptDbContext`).
- Keep controller endpoints thin; delegate logic to service classes.
- Use async/await for all DB and asynchronous operations.
- Always handle nullability appropriately (`Nullable` is enabled in C# 10).
