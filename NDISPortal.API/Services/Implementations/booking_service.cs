using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Data;
using NdisPortal.BookingsApi.DTOs;
using NdisPortal.BookingsApi.Models;
using NdisPortal.BookingsApi.Services.Interfaces;

namespace NdisPortal.BookingsApi.Services.Implementations;

public class booking_service : ibooking_service
{
    private readonly application_db_context _context;

    public booking_service(application_db_context context)
    {
        _context = context;
    }

    private static string StatusToString(int status) => status switch
    {
        0 => "Pending",
        1 => "Approved",
        2 => "Cancelled",
        _ => "Unknown"
    };

    private static int? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
            return null;

        status = status.Trim().ToLower();

        return status switch
        {
            "0" or "pending" => 0,
            "1" or "approved" => 1,
            "2" or "cancelled" => 2,
            _ => null
        };
    }

    public async Task<IEnumerable<booking_list_dto>> GetBookingsAsync(string? status)
    {
        int? statusFilter = null;

        if (!string.IsNullOrWhiteSpace(status))
        {
            statusFilter = ParseStatus(status);

            if (statusFilter == null)
                throw new ArgumentException($"Invalid status value '{status}'. Allowed: 0/Pending, 1/Approved, 2/Cancelled.");
        }

        IQueryable<Booking> query = _context.Bookings
            .Include(b => b.Service)
            .Include(b => b.User)
            .AsQueryable();

        if (statusFilter.HasValue)
            query = query.Where(b => b.Status == statusFilter.Value);

        var bookings = await query
            .OrderByDescending(b => b.BookingDate)
            .Select(b => new booking_list_dto
            {
                Id = b.Id,
                ServiceName = b.Service != null ? b.Service.Name : "Unknown",
                ParticipantName = b.User != null ? $"{b.User.FirstName} {b.User.LastName}" : null,
                BookingDate = b.BookingDate,
                Notes = b.Notes,
                Status = StatusToString(b.Status)
            })
            .ToListAsync();

        return bookings;
    }

    public async Task<booking_response_dto?> GetBookingByIdAsync(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.Service)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return null;

        return new booking_response_dto
        {
            Id = booking.Id,
            UserId = booking.UserId,
            ServiceId = booking.ServiceId,
            ServiceName = booking.Service?.Name ?? "Unknown",
            ParticipantName = booking.User != null ? $"{booking.User.FirstName} {booking.User.LastName}" : null,
            BookingDate = booking.BookingDate,
            Notes = booking.Notes,
            Status = StatusToString(booking.Status),
            CreatedDate = booking.CreatedDate,
            ModifiedDate = booking.ModifiedDate
        };
    }

    public async Task<booking_response_dto> CreateBookingAsync(booking_create_dto createDto)
    {
        if (createDto.PreferredDate.Date < DateTime.Today)
            throw new ArgumentException("PreferredDate must be today or a future date.");

        var service = await _context.Services
            .FirstOrDefaultAsync(s => s.Id == createDto.ServiceId && s.is_active);

        if (service == null)
            throw new ArgumentException("Service not found or is not active.");

        var user = await _context.Users.FindAsync(createDto.UserId);
        if (user == null)
            throw new ArgumentException($"User with ID {createDto.UserId} not found.");

        var booking = new Booking
        {
            UserId = createDto.UserId,
            ServiceId = createDto.ServiceId,
            BookingDate = createDto.PreferredDate.Date,
            Notes = createDto.Notes,
            Status = 0,
            CreatedDate = DateTime.UtcNow,
            ModifiedDate = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return new booking_response_dto
        {
            Id = booking.Id,
            UserId = booking.UserId,
            ServiceId = booking.ServiceId,
            ServiceName = service.Name,
            ParticipantName = $"{user.FirstName} {user.LastName}",
            BookingDate = booking.BookingDate,
            Notes = booking.Notes,
            Status = StatusToString(booking.Status),
            CreatedDate = booking.CreatedDate,
            ModifiedDate = booking.ModifiedDate
        };
    }

    public async Task<booking_response_dto?> UpdateBookingStatusAsync(int id, booking_status_update_dto updateDto)
    {
        var booking = await _context.Bookings
            .Include(b => b.Service)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return null;

        int? newStatus = ParseStatus(updateDto.Status);

        if (newStatus == null || (newStatus != 1 && newStatus != 2))
            throw new ArgumentException("Invalid status value. Allowed: 1/Approved, 2/Cancelled.");

        booking.Status = newStatus.Value;
        booking.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new booking_response_dto
        {
            Id = booking.Id,
            UserId = booking.UserId,
            ServiceId = booking.ServiceId,
            ServiceName = booking.Service?.Name ?? "Unknown",
            ParticipantName = booking.User != null ? $"{booking.User.FirstName} {booking.User.LastName}" : null,
            BookingDate = booking.BookingDate,
            Notes = booking.Notes,
            Status = StatusToString(booking.Status),
            CreatedDate = booking.CreatedDate,
            ModifiedDate = booking.ModifiedDate
        };
    }

    public async Task<bool> DeleteBookingAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);

        if (booking == null)
            return false;

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return true;
    }
}