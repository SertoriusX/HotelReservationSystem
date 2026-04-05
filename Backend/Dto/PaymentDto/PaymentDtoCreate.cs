using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.PaymentDto
{
    public class PaymentDtoCreate
    {
        [Required]
        public int BookingId { get; set; }
    }
}
