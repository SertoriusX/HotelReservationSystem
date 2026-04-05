using System.Text.Json.Serialization;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.BookingDto
{
    public class BookingDtoCreate
    {
        [JsonPropertyName("checkIn")]
        public string? CheckIn { get; set; }

        [JsonPropertyName("checkOut")]
        public string? CheckOut { get; set; }

        [JsonPropertyName("guests")]
        public int Guests { get; set; } = 1;

        [JsonPropertyName("paymentMethod")]
        public string? PaymentMethod { get; set; }

        [JsonPropertyName("cardSaved")]
        public bool CardSaved { get; set; } = false;

        [JsonPropertyName("paymentIntentId")]
        public string? PaymentIntentId { get; set; }

        [JsonPropertyName("totalAmount")]
        public decimal? TotalAmount { get; set; }

        [JsonPropertyName("adults")]
        public int Adults { get; set; } = 1;

        [JsonPropertyName("children")]
        public int Children { get; set; } = 0;
    }
}
