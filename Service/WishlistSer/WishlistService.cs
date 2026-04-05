using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.WishListRep;

namespace HotelReservationSystem.Service.WishlistSer
{
    public class WishlistService
    {
        private readonly IWishlistReposity _reposity;
        public WishlistService(IWishlistReposity reposity)
        {

            _reposity = reposity;
        }
        public async Task<IEnumerable<Wishlist>> GetAllWish(int userId) => await _reposity.GetAllWish(userId);
        public async Task<Wishlist?> GetByIdWish(int id, int userId) => await _reposity.GetByIdWish(id, userId);
        public async Task<bool> CreateWish(int userId, int roomId)
        {
            var existing = (await _reposity.GetAllWish(userId)).Any(w => w.RoomId == roomId);
            if (existing)
            {
                return false; 

            }
            var wishlist = new Wishlist
            {
                UserId = userId,
                RoomId = roomId
            };
            await _reposity.CreateWishlist(wishlist);
            return await _reposity.SaveChangesAsync();
        }



        public async Task<bool> RemoveFromWishlist(int userId, int roomId)
        {
            var item = (await _reposity.GetAllWish(userId)).FirstOrDefault(w => w.RoomId == roomId);

            if (item == null)
                return false;

            _reposity.DeleteWishlist(item);
            return await _reposity.SaveChangesAsync();
        }
    }
}