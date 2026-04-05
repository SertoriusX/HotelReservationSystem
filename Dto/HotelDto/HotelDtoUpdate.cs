using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.HotelDto
{
    public class HotelDtoUpdate
    {
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PaymentOptions? AcceptedPayments { get; set; }

        public int? CityId { get; set; }

        public bool AllowPayNow { get; set; } = true;
        public bool AllowSaveCard { get; set; } = false;
        public int SaveCardFeePercent { get; set; } = 0;
        public int AutoPayDaysBefore { get; set; } = 7;
    }
}
