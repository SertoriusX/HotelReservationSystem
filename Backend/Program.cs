using HotelReservationSystem.Database;
using HotelReservationSystem.Reposity.BookingRep;
using HotelReservationSystem.Reposity.CityRep;
using HotelReservationSystem.Reposity.CountryRep;
using HotelReservationSystem.Reposity.HotelImageRep;
using HotelReservationSystem.Reposity.HotelRep;
using HotelReservationSystem.Reposity.PaymentRep;
using HotelReservationSystem.Reposity.ReviewRep;
using HotelReservationSystem.Reposity.RoomImgRep;
using HotelReservationSystem.Reposity.RoomRep;
using HotelReservationSystem.Reposity.WishListRep;
using HotelReservationSystem.Service;
using HotelReservationSystem.Service.AuthSer;
using HotelReservationSystem.Service.BookingSer;
using HotelReservationSystem.Service.CitySer;
using HotelReservationSystem.Service.CountrySer;
using HotelReservationSystem.Service.HotelImgSer;
using HotelReservationSystem.Service.HotelSer;
using HotelReservationSystem.Service.PaymentSer;
using HotelReservationSystem.Service.ReviewSer;
using HotelReservationSystem.Service.RoomImgSer;
using HotelReservationSystem.Service.RoomSer;
using HotelReservationSystem.Service.WishlistSer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

namespace HotelReservationSystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters
                        .Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true;
                });

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IHotelReposity, HotelReposity>();
            builder.Services.AddScoped<IHotelImageRep, HotelImageRep>();
            builder.Services.AddScoped<IBookingReposity, BookingReposity>();
            builder.Services.AddScoped<ICityReposity, CityReposity>();
            builder.Services.AddScoped<ICountryReposity, CountryReposity>();
            builder.Services.AddScoped<IReviewReposity, ReviewReposity>();
            builder.Services.AddScoped<IRoomRep, RoomRep>();
            builder.Services.AddScoped<IWishlistReposity, WishlistReposity>();
            builder.Services.AddScoped<IPaymentReposity, PaymentReposity>();
            builder.Services.AddScoped<IRoomImgReposity, RoomImgReposity>();
            
                            
            builder.Services.AddScoped<RoomImgService>();
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<HotelService>();
            builder.Services.AddScoped<HotelImgService>();
            builder.Services.AddScoped<RoomService>();
            builder.Services.AddScoped<BookingSer>();
            builder.Services.AddScoped<CityService>();
            builder.Services.AddScoped<CountryService>();
            builder.Services.AddScoped<ReviewService>();
            builder.Services.AddScoped<WishlistService>();
            builder.Services.AddHostedService<AutoPayBackgroundService>();
            var jwtSettings = builder.Configuration.GetSection("Jwt");

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings["Issuer"],
                        ValidAudience = jwtSettings["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
                    };
                });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                    policy.WithOrigins(
                        "http://localhost:3000",
                        "http://localhost:4200"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Seed Spain cities
            SeedSpainCities(app);

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseRouting();
            app.UseCors("AllowFrontend");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }

        private static void SeedSpainCities(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            if (context.Database.CanConnect())
            {
                    // Check if Spain exists, if not create it
                var spain = context.Countries.FirstOrDefault(c => c.Name == "Spain");
                if (spain == null)
                {
                    spain = new Entity.Country { Name = "Spain" };
                    context.Countries.Add(spain);
                    context.SaveChanges();
                }

                // Check if cities already exist
                if (!context.Cities.Any(c => c.CountryId == spain.Id))
                {
                    var spainCities = new List<Entity.City>
                    {
                        new() { Name = "Madrid", Latitude = 40.4168, Longitude = -3.7038, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Barcelona", Latitude = 41.3851, Longitude = 2.1734, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Valencia", Latitude = 39.4699, Longitude = -0.3763, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Seville", Latitude = 37.3891, Longitude = -5.9845, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Malaga", Latitude = 36.7213, Longitude = -4.4214, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Bilbao", Latitude = 43.2630, Longitude = -2.9250, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Donostia/San Sebastian", Latitude = 43.3203, Longitude = -1.9838, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Alicante", Latitude = 38.3452, Longitude = -0.4810, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Cordoba", Latitude = 37.8845, Longitude = -4.7796, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Granada", Latitude = 37.1773, Longitude = -3.5986, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Vigo", Latitude = 42.2406, Longitude = -8.7209, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Cartagena", Latitude = 37.6051, Longitude = -0.9292, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Cadiz", Latitude = 36.1408, Longitude = -6.0802, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Santander", Latitude = 43.4623, Longitude = -3.8099, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Santiago de Compostela", Latitude = 42.8782, Longitude = -8.5448, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Zaragoza", Latitude = 41.6488, Longitude = -0.8891, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Toledo", Latitude = 39.8628, Longitude = -4.0273, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Segovia", Latitude = 40.9429, Longitude = -4.1084, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Avila", Latitude = 40.6566, Longitude = -4.7000, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Salamanca", Latitude = 40.9702, Longitude = -5.6635, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Almeria", Latitude = 36.8340, Longitude = -2.4637, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Huelva", Latitude = 37.2616, Longitude = -6.9448, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Albacete", Latitude = 38.9946, Longitude = -1.8586, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Jaen", Latitude = 37.7642, Longitude = -3.7914, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Badajoz", Latitude = 38.8777, Longitude = -6.9706, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Logrono", Latitude = 42.4667, Longitude = -2.4500, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Valladolid", Latitude = 41.6528, Longitude = -4.7241, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Palencia", Latitude = 42.0096, Longitude = -4.3507, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Leon", Latitude = 42.5987, Longitude = -5.5701, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Burgos", Latitude = 42.3439, Longitude = -3.6968, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Lleida", Latitude = 41.6176, Longitude = 0.6200, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Girona", Latitude = 41.9794, Longitude = 2.8212, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Tarragona", Latitude = 41.1189, Longitude = 1.2445, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Melilla", Latitude = 35.2938, Longitude = -2.9384, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Ceuta", Latitude = 35.8914, Longitude = -5.3193, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Santa Cruz de Tenerife", Latitude = 28.4636, Longitude = -16.2519, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Las Palmas de Gran Canaria", Latitude = 28.1248, Longitude = -15.4306, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Pamplona", Latitude = 42.8125, Longitude = -1.6458, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Vitoria-Gasteiz", Latitude = 42.8543, Longitude = -2.6813, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Merida", Latitude = 38.9108, Longitude = -6.0884, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Cuenca", Latitude = 40.0750, Longitude = -2.1478, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Huesca", Latitude = 42.1318, Longitude = -0.4178, CountryId = spain.Id, CreatedAt = DateTime.UtcNow },
                        new() { Name = "Teruel", Latitude = 40.3456, Longitude = -1.1065, CountryId = spain.Id, CreatedAt = DateTime.UtcNow }
                    };

                    context.Cities.AddRange(spainCities);
                    context.SaveChanges();
                    Console.WriteLine($"Seeded {spainCities.Count} Spain cities to database.");
                }
                else
                {
                    Console.WriteLine("Spain cities already exist in database.");
                }
            }
        }
    }
}
