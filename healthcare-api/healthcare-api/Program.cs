using healthcare_api.Db;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
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

builder.Services.AddDbContext<RptDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("RptConnection"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
