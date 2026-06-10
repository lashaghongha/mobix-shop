using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Models;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminController(AppDbContext db) => _db = db;

    // ─── Dashboard Stats ───────────────────────────────────────────────────────
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalOrders   = await _db.Orders.CountAsync();
        var totalRevenue  = await _db.Orders.SumAsync(o => o.Total);
        var totalProducts = await _db.Products.CountAsync();
        var pendingOrders = await _db.Orders.CountAsync(o => o.Status == "Pending");
        var recentOrders  = await _db.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .Select(o => new { o.Id, o.FirstName, o.LastName, o.Total, o.Status, o.CreatedAt })
            .ToListAsync();

        return Ok(new { totalOrders, totalRevenue, totalProducts, pendingOrders, recentOrders });
    }

    // ─── Users (aggregated from orders) ───────────────────────────────────────
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Orders.AsQueryable();
        if (!string.IsNullOrEmpty(search))
            query = query.Where(o =>
                o.Email.Contains(search) ||
                o.FirstName.Contains(search) ||
                o.LastName.Contains(search) ||
                o.Phone.Contains(search));

        var grouped = await query
            .GroupBy(o => o.Email)
            .Select(g => new
            {
                Email        = g.Key,
                FirstName    = g.OrderByDescending(o => o.CreatedAt).First().FirstName,
                LastName     = g.OrderByDescending(o => o.CreatedAt).First().LastName,
                Phone        = g.OrderByDescending(o => o.CreatedAt).First().Phone,
                City         = g.OrderByDescending(o => o.CreatedAt).First().City,
                OrderCount   = g.Count(),
                TotalSpent   = g.Sum(o => o.Total),
                LastOrderAt  = g.Max(o => o.CreatedAt),
            })
            .OrderByDescending(u => u.LastOrderAt)
            .ToListAsync();

        var total = grouped.Count;
        var items = grouped.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("users/{email}")]
    public async Task<IActionResult> GetUser(string email)
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .Where(o => o.Email == email)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        if (!orders.Any()) return NotFound();

        var latest = orders.First();
        var profile = new
        {
            Email      = email,
            FirstName  = latest.FirstName,
            LastName   = latest.LastName,
            Phone      = latest.Phone,
            City       = latest.City,
            Address    = latest.Address,
            OrderCount = orders.Count,
            TotalSpent = orders.Sum(o => o.Total),
            FirstOrder = orders.Min(o => o.CreatedAt),
            LastOrder  = orders.Max(o => o.CreatedAt),
            Orders     = orders,
        };
        return Ok(profile);
    }

    // ─── Orders ────────────────────────────────────────────────────────────────
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Orders.Include(o => o.Items).AsQueryable();
        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();
        return Ok(order);
    }

    [HttpPatch("products/{id}/publish")]
    public async Task<IActionResult> TogglePublish(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();
        product.IsPublished = !product.IsPublished;
        await _db.SaveChangesAsync();
        return Ok(new { product.Id, product.IsPublished });
    }

    [HttpPatch("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        order.Status = dto.Status;
        await _db.SaveChangesAsync();
        return Ok(new { order.Id, order.Status });
    }

    // ─── Products ──────────────────────────────────────────────────────────────
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts(
        [FromQuery] int? categoryId,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Products.Include(p => p.Category).AsQueryable();
        if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.Contains(search) || p.Brand.Contains(search));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(p => p.Id).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(new { total, page, pageSize, items });
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] ProductUpsertDto dto)
    {
        var product = new Product
        {
            Name           = dto.Name,
            Description    = dto.Description,
            Price          = dto.Price,
            OldPrice       = dto.OldPrice,
            ImageUrl       = dto.ImageUrl,
            Images         = dto.Images ?? [],
            CategoryId     = dto.CategoryId,
            Brand          = dto.Brand,
            Stock          = dto.Stock,
            IsFeatured     = dto.IsFeatured,
            IsNew          = dto.IsNew,
            HasInstallment = dto.HasInstallment,
            IsPublished    = dto.IsPublished,
            SearchAlias    = dto.SearchAlias ?? string.Empty,
            Specs          = dto.Specs ?? new(),
            Variants       = dto.Variants?.Select(v => new ProductVariant { Label = v.Label, Price = v.Price, OldPrice = v.OldPrice, Stock = v.Stock }).ToList() ?? [],
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return Ok(product);
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpsertDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        product.Name           = dto.Name;
        product.Description    = dto.Description;
        product.Price          = dto.Price;
        product.OldPrice       = dto.OldPrice;
        product.ImageUrl       = dto.ImageUrl;
        product.Images         = dto.Images ?? product.Images;
        product.CategoryId     = dto.CategoryId;
        product.Brand          = dto.Brand;
        product.Stock          = dto.Stock;
        product.IsFeatured     = dto.IsFeatured;
        product.IsNew          = dto.IsNew;
        product.HasInstallment = dto.HasInstallment;
        product.IsPublished    = dto.IsPublished;
        product.SearchAlias    = dto.SearchAlias ?? product.SearchAlias;
        product.Specs          = dto.Specs ?? product.Specs;
        product.Variants       = dto.Variants?.Select(v => new ProductVariant { Label = v.Label, Price = v.Price, OldPrice = v.OldPrice, Stock = v.Stock }).ToList() ?? product.Variants;

        await _db.SaveChangesAsync();
        return Ok(product);
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ─── Categories ────────────────────────────────────────────────────────────
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var cats = await _db.Categories
            .OrderBy(c => c.Id)
            .Select(c => new {
                c.Id, c.Name, c.NameGe, c.Icon, c.Slug, c.ParentId,
                ProductCount = c.Products.Count
            })
            .ToListAsync();
        return Ok(cats);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryUpsertDto dto)
    {
        var cat = new Category
        {
            Name     = dto.Name,
            NameGe   = dto.NameGe,
            Icon     = dto.Icon,
            Slug     = dto.Slug,
            ParentId = dto.ParentId,
        };
        _db.Categories.Add(cat);
        await _db.SaveChangesAsync();
        return Ok(cat);
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryUpsertDto dto)
    {
        var cat = await _db.Categories.FindAsync(id);
        if (cat is null) return NotFound();
        cat.Name     = dto.Name;
        cat.NameGe   = dto.NameGe;
        cat.Icon     = dto.Icon;
        cat.Slug     = dto.Slug;
        cat.ParentId = dto.ParentId;
        await _db.SaveChangesAsync();
        return Ok(cat);
    }

    // ─── Benefits ──────────────────────────────────────────────────────────────
    [HttpGet("benefits")]
    public async Task<IActionResult> GetBenefits() =>
        Ok(await _db.Benefits.OrderBy(b => b.Order).ToListAsync());

    [HttpPost("benefits")]
    public async Task<IActionResult> CreateBenefit([FromBody] BenefitDto dto)
    {
        var b = new MobixAPI.Models.BenefitItem { Icon = dto.Icon, Title = dto.Title, Sub = dto.Sub, Order = dto.Order };
        _db.Benefits.Add(b);
        await _db.SaveChangesAsync();
        return Ok(b);
    }

    [HttpPut("benefits/{id}")]
    public async Task<IActionResult> UpdateBenefit(int id, [FromBody] BenefitDto dto)
    {
        var b = await _db.Benefits.FindAsync(id);
        if (b is null) return NotFound();
        b.Icon = dto.Icon; b.Title = dto.Title; b.Sub = dto.Sub; b.Order = dto.Order;
        await _db.SaveChangesAsync();
        return Ok(b);
    }

    [HttpDelete("benefits/{id}")]
    public async Task<IActionResult> DeleteBenefit(int id)
    {
        var b = await _db.Benefits.FindAsync(id);
        if (b is null) return NotFound();
        _db.Benefits.Remove(b);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var cat = await _db.Categories.FindAsync(id);
        if (cat is null) return NotFound();
        var hasProducts = await _db.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts) return BadRequest("კატეგორიაში პროდუქტებია. ჯერ პროდუქტები გადაიტანეთ.");
        _db.Categories.Remove(cat);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record CategoryUpsertDto(
    string Name,
    string NameGe,
    string Icon,
    string Slug,
    int? ParentId
);

public record UpdateStatusDto(string Status);

public record ProductUpsertDto(
    string Name,
    string Description,
    decimal Price,
    decimal? OldPrice,
    string ImageUrl,
    string[]? Images,
    int CategoryId,
    string Brand,
    int Stock,
    bool IsFeatured,
    bool IsNew,
    bool HasInstallment,
    bool IsPublished,
    Dictionary<string, string>? Specs,
    List<ProductVariantDto>? Variants,
    string? SearchAlias
);

public record BenefitDto(string Icon, string Title, string Sub, int Order);

public record ProductVariantDto(
    string Label,
    decimal Price,
    decimal? OldPrice,
    int Stock
);
