using HotelReservationSystem.Dto.RoomImgDto;
using HotelReservationSystem.Entity;
using System.Text.Json.Serialization;

namespace HotelReservationSystem.Dto.RoomDto
{
    public class RoomDtoRead
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int NumberOfBedrooms { get; set; }
        public int NumberOfBeds { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public string Type { get; set; } = string.Empty;
        public bool HasKitchen { get; set; }
        public bool HasFreeParging { get; set; }
        public bool IsNonSmoking { get; set; }
        public bool HasSwimmingPool { get; set; }
        public bool HasBar { get; set; }

        public bool HasWifi { get; set; }
        public bool HasAirConditioning { get; set; }
        public bool HasTv { get; set; }
        public int HotelId { get; set; }
        public string? HotelName { get; set; }
        public string? CityName { get; set; }
        public double? CityLatitude { get; set; }
        public double? CityLongitude { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<RoomImgDtoRead> imgs{ get; set; }
        public DateTime CreatedAt { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PaymentOptions AcceptedPayments { get; set; }

        public bool AllowPayNow { get; set; } = true;
        public bool AllowSaveCard { get; set; } = true;
        public int SaveCardFeePercent { get; set; } = 0;
        public int AutoPayDaysBefore { get; set; } = 7;
    }
}