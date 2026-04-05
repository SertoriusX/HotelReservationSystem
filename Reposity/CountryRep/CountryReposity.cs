using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.CountryRep
{
    public class CountryReposity : ICountryReposity
    {
        private readonly ApplicationDbContext _context;
        public CountryReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Country>> GetCountrysRepUserAsync() => await _context.Countries.Include(b=>b.Cities).ToListAsync();
        public async Task<Country?> GetCountrysRepByIdUserAsync(int id) => await _context.Countries.FindAsync(id);

        public async Task CreateCountrysRep(Country country) => await _context.Countries.AddAsync(country);
        public void UpdateCountry(Country country) => _context.Countries.Update(country);
        public void RemoveCountrys(Country country) => _context.Countries.Remove(country);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
    }
}
