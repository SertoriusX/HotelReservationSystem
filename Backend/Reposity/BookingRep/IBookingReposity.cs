using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.BookingRep
{
    public interface IBookingReposity
    {
        Task CreateBookingRep(Booking booking);
        Task<IEnumerable<Booking>> GetAllBookingsAsync();
        Task<IEnumerable<Booking>> GetAllBookingRep(int roomId);
        Task<IEnumerable<Booking>> GetBookingsByRoomId(int roomId);
        Task<Booking?> GetIdBookingRep(int id);
        void RemoveBooking(Booking booking);
        Task<bool> SaveChangesAsync();
        void UpdateBooking(Booking booking);
        Task UpdateBookingAsync(Booking booking);
    }
}