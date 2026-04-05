using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.BookingDto
{
    public class BookingDtoUpdate
    {
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public BookingStatus? Status { get; set; }
    }
}
