using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Models;
using MobixAPI.Services;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly EmailService _email;

    public OrdersController(AppDbContext db, EmailService email)
    {
        _db = db;
        _email = email;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var cartItems = await _db.CartItems
            .Include(c => c.Product)
            .Where(c => c.SessionId == dto.SessionId)
            .ToListAsync();

        if (!cartItems.Any()) return BadRequest("Cart is empty");

        var order = new Order
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City,
            PaymentMethod = dto.PaymentMethod,
            Total = cartItems.Sum(c => c.Product!.Price * c.Quantity),
            Items = cartItems.Select(c => new OrderItem
            {
                ProductId = c.ProductId,
                ProductName = c.Product!.Name,
                Price = c.Product.Price,
                Quantity = c.Quantity,
                ImageUrl = c.Product.ImageUrl
            }).ToList()
        };

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cartItems);
        await _db.SaveChangesAsync();

        // Send confirmation emails (fire-and-forget, don't block response)
        _ = Task.Run(() => _email.SendOrderConfirmationAsync(order));

        return Ok(new { order.Id, order.Total, order.Status });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();
        return Ok(order);
    }
}

public record CreateOrderDto(
    string SessionId,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string Address,
    string City,
    string PaymentMethod
);
