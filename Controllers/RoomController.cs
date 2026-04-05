using HotelReservationSystem.Dto.RoomDto;
using HotelReservationSystem.Dto.RoomImgDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.HotelSer;
using HotelReservationSystem.Service.RoomSer;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly RoomService _service;
        private readonly HotelService _hotelService;

        public RoomController(RoomService service, HotelService hotelService)
        {
            _service = service;
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDtoRead>>> GetAllRoom()
        {
            var rooms = await _service.GetAllRooms();

            var dto = rooms.Select(x => new RoomDtoRead
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                Capacity = x.Capacity,
                NumberOfBedrooms = x.NumberOfBedrooms,
                NumberOfBeds = x.NumberOfBeds,
                IsNonSmoking = x.IsNonSmoking,
                HasFreeParging = x.HasFreeParging,
                HasSwimmingPool = x.HasSwimmingPool,
                HasBar = x.HasBar,
                Type = x.Type.ToString(),
                HasKitchen = x.HasKitchen,
                HasWifi = x.HasWifi,
                HasAirConditioning = x.HasAirConditioning,
                HasTv = x.HasTv,
                HotelId = x.HotelId,
                HotelName = x.Hotel?.Name,
                CityName = x.Hotel?.City?.Name,
                CityLatitude = x.Hotel?.City?.Latitude,
                CityLongitude = x.Hotel?.City?.Longitude,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                imgs = x.ImagesRoom?.Select(n => new RoomImgDtoRead
                {
                    Id = n.Id,
                    Url = n.Url
                }).ToList(),
                CreatedAt = x.CreatedAt,
                AcceptedPayments = x.Hotel?.AcceptedPayments ?? PaymentOptions.CreditCard,
            }).ToList();

            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDtoRead>> GetById(int id)
        {
            var room = await _service.GetRoomsById(id);
            if (room == null) return NotFound();

            var dto = new RoomDtoRead
            {
                Id = room.Id,
                Name = room.Name,
                Description = room.Description,
                NumberOfBedrooms = room.NumberOfBedrooms,
                NumberOfBeds = room.NumberOfBeds,
                IsNonSmoking = room.IsNonSmoking,
                HasBar = room.HasBar,
                HasSwimmingPool = room.HasSwimmingPool,
                HasFreeParging = room.HasFreeParging,
                Price = room.Price,
                Capacity = room.Capacity,
                Type = room.Type.ToString(),
                HasKitchen = room.HasKitchen,
                HasWifi = room.HasWifi,
                HasAirConditioning = room.HasAirConditioning,
                HasTv = room.HasTv,
                HotelId = room.HotelId,
                HotelName = room.Hotel?.Name,
                CityName = room.Hotel?.City?.Name,
                CityLatitude = room.Hotel?.City?.Latitude,
                CityLongitude = room.Hotel?.City?.Longitude,
                Latitude = room.Latitude,
                Longitude = room.Longitude,
                imgs = room.ImagesRoom?.Select(n => new RoomImgDtoRead
                {
                    Id = n.Id,
                    Url = n.Url
                }).ToList(),
                CreatedAt = room.CreatedAt,
                AcceptedPayments = room.Hotel?.AcceptedPayments ?? PaymentOptions.CreditCard,
                AllowPayNow = room.Hotel?.AllowPayNow ?? true,
                AllowSaveCard = room.Hotel?.AllowSaveCard ?? true,
                SaveCardFeePercent = room.Hotel?.SaveCardFeePercent ?? 0,
                AutoPayDaysBefore = room.Hotel?.AutoPayDaysBefore ?? 7,
            };
            return Ok(dto);
        }

        [HttpPost("{hotelId}")]
        public async Task<ActionResult> CreateRoom(RoomDtoCreate roomDtoCreate, int hotelId)
        {
            var hotel = await _hotelService.GetById(hotelId);
            if (hotel == null) return NotFound();

            var roomType = Enum.TryParse<RoomType>(roomDtoCreate.Type, out var rt) ? rt : RoomType.Standard;

            var newRoom = new Room
            {
                Name = roomDtoCreate.Name,
                Description = roomDtoCreate.Description,
                Price = roomDtoCreate.Price,
                Capacity = roomDtoCreate.Capacity,
                NumberOfBedrooms = roomDtoCreate.NumberOfBedrooms,
                NumberOfBeds = roomDtoCreate.NumberOfBeds,
                HasBar = roomDtoCreate.HasBar,
                HasFreeParging = roomDtoCreate.HasFreeParging,
                HasSwimmingPool = roomDtoCreate.HasSwimmingPool,
                IsNonSmoking = roomDtoCreate.IsNonSmoking,
                Type = roomType,
                HasKitchen = roomDtoCreate.HasKitchen,
                HasWifi = roomDtoCreate.HasWifi,
                HasAirConditioning = roomDtoCreate.HasAirConditioning,
                HasTv = roomDtoCreate.HasTv,
                HotelId = hotelId,
                Latitude = roomDtoCreate.Latitude,
                Longitude = roomDtoCreate.Longitude,
                CreatedAt = DateTime.UtcNow
            };

            await _service.CreateRoom(newRoom);
            return CreatedAtAction(nameof(GetById), new { id = newRoom.Id }, newRoom);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRooms(int id, RoomDtoUpdate roomDtoUpdate)
        {
            var room = await _service.GetRoomsById(id);
            if (room == null) return NotFound();

            if (!string.IsNullOrEmpty(roomDtoUpdate.Name))
                room.Name = roomDtoUpdate.Name;

            if (!string.IsNullOrEmpty(roomDtoUpdate.Description))
                room.Description = roomDtoUpdate.Description;

            if (roomDtoUpdate.NumberOfBedrooms.HasValue)
                room.NumberOfBedrooms = roomDtoUpdate.NumberOfBedrooms.Value;

            if (roomDtoUpdate.NumberOfBeds.HasValue)
                room.NumberOfBeds = roomDtoUpdate.NumberOfBeds.Value;

            if (roomDtoUpdate.Price.HasValue)
                room.Price = roomDtoUpdate.Price.Value;

            if (roomDtoUpdate.Capacity.HasValue)
                room.Capacity = roomDtoUpdate.Capacity.Value;
            if (roomDtoUpdate.Type.HasValue)
                room.Type = roomDtoUpdate.Type.Value;

            if (roomDtoUpdate.HasKitchen.HasValue)
                room.HasKitchen = roomDtoUpdate.HasKitchen.Value;

            if (roomDtoUpdate.HasWifi.HasValue)
                room.HasWifi = roomDtoUpdate.HasWifi.Value;

            if (roomDtoUpdate.HasAirConditioning.HasValue)
                room.HasAirConditioning = roomDtoUpdate.HasAirConditioning.Value;

            if (roomDtoUpdate.HasTv.HasValue)
                room.HasTv = roomDtoUpdate.HasTv.Value;

            if (roomDtoUpdate.HasBar.HasValue)
                room.HasBar = roomDtoUpdate.HasBar.Value;

            if (roomDtoUpdate.HasFreeParging.HasValue)
                room.HasFreeParging = roomDtoUpdate.HasFreeParging.Value;

            if (roomDtoUpdate.HasSwimmingPool.HasValue)
                room.HasSwimmingPool = roomDtoUpdate.HasSwimmingPool.Value;

            if (roomDtoUpdate.IsNonSmoking.HasValue)
                room.IsNonSmoking = roomDtoUpdate.IsNonSmoking.Value;

            if (roomDtoUpdate.Latitude.HasValue)
                room.Latitude = roomDtoUpdate.Latitude.Value;

            if (roomDtoUpdate.Longitude.HasValue)
                room.Longitude = roomDtoUpdate.Longitude.Value;

            await _service.UpdateRoom(room);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRooms(int id)
        {
            var room = await _service.GetRoomsById(id);
            if (room == null) return NotFound();

            await _service.DeleteRoom(room);
            return NoContent();
        }

        [HttpGet("distance")]
        public async Task<ActionResult<double>> GetDistance([FromQuery] double roomLat, [FromQuery] double roomLng, [FromQuery] double destLat, [FromQuery] double destLng)
        {
            var distance = await _service.GetDistanceFromGoogle(roomLat, roomLng, destLat, destLng);
            return Ok(distance);
        }

        [HttpGet("{roomId}/distance-to-city")]
        public async Task<ActionResult<object>> GetDistanceToCity(int roomId)
        {
            var room = await _service.GetRoomsById(roomId);
            if (room == null) return NotFound("Room not found");
            if (room.Latitude == null || room.Longitude == null)
                return BadRequest("Room has no coordinates");

            var hotel = await _hotelService.GetById(room.HotelId);
            if (hotel == null || hotel.City == null)
                return BadRequest("Hotel or city not found");
            
            if (hotel.City.Latitude == null || hotel.City.Longitude == null)
                return BadRequest("City has no coordinates");

            var distance = await _service.GetDistanceFromGoogle(
                (double)room.Latitude, 
                (double)room.Longitude, 
                (double)hotel.City.Latitude, 
                (double)hotel.City.Longitude
            );

            return Ok(new { 
                distanceMeters = distance,
                distanceKm = Math.Round(distance / 1000, 2),
                cityName = hotel.City.Name
            });
        }
    }
}
