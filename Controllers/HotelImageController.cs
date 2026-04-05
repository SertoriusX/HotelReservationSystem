using HotelReservationSystem.Dto.HotelImageDto;
using HotelReservationSystem.Dto.RoomImgDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.HotelImgSer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelImageController : ControllerBase
    {
        private readonly HotelImgService _service;
        public HotelImageController(HotelImgService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<HotelImageDtoRead>> GetAllImage()
        {
            var img= await _service.GetImages();
            var dto = img.Select(x => new HotelImageDtoRead
            {
                Id=x.Id,
                Url=x.Url,
                IsMain=x.IsMain,


            });
            return Ok(dto);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<HotelImageDtoRead>> GetByIdImage(int id)
        {
            var img = await _service.GetImageById(id);
            if (img == null)
            {
                return NotFound();
            }
            var dto =  new HotelImageDtoRead
            {
                Id = img.Id,
                Url = img.Url,
                IsMain = img.IsMain,


            };
            return Ok(dto);
        }

        [HttpPost("{hotelId}")]
        public async Task<ActionResult> CreateImage(int hotelId, [FromBody] HotelImageDtoCreate hotelImageDtoCreate)
        {
            var newImage = new HotelImage
            {
                HotelId = hotelId,             
                Url = hotelImageDtoCreate.Url,
                IsMain = hotelImageDtoCreate.IsMain ?? false

            };

            await _service.CreateHotelImage(newImage);

            return CreatedAtAction(nameof(GetByIdImage), new { id = newImage.Id }, newImage);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteImage(int id)
        {
            var img = await _service.GetImageById(id);
            if (img == null)
            {
                return NotFound();
            }
            await _service.DeleteHotelImage(img);
            return NoContent();
        }

    }
}
