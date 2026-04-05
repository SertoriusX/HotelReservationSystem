using HotelReservationSystem.Dto.CityDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Service.CitySer;
using HotelReservationSystem.Service.CountrySer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly CityService _service;
        private readonly CountryService _countryService;

        public CityController(CityService service, CountryService countryService)
        {
            _service = service;
            _countryService = countryService;
        }
        [HttpGet]
        public async Task<ActionResult<CityDtoRead>> GetAllCity()
        {
            var city = await _service.GetAll();
            var dtoCity = city.Select(x => new CityDtoRead
            {
                Id = x.Id,
                Name = x.Name,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                CountryId = x.CountryId,
                CountryName = x.Country?.Name,
                CreatedAt = x.CreatedAt
            });
            return Ok(dtoCity);

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<CityDtoRead>> GetByIdCity(int id) {
            var city = await _service.GetCityAsync(id);
            if (city == null) {
                return NotFound();
            }
            var dtoCity = new CityDtoRead
            {
                Id = city.Id,
                Name = city.Name,
                Latitude = city.Latitude,
                Longitude = city.Longitude,
                CountryId = city.CountryId,
                CountryName = city.Country != null ? city.Country.Name : null,
                CreatedAt = city.CreatedAt
            };
            return Ok(dtoCity);
        }
        [HttpPost("{countryId}")]
        public async Task<ActionResult> CreateCity(CityDtoCreate cityDtoCreate,  int countryId)
        {
            var country = await _countryService.GetById(countryId);
            if (country == null) {
                return NotFound();
            }
            var newCity = new City
            {
                Name = cityDtoCreate.Name,
                Latitude = cityDtoCreate.Latitude,
                Longitude = cityDtoCreate.Longitude,
                CountryId = country.Id
            };
            await _service.CreateCity(newCity);
            return CreatedAtAction(nameof(GetByIdCity),new { id = newCity.Id }, newCity);

        }

        [HttpPost("{countryId}/bulk")]
        public async Task<ActionResult> CreateCitiesBulk(int countryId, [FromBody] List<CityDtoCreate> cities)
        {
            var country = await _countryService.GetById(countryId);
            if (country == null) {
                return NotFound("Country not found");
            }

            var newCities = cities.Select(c => new City
            {
                Name = c.Name,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                CountryId = country.Id,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            foreach (var city in newCities)
            {
                await _service.CreateCity(city);
            }

            return Ok(new { message = $"{newCities.Count} cities created successfully" });
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCity(int id, CityDtoUpdate cityDtoUpdate)
        {
            var city = await _service.GetCityAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            if (!string.IsNullOrEmpty(cityDtoUpdate.Name))
                city.Name = cityDtoUpdate.Name;
            if (cityDtoUpdate.Latitude.HasValue)
                city.Latitude = cityDtoUpdate.Latitude;
            if (cityDtoUpdate.Longitude.HasValue)
                city.Longitude = cityDtoUpdate.Longitude;
            await _service.UpdateCity(city);
            return NoContent();

        }
        [HttpPut("{countryId}/bulk")]
        public async Task<ActionResult> UpdateCitiesBulk(int countryId, [FromBody] List<CityDtoUpdateBulk> cities)
        {
            // Check if the country exists
            var country = await _countryService.GetById(countryId);
            if (country == null)
            {
                return NotFound("Country not found");
            }

            int updatedCount = 0;

            foreach (var c in cities)
            {
                // Fetch existing city by Id
                var existingCity = await _service.GetCityAsync(c.Id);
                if (existingCity != null && existingCity.CountryId == countryId)
                {
                    if (!string.IsNullOrEmpty(c.Name))
                        existingCity.Name = c.Name;
                    if (c.Latitude.HasValue)
                        existingCity.Latitude = c.Latitude;
                    if (c.Longitude.HasValue)
                        existingCity.Longitude = c.Longitude;

                    existingCity.CreatedAt = DateTime.UtcNow;

                    await _service.UpdateCity(existingCity);
                    updatedCount++;
                }
            }

            return Ok(new { message = $"{updatedCount} cities updated successfully" });
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCity(int id)
        {
            var city = await _service.GetCityAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            await _service.DeleteCity(city);
            return NoContent();

        }
    }
}
