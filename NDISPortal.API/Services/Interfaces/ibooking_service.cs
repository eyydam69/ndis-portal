using NdisPortal.BookingsApi.DTOs;

namespace NdisPortal.BookingsApi.Services.Interfaces;

public interface ibooking_service
{
    Task<IEnumerable<booking_list_dto>> GetBookingsAsync(string? status);
    Task<booking_response_dto?> GetBookingByIdAsync(int id);
    Task<booking_response_dto> CreateBookingAsync(booking_create_dto createDto);
    Task<booking_response_dto?> UpdateBookingStatusAsync(int id, booking_status_update_dto updateDto);
    Task<bool> DeleteBookingAsync(int id);
}