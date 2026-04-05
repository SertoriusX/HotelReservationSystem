using HotelReservationSystem.Dto.CityDto;
using HotelReservationSystem.Dto.CountryDto;
using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.CountryRep;
using HotelReservationSystem.Service.CountrySer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly CountryService _service;
        public CountryController(CountryService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CountryDtoRead>>> GetAllCountries()
        {
            var countries = await _service.GetAllCountrySer();

            var dto = countries.Select(x => new CountryDtoRead
            {
                Id = x.Id,
                Name = x.Name,
                Cities = x.Cities?.Select(s => new CityDtoRead
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToList(),
                CreatedAt = x.CreatedAt
            }).ToList();

            return Ok(dto);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<CountryDtoRead>> GetByIdCountry(int id)
        {
            var country = await _service.GetById(id);
            if (country == null) { 
                return NotFound();
            }
            var dto = new CountryDtoRead
            {
                Id = country.Id,
                Name = country.Name,
                CreatedAt = country.CreatedAt,
            };
            return Ok(dto);


        }

        [HttpPost]
        public async Task<ActionResult> CreateCountry(CountryDtoCreate countryDtoCreate)
        {
            var newCountry = new Country
            {
                Name = countryDtoCreate.Name,

            };
            await _service.CreaeteCountry(newCountry);
            return CreatedAtAction(nameof(GetByIdCountry), new { id = newCountry.Id }, newCountry);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCountry(int id, CountryDtoUpdate countryDtoUpdate)
        {
            var country = await _service.GetById(id);
            if (country == null)
            {
                return NotFound();
            }
            country.Name = countryDtoUpdate.Name;
            await _service.UpdateCountry(country);
            return NoContent();



        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCountry(int id)
        {
            var country = await _service.GetById(id);
            if (country == null)
            {
                return NotFound();
            }
            await _service.DeleteCountry(country);
            return NoContent();



        }


    }
}
