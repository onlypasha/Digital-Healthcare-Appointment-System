using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Service;
using healthcare_api.Middleware;
using healthcare_api.Hubs;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Hangfire;
using Hangfire.SqlServer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

// Konfigurasi Autentikasi JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader() 
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<TrxDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("TrxConnection"));
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDoctorsScheduleService, DoctorsScheduleService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<ISpecializationService, SpecializationService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IBackupTrxToRpt, BackupTrxToRptService>();
builder.Services.AddScoped<ITeleconsultationService, TeleconsultationService>();
builder.Services.AddScoped<IMedicalRecordService, MedicalRecordService>();

builder.Services.AddSignalR();

// Menggunakan RptConnection (SQL Server) sebagai media penyimpanan Hangfire
builder.Services.AddHangfire(cfg => cfg
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("RptConnection")));
builder.Services.AddHangfireServer();
builder.Services.AddOptions<SqlTransportOptions>()
    .Configure(options =>
    {
        options.ConnectionString = builder.Configuration.GetConnectionString("RptConnection");
    });

builder.Services.AddSqlServerMigrationHostedService(options =>
{
    options.CreateDatabase = false;
    options.CreateInfrastructure = true;
});

builder.Services.AddMassTransit(x =>
{
    x.AddConsumers(typeof(Program).Assembly);
    x.UsingSqlServer((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddDbContext<RptDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("RptConnection"));
});

var app = builder.Build();

// Dashboard Hangfire hanya aktif pada lingkungan Development
if (app.Environment.IsDevelopment())
    app.UseHangfireDashboard("/hangfire");

// Tugas berkala: Pemeliharaan/backup bulanan pada tanggal 1 pukul 00:05 UTC
RecurringJob.AddOrUpdate<IBackupTrxToRpt>(
    "monthly-backup-doctor-performance",
    svc => svc.BackupDoctorPerformanceAsync(DateTime.UtcNow.AddMonths(-1).Year, DateTime.UtcNow.AddMonths(-1).Month),
    "5 0 1 * *");
RecurringJob.AddOrUpdate<IBackupTrxToRpt>(
    "monthly-backup-monthly-appointment",
    svc => svc.BackupMonthlyAppointmentAsync(DateTime.UtcNow.AddMonths(-1).Year, DateTime.UtcNow.AddMonths(-1).Month),
    "5 0 1 * *");

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TeleconsultationHub>("/hubs/teleconsultation");

app.Run();
