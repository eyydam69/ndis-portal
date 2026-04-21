using System.ComponentModel.DataAnnotations;

namespace NdisPortal.BookingsApi.DTOs;

public class booking_create_dto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int ServiceId { get; set; }

    [Required]
    public DateTime PreferredDate { get; set; }

    public string? Notes { get; set; }
}