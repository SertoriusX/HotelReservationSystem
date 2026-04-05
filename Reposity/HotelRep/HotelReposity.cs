using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.HotelRep
{
    public class HotelReposity : IHotelReposity
    {
        private readonly ApplicationDbContext _context;
        public HotelReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Hotel>> GetHotelsRepAsync(int userId) => await _context.Hotels.Include(h => h.City).Include(h => h.Images).Where(h => h.UserId == userId).ToListAsync();
        public async Task<Hotel?> GetHotelRepByIdAsync(int id, int userId) => await _context.Hotels.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
        public async Task<IEnumerable<Hotel>> GetHotelsRepUserAsync() => await _context.Hotels.Include(h => h.City).Include(h => h.Images).ToListAsync();
        public async Task<Hotel?> GetHotelRepByIdUserAsync(int id) => await _context.Hotels.Include(h => h.City).Include(h => h.Images).FirstOrDefaultAsync(h => h.Id == id);

        public async Task CreateHotelRep(Hotel hotel) => await _context.Hotels.AddAsync(hotel);
        public void UpdateHotel(Hotel hotel) => _context.Hotels.Update(hotel);
        public void RemoveHotel(Hotel hotel) => _context.Hotels.Remove(hotel);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;


    }
}
