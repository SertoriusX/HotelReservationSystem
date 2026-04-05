using HotelReservationSystem.Dto.HotelDto;
using HotelReservationSystem.Dto.HotelImageDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.CitySer;
using HotelReservationSystem.Service.HotelSer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private readonly HotelService _service;
        private readonly CityService _cityService;

        public HotelController(HotelService service, CityService cityService)
        {
            _service = service;
            _cityService = cityService;
        }

        [HttpGet]
        public async Task<ActionResult<HotelDtoRead>> GetAllHotels()
        {
            var hotel = await _service.GetHotels();
           var dto = hotel.Select(x => new HotelDtoRead
{
    Id = x.Id,
    Name = x.Name,
    Description = x.Description,
    AcceptedPayments = x.AcceptedPayments,
    CityId = x.CityId,
    CityName = x.City != null ? x.City.Name : null,
    UserId = x.UserId,
    CreatedAt = x.CreatedAt,
    Images = x.Images?.Select(s => new HotelImageDtoRead
    {
        Id = s.Id,
        Url = s.Url,
        IsMain = s.IsMain,
        roomId = s.HotelId,
        CreatedAt = s.CreatedAt
    }).ToList()
});
            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HotelDtoRead>> GetHotelById(int id)
        {
            var hotel = await _service.GetById(id);
            if (hotel == null)
            {
                return NotFound();
            }

            var dto = new HotelDtoRead
            {
                Id = hotel.Id,
                Name = hotel.Name,
                Description = hotel.Description,
                AcceptedPayments = hotel.AcceptedPayments,
                CityId = hotel.CityId,
                CityName = hotel.City != null ? hotel.City.Name : null,
                UserId = hotel.UserId,
                CreatedAt = hotel.CreatedAt,
                Images = hotel.Images?.Select(s => new HotelImageDtoRead
                {
                    Id = s.Id,
                    Url = s.Url,
                    IsMain = s.IsMain,
                    roomId = s.HotelId,
                    CreatedAt = s.CreatedAt
                }).ToList(),
                AllowPayNow = hotel.AllowPayNow,
                AllowSaveCard = hotel.AllowSaveCard,
                SaveCardFeePercent = hotel.SaveCardFeePercent,
                AutoPayDaysBefore = hotel.AutoPayDaysBefore
            };
            return Ok(dto);
        }

        [HttpGet("my")]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult<HotelDtoRead>> GetOwnHotels()
        {
            var hotel = await _service.GetHotelsOwner(GetUserId());
            var dto = hotel.Select(x => new HotelDtoRead
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                AcceptedPayments = x.AcceptedPayments,
                CityId = x.CityId,
                CityName = x.City != null ? x.City.Name : null,
                UserId = x.UserId,
                CreatedAt = x.CreatedAt,
                Images = x.Images?.Select(s => new HotelImageDtoRead
                {
                    Id = s.Id,
                    Url = s.Url,
                    IsMain = s.IsMain,
                    roomId = s.HotelId,
                    CreatedAt = s.CreatedAt
                }).ToList()
            });
            return Ok(dto);
        }

        [HttpGet("my/{id}")]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult<HotelDtoRead>> GetOwnHotelById(int id)
        {
            var hotel = await _service.GetByOwner(id, GetUserId());
            if (hotel == null)
            {
                return NotFound();
            }

            var dto = new HotelDtoRead
            {
                Id = hotel.Id,
                Name = hotel.Name,
                Description = hotel.Description,
                CityId = hotel.CityId,
                CityName = hotel.City != null ? hotel.City.Name : null,
                UserId = hotel.UserId,
                CreatedAt = hotel.CreatedAt,
                Images = hotel.Images?.Select(s => new HotelImageDtoRead
                {
                    Id = s.Id,
                    Url = s.Url,
                    IsMain = s.IsMain,
                    roomId = s.HotelId,
                    CreatedAt = s.CreatedAt
                }).ToList()
            };
            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult> CreateHotel(HotelDtoCreate dtoCreate)
        {

            var city = await _cityService.GetCityAsync(dtoCreate.CityId);
            if (city == null)
            {
                return NotFound("City not found");
            }

            var hotel = new Hotel
            {
                Name = dtoCreate.Name,
                Description = dtoCreate.Description,
                AcceptedPayments = dtoCreate.AcceptedPayments,
                CityId = dtoCreate.CityId,
                UserId = GetUserId(),
                CreatedAt = DateTime.UtcNow,
                AllowPayNow = dtoCreate.AllowPayNow,
                AllowSaveCard = dtoCreate.AllowSaveCard,
                SaveCardFeePercent = dtoCreate.SaveCardFeePercent,
                AutoPayDaysBefore = dtoCreate.AutoPayDaysBefore
            };

            await _service.CreateHotel(hotel);
            return CreatedAtAction(nameof(GetHotelById), new { id = hotel.Id }, hotel);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult> UpdateHotel(int id, HotelDtoUpdate dtoUpdate)
        {
            var hotel = await _service.GetByOwner(id, GetUserId());
            if (hotel == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(dtoUpdate.Name))
                hotel.Name = dtoUpdate.Name;
            if (!string.IsNullOrEmpty(dtoUpdate.Description))
                hotel.Description = dtoUpdate.Description;
            if (dtoUpdate.AcceptedPayments.HasValue)
                hotel.AcceptedPayments = dtoUpdate.AcceptedPayments.Value;
            if (dtoUpdate.CityId.HasValue)
                hotel.CityId = dtoUpdate.CityId.Value;

            await _service.UpdateHotel(hotel);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "OwnerHotel")]
        public async Task<ActionResult> DeleteHotel(int id)
        {
            var hotel = await _service.GetByOwner(id, GetUserId());
            if (hotel == null)
            {
                return NotFound();
            }

            await _service.DeleteHotel(hotel);
            return NoContent();
        }
    }
}
