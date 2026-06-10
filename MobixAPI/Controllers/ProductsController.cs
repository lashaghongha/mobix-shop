using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Models;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? categoryId,
        [FromQuery] string? brand,
        [FromQuery] string? brands,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? search,
        [FromQuery] string? sort = "featured",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Products.Include(p => p.Category).Where(p => p.IsPublished).AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(brands))
        {
            var list = brands.Split(',', StringSplitOptions.RemoveEmptyEntries);
            query = query.Where(p => list.Contains(p.Brand));
        }
        else if (!string.IsNullOrEmpty(brand))
            query = query.Where(p => p.Brand == brand);
        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice);
        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice);
        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(s) ||
                p.Brand.ToLower().Contains(s) ||
                p.Description.ToLower().Contains(s));
        }

        query = sort switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.Rating)
        };

        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return NotFound();
        return Ok(product);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured()
    {
        var products = await _db.Products
            .Where(p => p.IsPublished && p.IsFeatured)
            .OrderByDescending(p => p.Rating)
            .Take(10)
            .ToListAsync();
        return Ok(products);
    }

    [HttpGet("deals")]
    public async Task<IActionResult> GetDeals()
    {
        var products = await _db.Products
            .Where(p => p.IsPublished && p.OldPrice.HasValue)
            .OrderByDescending(p => p.OldPrice - p.Price)
            .Take(8)
            .ToListAsync();
        return Ok(products);
    }

    [HttpGet("benefits")]
    public async Task<IActionResult> GetBenefits() =>
        Ok(await _db.Benefits.OrderBy(b => b.Order).ToListAsync());
}
