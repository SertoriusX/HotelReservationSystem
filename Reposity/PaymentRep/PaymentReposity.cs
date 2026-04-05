using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.PaymentRep
{
    public class PaymentReposity : IPaymentReposity
    {
        private readonly ApplicationDbContext _context;

        public PaymentReposity(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync() =>
            await _context.Payments.Include(p => p.Booking).Include(p => p.User).ToListAsync();

        public async Task<Payment?> GetByIdAsync(int id) =>
            await _context.Payments.Include(p => p.Booking).Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);

        public async Task<Payment?> GetByBookingIdAsync(int bookingId) =>
            await _context.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);

        public async Task<Payment?> GetByPaymentIntentIdAsync(string paymentIntentId) =>
            await _context.Payments.FirstOrDefaultAsync(p => p.PaymentIntentId == paymentIntentId);

        public async Task CreateAsync(Payment payment) =>
            await _context.Payments.AddAsync(payment);

        public Task UpdateAsync(Payment payment)
        {
            _context.Payments.Update(payment);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
