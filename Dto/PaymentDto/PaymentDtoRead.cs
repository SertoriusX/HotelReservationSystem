using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.PaymentDto
{
    public class PaymentDtoRead
    {
        public int Id { get; set; }
        public string PaymentIntentId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public PaymentStatus Status { get; set; }
        public int BookingId { get; set; }
        public string? BookingName { get; set; }
        public int UserId { get; set; }
        public string? FailureMessage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
