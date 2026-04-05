using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.BookingRep;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Service
{
    public class AutoPayBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AutoPayBackgroundService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

        public AutoPayBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<AutoPayBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessAutoPayBookings();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing auto-pay bookings");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task ProcessAutoPayBookings()
        {
            using var scope = _serviceProvider.CreateScope();
            var bookingRepo = scope.ServiceProvider.GetRequiredService<IBookingReposity>();

            var allBookings = await bookingRepo.GetAllBookingsAsync();

            var pendingAutoPay = allBookings.Where(b =>
                b.CardSaved &&
                !b.IsPaid &&
                b.Status == BookingStatus.Pending &&
                b.CheckIn > DateTime.UtcNow
            ).ToList();

            foreach (var booking in pendingAutoPay)
            {
                try
                {
                    var daysUntilCheckIn = (booking.CheckIn - DateTime.UtcNow).Days;
                    
                    var autoPayDays = booking.Room?.Hotel?.AutoPayDaysBefore ?? 7;
                    
                    // Auto-pay ONLY when exactly X days before check-in
                    if (daysUntilCheckIn == autoPayDays)
                    {
                        _logger.LogInformation($"Processing auto-pay for booking {booking.Id}, days until check-in: {daysUntilCheckIn}");
                        
                        booking.IsPaid = true;
                        booking.Status = BookingStatus.Confirmed;
                        
                        await bookingRepo.UpdateBookingAsync(booking);
                        await bookingRepo.SaveChangesAsync();
                        
                        _logger.LogInformation($"Auto-pay successful for booking {booking.Id}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to process auto-pay for booking {booking.Id}");
                }
            }
        }
    }
}