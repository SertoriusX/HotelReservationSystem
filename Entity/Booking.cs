using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed,
        NoShow,
        PaymentPending,
        AutoPaid
    }

    public enum BookingPaymentMethod
    {
        None,
        Stripe,
        PayPal,
        PayAtHotel
    }

    public class Booking
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int RoomId { get; set; }
        public Room? Room { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public bool IsPaid { get; set; } = false;
        public BookingPaymentMethod PaymentMethod { get; set; } = BookingPaymentMethod.None;
        public int DaysCount { get; set; }
        public int Adults { get; set; } = 1;
        public int Children { get; set; } = 0;
        public decimal TotalPrice { get; set; }

        public bool CardSaved { get; set; } = false;
        public string? SavedPaymentIntentId { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
