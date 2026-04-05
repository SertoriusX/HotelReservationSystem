using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.HotelDto
{
    public class HotelDtoCreate
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PaymentOptions AcceptedPayments { get; set; } = PaymentOptions.CreditCard | PaymentOptions.PayPal;

        [Required]
        public int CityId { get; set; }

        public bool AllowPayNow { get; set; } = true;
        public bool AllowSaveCard { get; set; } = true;
        public int SaveCardFeePercent { get; set; } = 0;
        public int AutoPayDaysBefore { get; set; } = 7;
    }
}
