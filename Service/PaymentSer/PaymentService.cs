using HotelReservationSystem.Dto.PaymentDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.PaymentRep;
using Microsoft.Extensions.Configuration;
using Stripe;
using EntityPaymentMethod = HotelReservationSystem.Entity.PaymentMethod;

namespace HotelReservationSystem.Service.PaymentSer
{
    public class PayPalOrderResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}

namespace HotelReservationSystem.Service.PaymentSer
{
    public class PaymentService
    {
        private readonly IPaymentReposity _reposity;
        private readonly IConfiguration _configuration;

        public PaymentService(IPaymentReposity reposity, IConfiguration configuration)
        {
            _reposity = reposity;
            _configuration = configuration;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        public async Task<PaymentDtoRead> CreateStripePaymentIntent(int bookingId, decimal amount, int userId)
        {
            var existingPayment = await _reposity.GetByBookingIdAsync(bookingId);
            if (existingPayment != null && existingPayment.Method == EntityPaymentMethod.Stripe)
            {
                return MapToDto(existingPayment);
            }

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = "usd",
                Metadata = new Dictionary<string, string>
                {
                    { "bookingId", bookingId.ToString() }
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = service.Create(options);

            var payment = new Payment
            {
                PaymentIntentId = paymentIntent.Id,
                Method = EntityPaymentMethod.Stripe,
                Amount = amount,
                BookingId = bookingId,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
            };

            await _reposity.CreateAsync(payment);
            await _reposity.SaveChangesAsync();

            return MapToDto(payment);
        }

        public async Task<dynamic> CreatePaymentIntentOnly(long amount, int userId)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "usd"
            };

            var service = new PaymentIntentService();
            var paymentIntent = service.Create(options);

            return new { clientSecret = paymentIntent.ClientSecret, paymentIntentId = paymentIntent.Id };
        }

        public async Task<PaymentDtoRead> CreatePayPalOrder(int bookingId, decimal amount, int userId)
        {
            var existingPayment = await _reposity.GetByBookingIdAsync(bookingId);
            if (existingPayment != null && existingPayment.Method == EntityPaymentMethod.PayPal)
            {
                return MapToDto(existingPayment);
            }

            var clientId = _configuration["PayPal:ClientId"];
            var clientSecret = _configuration["PayPal:SecretKey"];
            var baseUrl = _configuration["PayPal:BaseUrl"] ?? "https://api-m.sandbox.paypal.com";

            using var client = new HttpClient();
            var auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", auth);

            var orderRequest = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
                        reference_id = bookingId.ToString(),
                        amount = new
                        {
                            currency_code = "USD",
                            value = amount.ToString("F2")
                        }
                    }
                }
            };

            var response = await client.PostAsJsonAsync($"{baseUrl}/v2/checkout/orders", orderRequest);
            var orderResponse = await response.Content.ReadFromJsonAsync<PayPalOrderResponse>();

            var payment = new Payment
            {
                PaymentIntentId = orderResponse?.Id ?? "",
                Method = EntityPaymentMethod.PayPal,
                Amount = amount,
                BookingId = bookingId,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
            };

            await _reposity.CreateAsync(payment);
            await _reposity.SaveChangesAsync();

            return MapToDto(payment);
        }

        public async Task<bool> CapturePayPalOrder(string orderId)
        {
            var payment = await _reposity.GetByPaymentIntentIdAsync(orderId);
            if (payment == null) return false;

            var clientId = _configuration["PayPal:ClientId"];
            var clientSecret = _configuration["PayPal:SecretKey"];
            var baseUrl = _configuration["PayPal:BaseUrl"] ?? "https://api-m.sandbox.paypal.com";

            using var client = new HttpClient();
            var auth = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", auth);

            var response = await client.PostAsJsonAsync($"{baseUrl}/v2/checkout/orders/{orderId}/capture", new { });
            
            if (response.IsSuccessStatusCode)
            {
                payment.Status = PaymentStatus.Succeeded;
                payment.UpdatedAt = DateTime.UtcNow;
                await _reposity.UpdateAsync(payment);
                await _reposity.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<PaymentDtoRead> CreateHotelDirectPayment(int bookingId, decimal amount, int userId, HotelDirectPaymentDto paymentDto)
        {
            var existingPayment = await _reposity.GetByBookingIdAsync(bookingId);
            if (existingPayment != null && existingPayment.Method == EntityPaymentMethod.HotelDirect)
            {
                return MapToDto(existingPayment);
            }

            var cardNumber = paymentDto.CardNumber.Replace(" ", "");
            var cardLast4 = cardNumber.Length >= 4 ? cardNumber[^4..] : "";
            var cardBrand = DetectCardBrand(cardNumber);

            var payment = new Payment
            {
                PaymentIntentId = $"HOTEL_{bookingId}_{DateTime.UtcNow.Ticks}",
                Method = EntityPaymentMethod.HotelDirect,
                Amount = amount,
                BookingId = bookingId,
                Status = PaymentStatus.Succeeded,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                CardLast4 = cardLast4,
                CardBrand = cardBrand,
            };

            await _reposity.CreateAsync(payment);
            await _reposity.SaveChangesAsync();

            return MapToDto(payment);
        }

        private static string DetectCardBrand(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber)) return "Unknown";
            if (cardNumber.StartsWith("4")) return "Visa";
            if (cardNumber.StartsWith("5") && cardNumber.Length >= 2 && int.TryParse(cardNumber[..2], out int prefix) && prefix >= 51 && prefix <= 55) return "Mastercard";
            if (cardNumber.StartsWith("34") || cardNumber.StartsWith("37")) return "Amex";
            if (cardNumber.StartsWith("6")) return "Discover";
            return "Unknown";
        }

        public async Task<PaymentDtoRead> CreatePaymentIntent(int bookingId, decimal amount,int userId)
        {
            var existingPayment = await _reposity.GetByBookingIdAsync(bookingId);
            if (existingPayment != null)
            {
                return MapToDto(existingPayment);
            }

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = "usd",
                Metadata = new Dictionary<string, string>
                {
                    { "bookingId", bookingId.ToString() }
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = service.Create(options);

            var payment = new Payment
            {
                PaymentIntentId = paymentIntent.Id,
                Amount = amount,
                BookingId = bookingId,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,  // Add this

            };

            await _reposity.CreateAsync(payment);
            await _reposity.SaveChangesAsync();

            return MapToDto(payment);
        }

        public async Task<PaymentDtoRead?> ConfirmPayment(string paymentIntentId)
        {
            var payment = await _reposity.GetByPaymentIntentIdAsync(paymentIntentId);
            if (payment == null) return null;

            payment.Status = PaymentStatus.Succeeded;
            payment.UpdatedAt = DateTime.UtcNow;

            await _reposity.UpdateAsync(payment);
            await _reposity.SaveChangesAsync();

            return MapToDto(payment);
        }

        public async Task<PaymentDtoRead?> HandleWebhook(string paymentIntentId, string status)
        {
            var payment = await _reposity.GetByPaymentIntentIdAsync(paymentIntentId);
            if (payment == null) return null;

            payment.Status = status.ToLower() switch
            {
                "succeeded" => PaymentStatus.Succeeded,
                "processing" => PaymentStatus.Processing,
                "failed" => PaymentStatus.Failed,
                "refunded" => PaymentStatus.Refunded,
                _ => PaymentStatus.Pending
            };

            payment.UpdatedAt = DateTime.UtcNow;

            await _reposity.UpdateAsync(payment);
            await _reposity.SaveChangesAsync();

            return MapToDto(payment);
        }

        public async Task<IEnumerable<PaymentDtoRead>> GetAllPayments()
        {
            var payments = await _reposity.GetAllAsync();
            return payments.Select(MapToDto);
        }

        public async Task<PaymentDtoRead?> GetPaymentById(int id)
        {
            var payment = await _reposity.GetByIdAsync(id);
            return payment == null ? null : MapToDto(payment);
        }

        public async Task<PaymentDtoRead?> GetPaymentByPaymentIntentId(string paymentIntentId)
        {
            var payment = await _reposity.GetByPaymentIntentIdAsync(paymentIntentId);
            return payment == null ? null : MapToDto(payment);
        }

        public async Task<PaymentDtoRead?> GetPaymentByBookingId(int bookingId)
        {
            var payment = await _reposity.GetByBookingIdAsync(bookingId);
            return payment == null ? null : MapToDto(payment);
        }

        public async Task<bool> RefundPayment(string paymentIntentId)
        {
            var payment = await _reposity.GetByPaymentIntentIdAsync(paymentIntentId);
            if (payment == null) return false;

            try
            {
                var service = new RefundService();
                service.Create(new RefundCreateOptions
                {
                    PaymentIntent = paymentIntentId
                });

                payment.Status = PaymentStatus.Refunded;
                payment.UpdatedAt = DateTime.UtcNow;
                await _reposity.UpdateAsync(payment);
                await _reposity.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        private static PaymentDtoRead MapToDto(Payment payment)
        {
            return new PaymentDtoRead
            {
                Id = payment.Id,
                PaymentIntentId = payment.PaymentIntentId,
                Amount = payment.Amount,
                Currency = payment.Currency,
                Status = payment.Status,
                BookingId = payment.BookingId,
                BookingName = payment.Booking?.Room?.Name,
                UserId = payment.UserId,
                FailureMessage = payment.FailureMessage,
                CreatedAt = payment.CreatedAt
            };
        }
    }
}
