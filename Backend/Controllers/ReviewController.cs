using HotelReservationSystem.Dto.ReviewDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.HotelSer;
using HotelReservationSystem.Service.ReviewSer;
using HotelReservationSystem.Service.RoomSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _service;
        private readonly RoomService _roomService;

        public ReviewController(ReviewService service, RoomService roomService)
        {
            _service = service;
            _roomService = roomService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("room/all/{roomId}")]
        public async Task<ActionResult<ReviewDtoRead>> GetAllReview(int roomId)
        {   
            var review = await _service.GetReviewsAsync(roomId);
            var dto = review.Select(x => new ReviewDtoRead
            {
                Id = x.Id,
                Comment = x.Comment,
                Rating = x.Rating,
                UserId = x.UserId,
                Username = x.User?.Username,
                RoomId = x.RoomId,
                CreatedAt = x.CreatedAt,
            });
            return Ok(dto);
        }

        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<ReviewDtoRead>> GetReviewsByRoom(int roomId)
        {
            var reviews = await _service.GetReviewsByRoomId(roomId);
            var dto = reviews.Select(x => new ReviewDtoRead
            {
                Id = x.Id,
                Comment = x.Comment,
                Rating = x.Rating,
                UserId = x.UserId,
                Username = x.User?.Username,
                RoomId = x.RoomId,
                CreatedAt = x.CreatedAt,
            });
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDtoRead>> GetByIdReview(int id)
        {
            var review = await _service.GetReviewById(id);
            if (review == null)
            {
                return NotFound();
            }
            var dto = new ReviewDtoRead
            {
                Id = review.Id,
                Comment = review.Comment,
                Rating = review.Rating,
                UserId = review.UserId,
                Username = review.User?.Username,
                RoomId = review.RoomId,
                CreatedAt = review.CreatedAt,
            };
            return Ok(dto);
        }

        [HttpPost("{roomId}")]
        [Authorize]
        public async Task<ActionResult> CreateReview(int roomId, ReviewDtoCreate reviewDtoCreate)
        {
            var room = await _roomService.GetRoomsById(roomId);
            if (room == null)
            {
                return NotFound("Hotel not found");
            }

            var newReview = new Review
            {
                Comment = reviewDtoCreate.Comment,
                Rating = reviewDtoCreate.Rating,
                UserId = GetUserId(),
                RoomId = roomId,
                CreatedAt = DateTime.UtcNow
            };

            await _service.CreateReview(newReview);
            return CreatedAtAction(nameof(GetByIdReview), new { id = newReview.Id }, newReview);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateReview(int id, ReviewDtoUpdate reviewDtoUpdate)
        {
            var review = await _service.GetReviewById(id);
            if (review == null)
            {
                return NotFound();
            }
            if (review.UserId != GetUserId())
            {
                return Forbid();
            }
            if (!string.IsNullOrEmpty(reviewDtoUpdate.Comment))
                review.Comment = reviewDtoUpdate.Comment;
            if (reviewDtoUpdate.Rating.HasValue)
                review.Rating = reviewDtoUpdate.Rating.Value;

            await _service.UpdateReview(review);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var review = await _service.GetReviewById(id);
            if (review == null)
            {
                return NotFound();
            }
            if (review.UserId != GetUserId())
            {
                return Forbid();
            }

            await _service.RemoveReview(review);
            return NoContent();
        }
    }
}
