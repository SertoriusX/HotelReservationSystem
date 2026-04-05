using HotelReservationSystem.Dto.WishListDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.WishlistSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]  // Use [controller] not [wishlist]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _service;

        public WishlistController(WishlistService service)
        {
            _service = service;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<WishlistDtoRead>> GetWishlist()
        {
            var wishlist = await _service.GetAllWish(GetUserId());
            var dto = wishlist.Select(x => new WishlistDtoRead
            {
                Id = x.Id,
                UserId = x.UserId,
                Username = x.User?.Username,
                RoomId = x.RoomId,
                RoomName = x.Room?.Name,
                RoomPrice = x.Room?.Price,
                HotelName = x.Room?.Hotel?.Name,
                RoomImages = x.Room?.ImagesRoom?.Select(img => new WishlistRoomImage
                {
                    Id = img.Id,
                    Url = img.Url
                }).ToList(),
                CreatedAt = x.CreatedAt,
            });
            return Ok(dto);
        }

        [HttpPost("{roomId}")]
        [Authorize]
        public async Task<ActionResult> Add(int roomId)
        {
            var result = await _service.CreateWish(GetUserId(), roomId);
            if (!result) return BadRequest("Already in wishlist or room not found");
            return Ok("Added to wishlist");
        }

        [HttpDelete("{roomId}")]
        [Authorize]
        public async Task<ActionResult> Delete(int roomId)
        {
            var result = await _service.RemoveFromWishlist(GetUserId(), roomId);
            if (!result) return NotFound();
            return Ok("Removed from wishlist");
        }
    }
}
