using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public enum PaymentStatus
    {
        Pending,
        Processing,
        Succeeded,
        Failed,
        Refunded
    }

    public enum PaymentMethod
    {
        Stripe,
        PayPal,
        HotelDirect
    }

    public class Payment
    {
        [Key]
        public int Id { get; set; }

        public string PaymentIntentId { get; set; } = string.Empty;
        public PaymentMethod Method { get; set; } = PaymentMethod.Stripe;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "usd";
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public int BookingId { get; set; }
        public Booking? Booking { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public string? CardLast4 { get; set; }
        public string? CardBrand { get; set; }
        public string? FailureMessage { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
