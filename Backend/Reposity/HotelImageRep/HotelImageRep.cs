using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.HotelImageRep
{
    public class HotelImageRep : IHotelImageRep
    {
        private readonly ApplicationDbContext _context;
        public HotelImageRep(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<HotelImage>> GetHotelImageRepUserAsync() => await _context.HotelImages.ToListAsync();
        public async Task<HotelImage?> GetHotelImageRepByIdUserAsync(int id) => await _context.HotelImages.FindAsync(id);

        public async Task CreateCityRep(HotelImage hotelImage) => await _context.HotelImages.AddAsync(hotelImage);
        public void UpdateHotelImage(HotelImage hotelImage) => _context.HotelImages.Update(hotelImage);
        public void RemoveHotelImage(HotelImage hotelImage) => _context.HotelImages.Remove(hotelImage);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;

    }
}
