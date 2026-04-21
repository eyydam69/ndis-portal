using System.ComponentModel.DataAnnotations;

namespace NdisPortal.BookingsApi.DTOs;

public class booking_status_update_dto
{
    [Required]
    [RegularExpression("^(Approved|Cancelled|1|2)$", ErrorMessage = "Status must be 'Approved', 'Cancelled', '1', or '2'")]
    public string Status { get; set; } = string.Empty;
}