using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    [Flags]
    public enum PaymentOptions
    {
        None = 0,
        CreditCard = 1,      // Stripe
        PayPal = 2,
        HotelDirect = 4,     // Bank transfer / invoice
        PayAtHotel = 8      // Cash on arrival
    }

    public class Hotel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CityId { get; set; }
        public City? City { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public PaymentOptions AcceptedPayments { get; set; } = PaymentOptions.CreditCard | PaymentOptions.PayPal;

        public bool AllowPayNow { get; set; } = true;
        public bool AllowSaveCard { get; set; } = true;
        public int SaveCardFeePercent { get; set; } = 0;
        public int AutoPayDaysBefore { get; set; } = 7;

        public List<HotelImage> Images { get; set; } = new List<HotelImage>();
        public List<Review> Reviews { get; set; } = new List<Review>();

        public DateTime CreatedAt { get; set; }
    }
}
