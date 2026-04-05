using HotelReservationSystem.Dto.BookingDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.BookingSer;
using HotelReservationSystem.Service.RoomSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly BookingSer _service;
        private readonly RoomService _roomService;
        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public BookingController(BookingSer service, RoomService roomService)
        {
            _service = service;
            _roomService = roomService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BookingDtoRead>>> GetAllBookings()
        {
            var userId = GetUserId();
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            
            var allBookings = await _service.GetAllBookings();
            
            var dto = allBookings.Select(x => new BookingDtoRead
            {
                Id = x.Id,
                UserId = x.UserId,
                Username = x.User?.Username,
                RoomId = x.RoomId,
                HotelId = x.Room?.HotelId,
                RoomName = x.Room?.Name,
                PricePerNight = x.Room?.Price ?? 0,
                CheckIn = x.CheckIn,
                CheckOut = x.CheckOut,
                DaysCount = x.DaysCount,
                Adults = x.Adults,
                Children = x.Children,
                TotalPrice = x.TotalPrice,
                Status = x.Status,
                IsPaid = x.IsPaid,
                PaymentMethod = x.PaymentMethod,
                CreatedAt = x.CreatedAt,
                CardSaved = x.CardSaved,
                SavedPaymentIntentId = x.SavedPaymentIntentId,
            }).ToList();
            
            Console.WriteLine($"Returning {dto.Count} bookings for user {userId} with role {userRole}");
            return Ok(dto);
        }

        [HttpGet("{roomId}")]
        public async Task<ActionResult<BookingDtoRead>> GetAllBooking(int roomId)
        {
            var room = await _roomService.GetRoomsById(roomId);
            if (room == null) return NotFound("Room not found");
            var booking = await _service.GetBookingSer(roomId);
            var dto = booking.Select(x => new BookingDtoRead
            {
                Id = x.Id,
                UserId = GetUserId(),
                Username = x.User?.Username,
                RoomId = x.RoomId,
                RoomName = x.Room?.Name,
                PricePerNight = x.Room?.Price ?? 0,
                CheckIn = x.CheckIn,
                CheckOut = x.CheckOut,
                DaysCount = x.DaysCount,
                Adults = x.Adults,
                Children = x.Children,
                TotalPrice = x.TotalPrice,
                Status = x.Status,
                IsPaid = x.IsPaid,
                PaymentMethod = x.PaymentMethod,
                CreatedAt = x.CreatedAt,
                CardSaved = x.CardSaved,
                SavedPaymentIntentId = x.SavedPaymentIntentId,
            });
            return Ok(dto);
        }

        [HttpGet("available-rooms")]
        [AllowAnonymous]
        public async Task<ActionResult> GetAvailableRooms([FromQuery] DateTime checkIn, [FromQuery] DateTime checkOut)
        {
            try
            {
                Console.WriteLine($"GetAvailableRooms called: checkIn={checkIn}, checkOut={checkOut}");
                var allRooms = await _roomService.GetAllRooms();
                Console.WriteLine($"Found {allRooms.Count()} rooms");
                var availableRoomIds = new List<int>();

                foreach (var room in allRooms)
                {
                    var isAvailable = await _service.IsRoomAvailable(room.Id, checkIn, checkOut);
                    if (isAvailable)
                    {
                        availableRoomIds.Add(room.Id);
                    }
                }
                Console.WriteLine($"Available room IDs: {string.Join(",", availableRoomIds)}");

                return Ok(new { availableRoomIds });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAvailableRooms: {ex}");
                return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDtoRead>> GetBookingById(int id)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();
          
            var dto = new BookingDtoRead
            {
                Id = booking.Id,
                UserId = GetUserId(),
                Username = booking.User?.Username,
                RoomId = booking.RoomId,
                RoomName = booking.Room?.Name,
                PricePerNight = booking.Room?.Price ?? 0,
                CheckIn = booking.CheckIn,
                CheckOut = booking.CheckOut,
                DaysCount = booking.DaysCount,
                Adults = booking.Adults,
                Children = booking.Children,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CreatedAt = booking.CreatedAt,
                CardSaved = booking.CardSaved,
                SavedPaymentIntentId = booking.SavedPaymentIntentId,
            };
            return Ok(dto);
        }

        [HttpPost("{roomId}")]
        [Authorize]
        public async Task<ActionResult> CreateBooking(int roomId, [FromBody] BookingDtoCreate dtoCreate)
        {
            try
            {
                Console.WriteLine($"CreateBooking called with roomId: {roomId}");
                Console.WriteLine($"CheckIn: {dtoCreate?.CheckIn}, CheckOut: {dtoCreate?.CheckOut}, Guests: {dtoCreate?.Guests}, PaymentMethod: {dtoCreate?.PaymentMethod}");

                if (dtoCreate == null)
                    return BadRequest("Invalid request body");

                // Parse dates from string
                if (!DateTime.TryParse(dtoCreate.CheckIn, out var checkInDate))
                    return BadRequest("Invalid CheckIn date format");
                
                if (!DateTime.TryParse(dtoCreate.CheckOut, out var checkOutDate))
                    return BadRequest("Invalid CheckOut date format");

                var room = await _roomService.GetRoomsById(roomId);
                if (room == null) return NotFound("Room not found");
                
                // Check availability
                var isAvailable = await _service.IsRoomAvailable(roomId, checkInDate, checkOutDate);
                if (!isAvailable) return BadRequest("Room is not available for these dates");

                var daysCount = (checkOutDate - checkInDate).Days;
                if (daysCount <= 0) return BadRequest("CheckOut must be after CheckIn");

                var guests = dtoCreate.Guests > 0 ? dtoCreate.Guests : 1;
                
                // Use provided total amount or calculate
                var totalPrice = dtoCreate.TotalAmount ?? (daysCount * room.Price * guests);
                
                // Convert string payment method to enum
                var paymentMethodEnum = BookingPaymentMethod.None;
                if (!string.IsNullOrEmpty(dtoCreate.PaymentMethod))
                {
                    if (dtoCreate.PaymentMethod.Contains("Stripe", StringComparison.OrdinalIgnoreCase))
                        paymentMethodEnum = BookingPaymentMethod.Stripe;
                    else if (dtoCreate.PaymentMethod.Contains("PayPal", StringComparison.OrdinalIgnoreCase))
                        paymentMethodEnum = BookingPaymentMethod.PayPal;
                    else if (dtoCreate.PaymentMethod.Contains("Pay at Hotel", StringComparison.OrdinalIgnoreCase) || 
                             dtoCreate.PaymentMethod.Contains("PayAtHotel", StringComparison.OrdinalIgnoreCase))
                        paymentMethodEnum = BookingPaymentMethod.PayAtHotel;
                    else
                        paymentMethodEnum = BookingPaymentMethod.Stripe;
                }

                var newBooking = new Booking
                {
                    UserId = GetUserId(),
                    RoomId = roomId,
                    CheckIn = checkInDate,
                    CheckOut = checkOutDate,
                    DaysCount = daysCount,
                    Adults = dtoCreate.Adults > 0 ? dtoCreate.Adults : 1,
                    Children = dtoCreate.Children > 0 ? dtoCreate.Children : 0,
                    TotalPrice = totalPrice,
                    PaymentMethod = paymentMethodEnum,
                    CardSaved = dtoCreate.CardSaved,
                    SavedPaymentIntentId = dtoCreate.PaymentIntentId,
                    Status = BookingStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };
                
                await _service.CreateBooking(newBooking);
                return Ok(new { 
                    id = newBooking.Id,
                    message = "Booking created successfully",
                    cardSaved = newBooking.CardSaved,
                    checkInDate = newBooking.CheckIn,
                    autoPayDate = newBooking.CheckIn.AddDays(-7)
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating booking: {ex.Message}");
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBooking(int id, BookingDtoUpdate dtoUpdate)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();

            if (dtoUpdate.CheckIn.HasValue) booking.CheckIn = dtoUpdate.CheckIn.Value;
            if (dtoUpdate.CheckOut.HasValue) booking.CheckOut = dtoUpdate.CheckOut.Value;
            if (dtoUpdate.Status.HasValue) booking.Status = dtoUpdate.Status.Value;

            if (dtoUpdate.CheckIn.HasValue || dtoUpdate.CheckOut.HasValue)
            {
                var days = (booking.CheckOut - booking.CheckIn).Days;
                booking.DaysCount = days;
                booking.TotalPrice = days * (booking.Room?.Price ?? 0);
            }

            await _service.UpdateBooking(booking);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBooking(int id)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();

            await _service.DeleteBooking(booking);
            return NoContent();
        }

        [HttpPatch("{id}/pay")]
        [Authorize]
        public async Task<ActionResult> MarkAsPaid(int id, [FromBody] MarkAsPaidRequest? request)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();

            booking.IsPaid = true;
            booking.Status = BookingStatus.Confirmed;
            
            if (request != null && !string.IsNullOrEmpty(request.PaymentMethod))
            {
                if (request.PaymentMethod.Contains("Stripe", StringComparison.OrdinalIgnoreCase))
                    booking.PaymentMethod = BookingPaymentMethod.Stripe;
                else if (request.PaymentMethod.Contains("PayPal", StringComparison.OrdinalIgnoreCase))
                    booking.PaymentMethod = BookingPaymentMethod.PayPal;
                else if (request.PaymentMethod.Contains("Pay at Hotel", StringComparison.OrdinalIgnoreCase))
                    booking.PaymentMethod = BookingPaymentMethod.PayAtHotel;
            }
            
            await _service.UpdateBooking(booking);

            return Ok(new { message = "Payment successful", bookingId = id });
        }

        [HttpPost("{id}/refund")]
        [Authorize]
        public async Task<ActionResult> RefundBooking(int id)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();

            var userId = GetUserId();
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "OwnerHotel" && booking.UserId != userId)
                return Forbid();

            if (userRole == "OwnerHotel")
            {
                var ownerRooms = await _roomService.GetAllRooms();
                var ownerRoomIds = ownerRooms.Where(r => r.Hotel != null && r.Hotel.UserId == userId).Select(r => r.Id).ToHashSet();
                if (!ownerRoomIds.Contains(booking.RoomId))
                    return Forbid();
            }

            booking.IsPaid = false;
            booking.Status = BookingStatus.Cancelled;
            await _service.UpdateBooking(booking);

            await _service.DeleteBooking(booking);
            return Ok(new { message = "Booking refunded and deleted", bookingId = id });
        }

        [HttpPost("{id}/confirm-payment")]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult> ConfirmPaymentAtHotel(int id)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();

            var userId = GetUserId();
            var ownerRooms = await _roomService.GetAllRooms();
            var ownerRoomIds = ownerRooms.Where(r => r.Hotel != null && r.Hotel.UserId == userId).Select(r => r.Id).ToHashSet();
            if (!ownerRoomIds.Contains(booking.RoomId))
                return Forbid();

            booking.IsPaid = true;
            booking.Status = BookingStatus.Confirmed;
            await _service.UpdateBooking(booking);

            return Ok(new { message = "Payment confirmed", bookingId = id });
        }

        [HttpPost("{id}/noshow")]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult> MarkNoShow(int id)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound();

            var userId = GetUserId();
            var ownerRooms = await _roomService.GetAllRooms();
            var ownerRoomIds = ownerRooms.Where(r => r.Hotel != null && r.Hotel.UserId == userId).Select(r => r.Id).ToHashSet();
            if (!ownerRoomIds.Contains(booking.RoomId))
                return Forbid();

            booking.Status = BookingStatus.NoShow;
            await _service.UpdateBooking(booking);
            await _service.DeleteBooking(booking);

            return Ok(new { message = "Guest marked as no-show, booking deleted", bookingId = id });
        }

        [HttpGet("pending-auto-pay")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BookingDtoRead>>> GetPendingAutoPayBookings()
        {
            var allBookings = await _service.GetAllBookings();
            var sevenDaysFromNow = DateTime.UtcNow.AddDays(7);
            
            var pendingBookings = allBookings.Where(b => 
                b.CardSaved && 
                !b.IsPaid && 
                b.CheckIn <= sevenDaysFromNow &&
                b.Status == BookingStatus.Pending
            ).ToList();

            var dto = pendingBookings.Select(x => new BookingDtoRead
            {
                Id = x.Id,
                UserId = x.UserId,
                Username = x.User?.Username,
                RoomId = x.RoomId,
                HotelId = x.Room?.HotelId,
                RoomName = x.Room?.Name,
                PricePerNight = x.Room?.Price ?? 0,
                CheckIn = x.CheckIn,
                CheckOut = x.CheckOut,
                DaysCount = x.DaysCount,
                Adults = x.Adults,
                Children = x.Children,
                TotalPrice = x.TotalPrice,
                Status = x.Status,
                IsPaid = x.IsPaid,
                PaymentMethod = x.PaymentMethod,
                CreatedAt = x.CreatedAt,
                CardSaved = x.CardSaved,
                SavedPaymentIntentId = x.SavedPaymentIntentId,
            }).ToList();

            return Ok(dto);
        }

        [HttpPost("{id}/auto-pay")]
        [Authorize]
        public async Task<ActionResult> ProcessAutoPay(int id)
        {
            var booking = await _service.GetBookingById(id);
            if (booking == null) return NotFound("Booking not found");

            if (!booking.CardSaved || string.IsNullOrEmpty(booking.SavedPaymentIntentId))
                return BadRequest("No saved card found for this booking");

            if (booking.IsPaid)
                return BadRequest("Booking is already paid");

            // Get auto-pay days from hotel setting (default 7)
            var autoPayDays = booking.Room?.Hotel?.AutoPayDaysBefore ?? 7;
            
            // Check if within X days of check-in (based on hotel setting)
            var daysUntilCheckIn = (booking.CheckIn - DateTime.UtcNow).Days;
            if (daysUntilCheckIn > autoPayDays)
                return BadRequest($"Too early for auto-pay. {daysUntilCheckIn} days until check-in. Auto-pay available {autoPayDays} days before check-in.");

            // Process the payment using saved payment intent
            try
            {
                // For demo purposes, we'll mark as paid directly
                // In production, you would use Stripe API to confirm the payment
                booking.IsPaid = true;
                booking.Status = BookingStatus.Confirmed;
                
                await _service.UpdateBooking(booking);

                return Ok(new { 
                    message = "Payment processed successfully",
                    bookingId = booking.Id,
                    amount = booking.TotalPrice
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Auto-pay failed: {ex.Message}");
            }
        }

        [HttpPost("process-all-auto-pay")]
        [Authorize]
        public async Task<ActionResult> ProcessAllAutoPay()
        {
            var allBookings = await _service.GetAllBookings();
            var sevenDaysFromNow = DateTime.UtcNow.AddDays(7);
            
            var pendingBookings = allBookings.Where(b => 
                b.CardSaved && 
                !b.IsPaid && 
                b.CheckIn <= sevenDaysFromNow &&
                b.Status == BookingStatus.Pending
            ).ToList();

            var processedCount = 0;
            var failedCount = 0;
            var results = new List<object>();

            foreach (var booking in pendingBookings)
            {
                try
                {
                    booking.IsPaid = true;
                    booking.Status = BookingStatus.Confirmed;
                    await _service.UpdateBooking(booking);
                    
                    processedCount++;
                    results.Add(new { bookingId = booking.Id, status = "success" });
                }
                catch
                {
                    failedCount++;
                    results.Add(new { bookingId = booking.Id, status = "failed" });
                }
            }

            return Ok(new { 
                message = $"Processed {processedCount} bookings, {failedCount} failed",
                processedCount,
                failedCount,
                results
            });
        }
    }

    public class MarkAsPaidRequest
    {
        public string? PaymentMethod { get; set; }
        public string? PaymentIntentId { get; set; }
    }
}