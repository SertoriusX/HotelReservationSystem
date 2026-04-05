using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.CityRep
{
    public class CityReposity : ICityReposity
    {
        private readonly ApplicationDbContext _context;
        public CityReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<City>> GetCitysRepUserAsync() => await _context.Cities.Include(b=>b.Country).ToListAsync();
        public async Task<City?> GetCityRepByIdUserAsync(int id) => await _context.Cities.FindAsync(id);

        public async Task CreateCityRep(City city) => await _context.Cities.AddAsync(city);
        public void UpdateCity(City city) => _context.Cities.Update(city);
        public void RemoveCity(City city) => _context.Cities.Remove(city);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;

    }
}
