using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.WishListRep
{
    public class WishlistReposity : IWishlistReposity
    {
        private readonly ApplicationDbContext _context;
        public WishlistReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Wishlist>> GetAllWish(int userId) => await _context.Wishlists.Where(w => w.UserId == userId).Include(w => w.Room).ThenInclude(r => r.Hotel).Include(w => w.Room).ThenInclude(r => r.ImagesRoom).ToListAsync();
        public async Task<Wishlist?> GetByIdWish(int userId, int id) => await _context.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.Id == id);

        public async Task CreateWishlist(Wishlist wishlist) => await _context.Wishlists.AddAsync(wishlist);

        public void DeleteWishlist(Wishlist wishlist) => _context.Wishlists.Remove(wishlist);
        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;

    }
}
