using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Models;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;

    public CartController(AppDbContext db) => _db = db;

    [HttpGet("{sessionId}")]
    public async Task<IActionResult> GetCart(string sessionId)
    {
        var items = await _db.CartItems
            .Include(c => c.Product)
            .Where(c => c.SessionId == sessionId)
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        var existing = await _db.CartItems
            .FirstOrDefaultAsync(c => c.SessionId == dto.SessionId && c.ProductId == dto.ProductId);

        if (existing != null)
        {
            existing.Quantity += dto.Quantity;
        }
        else
        {
            _db.CartItems.Add(new CartItem
            {
                SessionId = dto.SessionId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            });
        }

        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int quantity)
    {
        var item = await _db.CartItems.FindAsync(id);
        if (item is null) return NotFound();

        if (quantity <= 0)
            _db.CartItems.Remove(item);
        else
            item.Quantity = quantity;

        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var item = await _db.CartItems.FindAsync(id);
        if (item is null) return NotFound();
        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return Ok();
    }
}

public record AddToCartDto(string SessionId, int ProductId, int Quantity = 1);
