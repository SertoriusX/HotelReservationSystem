using HotelReservationSystem.Dto.PaymentDto;
using HotelReservationSystem.Service.PaymentSer;
using HotelReservationSystem.Service.BookingSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;
        private readonly BookingSer _bookingService;

        public PaymentController(PaymentService paymentService, BookingSer bookingService)
        {
            _paymentService = paymentService;
            _bookingService = bookingService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPayments();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentById(id);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult> CreatePaymentIntent(PaymentDtoCreate dto)
        {
            var booking = await _bookingService.GetBookingById(dto.BookingId);
            if (booking == null) return NotFound("Booking not found");
            if (booking.UserId != GetUserId()) return Forbid();

            var amount = (long)(booking.TotalPrice * 100);
            var payment = await _paymentService.CreateStripePaymentIntent(dto.BookingId, amount, GetUserId());
            return Ok(payment);
        }

        [HttpPost("create-intent")]
        [Authorize]
        public async Task<ActionResult> CreatePaymentIntentByAmount([FromBody] CreatePaymentIntentDto dto)
        {
            var amount = (long)(dto.Amount * 100);
            var paymentIntent = await _paymentService.CreatePaymentIntentOnly(amount, GetUserId());
            return Ok(paymentIntent);
        }

        [HttpPost("create-paypal")]
        [Authorize]
        public async Task<ActionResult> CreatePayPalOrder(PaymentDtoCreate dto)
        {
            var booking = await _bookingService.GetBookingById(dto.BookingId);
            if (booking == null) return NotFound("Booking not found");
            if (booking.UserId != GetUserId()) return Forbid();

            var payment = await _paymentService.CreatePayPalOrder(dto.BookingId, booking.TotalPrice, GetUserId());
            return Ok(payment);
        }

        [HttpPost("capture-paypal/{orderId}")]
        [Authorize]
        public async Task<ActionResult> CapturePayPalOrder(string orderId)
        {
            var result = await _paymentService.CapturePayPalOrder(orderId);
            if (!result) return BadRequest("PayPal capture failed");
            return Ok("Payment successful");
        }

        [HttpPost("create-hotel")]
        [Authorize]
        public async Task<ActionResult> CreateHotelDirectPayment(HotelDirectPaymentDto dto, [FromQuery] int bookingId)
        {
            var booking = await _bookingService.GetBookingById(bookingId);
            if (booking == null) return NotFound("Booking not found");
            if (booking.UserId != GetUserId()) return Forbid();

            var payment = await _paymentService.CreateHotelDirectPayment(bookingId, booking.TotalPrice, GetUserId(), dto);
            return Ok(payment);
        }

        [HttpGet("booking/{bookingId}")]
        [Authorize]
        public async Task<ActionResult> GetPaymentByBooking(int bookingId)
        {
            var booking = await _bookingService.GetBookingById(bookingId);
            if (booking == null) return NotFound("Booking not found");
            
            var userId = GetUserId();
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            
            if (userRole != "OwnerHotel" && booking.UserId != userId)
                return Forbid();
            
            var payment = await _paymentService.GetPaymentByBookingId(bookingId);
            return Ok(payment);
        }

        [HttpPost("confirm/{paymentIntentId}")]
        [Authorize]
        public async Task<ActionResult> ConfirmPayment(string paymentIntentId)
        {
            var payment = await _paymentService.ConfirmPayment(paymentIntentId);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> HandleWebhook([FromBody] StripeWebhookDto webhook)
        {
            var payment = await _paymentService.HandleWebhook(webhook.PaymentIntentId, webhook.Status);
            return Ok(payment);
        }

        [HttpPost("refund/{paymentIntentId}")]
        [Authorize]
        public async Task<ActionResult> RefundPayment(string paymentIntentId)
        {
            var userId = GetUserId();
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            
            var payment = await _paymentService.GetPaymentByPaymentIntentId(paymentIntentId);
            if (payment == null) return NotFound("Payment not found");
            
            var booking = await _bookingService.GetBookingById(payment.BookingId);
            if (booking == null) return NotFound("Booking not found");
            
            if (userRole != "OwnerHotel" && payment.UserId != userId)
                return Forbid();
            
            if (userRole == "OwnerHotel")
            {
                var bookings = await _bookingService.GetAllBookings();
                var userRooms = bookings.Where(b => b.Room?.Hotel?.UserId == userId).Select(b => b.RoomId).ToHashSet();
                if (!userRooms.Contains(booking.RoomId))
                    return Forbid();
            }

            var result = await _paymentService.RefundPayment(paymentIntentId);
            if (!result) return BadRequest("Refund failed");
            return Ok("Refund successful");
        }
    }
}
