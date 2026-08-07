using System;
using System.Threading.Tasks;
using healthcare_api.Db;
using healthcare_api.Models.Transactional;
using healthcare_api.Service;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace test_approve
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Setting up test data...");

            var options = new DbContextOptionsBuilder<TrxDbContext>()
                .UseInMemoryDatabase(databaseName: "TestApproveDb")
                .Options;

            using (var context = new TrxDbContext(options))
            {
                // Create a User (Id = 100)
                var user = new User
                {
                    Id = 100,
                    Name = "Test Doctor",
                    Email = "doctor@test.com",
                    Role = "Doctor",
                    Status = "Pending"
                };
                context.Users.Add(user);

                // Create a Doctor (Id = 1) referencing User Id = 100
                var doctor = new Doctor
                {
                    Id = 1,
                    UserId = 100,
                    Phone = "123456"
                };
                context.Doctors.Add(doctor);
                
                await context.SaveChangesAsync();
            }

            // Test
            using (var context = new TrxDbContext(options))
            {
                var mockPublishEndpoint = new Mock<IPublishEndpoint>();
                var doctorService = new DoctorService(context, mockPublishEndpoint.Object);

                Console.WriteLine("Simulating frontend sending Doctor.Id (1) to approve...");
                var doctorIdFromFrontend = 1L; // Frontend sends Doctor.Id

                var result = await doctorService.ApproveDoctorAsync(doctorIdFromFrontend);
                if (result)
                {
                    Console.WriteLine("SUCCESS: Doctor approved (This shouldn't happen with the bug)");
                }
                else
                {
                    Console.WriteLine("BUG REPRODUCED: Doctor not found (Returned false)");
                }
            }
        }
    }
}
