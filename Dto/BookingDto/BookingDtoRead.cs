using System.Text.Json.Serialization;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.BookingDto
{
    public class BookingDtoRead
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public int RoomId { get; set; }
        public int? HotelId { get; set; }
        public string? RoomName { get; set; }
        public decimal PricePerNight { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int DaysCount { get; set; }
        public int Adults { get; set; } = 1;
        public int Children { get; set; } = 0;
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public bool IsPaid { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public BookingPaymentMethod PaymentMethod { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public bool CardSaved { get; set; }
        public string? SavedPaymentIntentId { get; set; }
    }
}
