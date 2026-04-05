using HotelReservationSystem.Database;
using HotelReservationSystem.Entity;
using Microsoft.EntityFrameworkCore;

namespace HotelReservationSystem.Reposity.ReviewRep
{
    public class ReviewReposity : IReviewReposity
    {
        private readonly ApplicationDbContext _context;
        public ReviewReposity(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Review>> GetReviewRepAsync(int roomId) => await _context.Reviews.Include(r => r.User).Where(r => r.RoomId == roomId).ToListAsync();
        public async Task<IEnumerable<Review>> GetReviewsByRoomIdAsync(int roomId) => await _context.Reviews.Include(r => r.User).Where(r => r.RoomId == roomId).ToListAsync();
        public async Task<Review?> GetReviewRepByIdAsync(int id) => await _context.Reviews.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == id);

        public async Task CreateReviewRep(Review review) => await _context.Reviews.AddAsync(review);
        public void UpdateReview(Review review) => _context.Reviews.Update(review);
        public void RemoveReview(Review review) => _context.Reviews.Remove(review);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;

    }
}
