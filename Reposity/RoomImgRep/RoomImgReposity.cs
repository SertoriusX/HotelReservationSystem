using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.RoomImgRep
{
    public class RoomImgReposity : IRoomImgReposity
    {
        private readonly ApplicationDbContext _context;
        public RoomImgReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<HotelImageRoom>> GetAllRoomImage(int roomdId) => await _context.HotelImageRooms.Where(s => s.roomId == roomdId).ToListAsync();
        public async Task<HotelImageRoom?> GetById(int id) => await _context.HotelImageRooms.FindAsync(id);
        public async Task CreateImageRoom(HotelImageRoom room) => await _context.HotelImageRooms.AddAsync(room);

        public void UpdateImgRoom(HotelImageRoom room) => _context.HotelImageRooms.Update(room);

        public void RemoveImgRoom(HotelImageRoom room) => _context.HotelImageRooms.Remove(room);
        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;

        public async Task<IEnumerable<HotelImageRoom>> GetAllRoomImage()
        {
            return await _context.HotelImageRooms.ToListAsync();
        }
    }
}
