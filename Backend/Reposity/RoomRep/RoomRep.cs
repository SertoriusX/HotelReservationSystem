using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.RoomRep
{
    public class RoomRep : IRoomRep
    {
        private readonly ApplicationDbContext _context;
        public RoomRep(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Room>> GetRoomRepAsync() => await _context.Rooms.Include(b => b.ImagesRoom).Include(r => r.Hotel).ThenInclude(h => h.City).ToListAsync();
        public async Task<Room?> GetRoomRepByIdAsync(int id) => await _context.Rooms.Include(r => r.Hotel).ThenInclude(h => h!.City).FirstOrDefaultAsync(r => r.Id == id);

        public async Task CreateRoomRep(Room room) => await _context.Rooms.AddAsync(room);
        public void UpdateRoom(Room room) => _context.Rooms.Update(room);
        public void RemoveRoom(Room room) => _context.Rooms.Remove(room);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
    }
}
