using System.Text.Json.Serialization;
using HotelReservationSystem.Dto.HotelImageDto;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.HotelDto
{
    public class HotelDtoRead
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PaymentOptions AcceptedPayments { get; set; }
        public int CityId { get; set; }
        public string? CityName { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<HotelImageDtoRead> Images { get; set; } = new();

        public bool AllowPayNow { get; set; } = true;
        public bool AllowSaveCard { get; set; } = true;
        public int SaveCardFeePercent { get; set; } = 0;
        public int AutoPayDaysBefore { get; set; } = 7;
    }
}
