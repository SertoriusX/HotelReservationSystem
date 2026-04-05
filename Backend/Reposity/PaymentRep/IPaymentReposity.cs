using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.PaymentRep
{
    public interface IPaymentReposity
    {
        Task CreateAsync(Payment payment);
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByBookingIdAsync(int bookingId);
        Task<Payment?> GetByIdAsync(int id);
        Task<Payment?> GetByPaymentIntentIdAsync(string paymentIntentId);
        Task SaveChangesAsync();
        Task UpdateAsync(Payment payment);
    }
}