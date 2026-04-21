

using System.ComponentModel.DataAnnotations;

namespace Register.API.DTOs.Auth
{
    public class login_dto
    {
        public string Email { get; set; }
        [Required]

  
        public string Password { get; set; }
        
        
    }
}