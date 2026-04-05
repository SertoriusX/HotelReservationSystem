using HotelReservationSystem.Dto.RoomImgDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.RoomImgSer;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomImgController : ControllerBase
    {
        private readonly RoomImgService _service;

        public RoomImgController(RoomImgService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomImgDtoRead>>> AllImg()
        {
            var roomImg = await _service.AllImgRoom();
            var dto = roomImg.Select(x => new RoomImgDtoRead
            {
                Id = x.Id,
                Url = x.Url,
                IsMain = x.IsMain,
                RoomId = x.roomId,
            });
            return Ok(dto);
        }

        [HttpGet("{roomId}")]
        public async Task<ActionResult<IEnumerable<RoomImgDtoRead>>> GetImagesByRoomId(int roomId)
        {
            var roomImg = await _service.AllImgRoomById(roomId);
            var dto = roomImg.Select(x => new RoomImgDtoRead
            {
                Id = x.Id,
                Url = x.Url,
                IsMain = x.IsMain,
                RoomId = x.roomId,
            });
            return Ok(dto);
        }

        [HttpPost("{roomId}")]
        public async Task<ActionResult> CreateImageRoom(int roomId, [FromBody] RoomImgDtoCreate roomImgDtoCreate)
        {
            var newImage = new HotelImageRoom
            {
                roomId = roomId,
                Url = roomImgDtoCreate.Url,
                IsMain = roomImgDtoCreate.IsMain ?? false,
                CreatedAt = DateTime.UtcNow
            };

            await _service.CreateImg(newImage);
            return CreatedAtAction(nameof(GetImagesByRoomId), new { roomId = newImage.roomId }, newImage);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRoomImg(int id)
        {
            var roomImg = await _service.GEtById(id);
            if (roomImg == null) return NotFound();

            await _service.RemoveImg(roomImg);
            return NoContent();
        }
    }
}
