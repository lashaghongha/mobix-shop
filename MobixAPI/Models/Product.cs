namespace MobixAPI.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string[] Images { get; set; } = [];
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Brand { get; set; } = string.Empty;
    public int Stock { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNew { get; set; }
    public bool HasInstallment { get; set; }
    public int InstallmentMonths { get; set; } = 12;
    public Dictionary<string, string> Specs { get; set; } = new();
    public List<ProductVariant> Variants { get; set; } = [];
    public bool IsPublished { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string SearchAlias { get; set; } = string.Empty;
}

public class ProductVariant
{
    public string Label { get; set; } = string.Empty;   // e.g. "128GB", "256GB"
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int Stock { get; set; }
}
