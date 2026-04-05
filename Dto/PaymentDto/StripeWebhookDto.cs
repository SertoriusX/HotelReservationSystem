namespace HotelReservationSystem.Dto.PaymentDto
{
    public class StripeWebhookDto
    {
        public string PaymentIntentId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? FailureMessage { get; set; }
    }
}
