using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.BookingRep;

namespace HotelReservationSystem.Service.BookingSer
{
    public class BookingSer
    {
        private readonly IBookingReposity _reposity;
        public BookingSer(IBookingReposity reposity)
        {
            _reposity = reposity;
        }
        public async Task<IEnumerable<Booking>> GetAllBookings() => await _reposity.GetAllBookingsAsync();
        public async Task<IEnumerable<Booking>> GetBookingSer(int roomId) => await _reposity.GetAllBookingRep(roomId);
        public async Task<Booking?> GetBookingById(int id) => await _reposity.GetIdBookingRep(id);

        public async Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut, int? excludeBookingId = null)
        {
            var bookings = await _reposity.GetBookingsByRoomId(roomId);

            return !bookings.Any(b =>
                b.Status != BookingStatus.Cancelled &&
                b.Id != excludeBookingId &&
                b.CheckIn < checkOut &&
                b.CheckOut > checkIn);
        }

        public async Task CreateBooking(Booking booking)
        {
            await _reposity.CreateBookingRep(booking);
            await _reposity.SaveChangesAsync();
        }

        public async Task UpdateBooking(Booking booking)
        {
            _reposity.UpdateBooking(booking);
            await _reposity.SaveChangesAsync();
        }
        public async Task DeleteBooking(Booking booking)
        {
            _reposity.RemoveBooking(booking);
            await _reposity.SaveChangesAsync();
        }
    }
}
