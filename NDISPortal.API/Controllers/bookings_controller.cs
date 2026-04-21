using Microsoft.AspNetCore.Mvc;
using NdisPortal.BookingsApi.DTOs;
using NdisPortal.BookingsApi.Services.Interfaces;

namespace NdisPortal.BookingsApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class bookings_controller(ibooking_service bookingService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<booking_list_dto>>> GetBookings([FromQuery] string? status)
    {
        var bookings = await bookingService.GetBookingsAsync(status);
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<booking_response_dto>> GetBooking(int id)
    {
        var booking = await bookingService.GetBookingByIdAsync(id);
        if (booking == null)
            return NotFound($"Booking with ID {id} not found.");

        return Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<booking_response_dto>> CreateBooking([FromBody] booking_create_dto createDto)
    {
        var result = await bookingService.CreateBookingAsync(createDto);
        return CreatedAtAction(nameof(GetBooking), new { id = result.Id }, result);
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<booking_response_dto>> UpdateBookingStatus(int id, [FromBody] booking_status_update_dto updateDto)
    {
        var updated = await bookingService.UpdateBookingStatusAsync(id, updateDto);

        if (updated == null)
            return NotFound($"Booking with ID {id} not found.");

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var deleted = await bookingService.DeleteBookingAsync(id);
        if (!deleted)
            return NotFound($"Booking with ID {id} not found.");

        return NoContent();
    }
}