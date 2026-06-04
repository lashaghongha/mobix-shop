using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .Where(c => c.ParentId == null)
            .Include(c => c.Children)
            .ToListAsync();
        return Ok(categories);
    }
}
