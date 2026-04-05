using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.PaymentDto
{
    public class CreatePaymentIntentDto
    {
        [Required]
        public decimal Amount { get; set; }

        public string Currency { get; set; } = "usd";
    }
}