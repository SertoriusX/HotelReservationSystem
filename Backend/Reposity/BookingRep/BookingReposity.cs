using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.BookingRep
{
    public class BookingReposity : IBookingReposity
    {
        private readonly ApplicationDbContext _context;
        public BookingReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Booking>> GetAllBookingsAsync() => await _context.Bookings.Include(b => b.User).Include(b => b.Room).ThenInclude(r => r.Hotel).ToListAsync();
        public async Task<IEnumerable<Booking>> GetAllBookingRep(int roomId) => await _context.Bookings.Where(h=>h.RoomId==roomId).ToListAsync();
        public async Task<Booking?> GetIdBookingRep(int id) => await _context.Bookings.FindAsync(id);
        public async Task<IEnumerable<Booking>> GetBookingsByRoomId(int roomId)
            => await _context.Bookings.Where(b => b.RoomId == roomId).ToListAsync();
        public async Task CreateBookingRep(Booking booking) => await _context.Bookings.AddAsync(booking);
        public void UpdateBooking(Booking booking) => _context.Bookings.Update(booking);
        public async Task UpdateBookingAsync(Booking booking) => await Task.FromResult(_context.Bookings.Update(booking));
        public void RemoveBooking(Booking booking) => _context.Bookings.Remove(booking);
        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
    }
}
