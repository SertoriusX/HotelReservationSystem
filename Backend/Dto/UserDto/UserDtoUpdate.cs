using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.UserDto
{
    public class UserDtoUpdate
    {
        [StringLength(50)]
        public string? Username { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? Roles { get; set; }
    }
}
