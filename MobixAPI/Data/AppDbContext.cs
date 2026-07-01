using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MobixAPI.Models;
using System.Text.Json;

namespace MobixAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<BenefitItem> Benefits => Set<BenefitItem>();
    public DbSet<AgentChat> AgentChats => Set<AgentChat>();
    public DbSet<AgentMessage> AgentMessages => Set<AgentMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var imagesComparer = new ValueComparer<string[]>(
            (a, b) => (a == null && b == null) || (a != null && b != null && a.SequenceEqual(b)),
            v => v.Aggregate(0, (a, e) => HashCode.Combine(a, e.GetHashCode())),
            v => v.ToArray());

        var specsComparer = new ValueComparer<Dictionary<string, string>>(
            (a, b) => (a == null && b == null) || (a != null && b != null && a.Count == b.Count && !a.Except(b).Any()),
            v => v.Aggregate(0, (a, e) => HashCode.Combine(a, e.Key.GetHashCode(), e.Value.GetHashCode())),
            v => new Dictionary<string, string>(v));

        modelBuilder.Entity<Product>()
            .Property(p => p.Images)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<string[]>(v, (JsonSerializerOptions?)null) ?? Array.Empty<string>()
            )
            .Metadata.SetValueComparer(imagesComparer);

        modelBuilder.Entity<Product>()
            .Property(p => p.Specs)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, (JsonSerializerOptions?)null) ?? new()
            )
            .Metadata.SetValueComparer(specsComparer);

        var variantsComparer = new ValueComparer<List<ProductVariant>>(
            (a, b) => (a == null && b == null) || (a != null && b != null && a.Count == b.Count),
            v => v.Count,
            v => v.ToList());

        modelBuilder.Entity<Product>()
            .Property(p => p.Variants)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<ProductVariant>>(v, (JsonSerializerOptions?)null) ?? new()
            )
            .Metadata.SetValueComparer(variantsComparer);

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var categories = new[]
        {
            new Category { Id = 1, Name = "Smartphones", NameGe = "სმარტფონები", Icon = "📱", Slug = "smartphones" },
            new Category { Id = 2, Name = "Laptops", NameGe = "ლეპტოპები", Icon = "💻", Slug = "laptops" },
            new Category { Id = 3, Name = "TVs", NameGe = "ტელევიზორები", Icon = "📺", Slug = "tvs" },
            new Category { Id = 4, Name = "Tablets", NameGe = "ტაბლეტები", Icon = "📟", Slug = "tablets" },
            new Category { Id = 5, Name = "Audio", NameGe = "აუდიო", Icon = "🎧", Slug = "audio" },
            new Category { Id = 6, Name = "Cameras", NameGe = "კამერები", Icon = "📷", Slug = "cameras" },
            new Category { Id = 7, Name = "Gaming", NameGe = "გეიმინგი", Icon = "🎮", Slug = "gaming" },
            new Category { Id = 8, Name = "Smart Home", NameGe = "სმარტ ჰომი", Icon = "🏠", Slug = "smart-home" },
        };
        modelBuilder.Entity<Category>().HasData(categories);

        var products = new[]
        {
            // Smartphones
            new Product { Id = 1,  Name = "iPhone 15 Pro Max 256GB",       Price = 3999, OldPrice = 4299, Description = "Apple iPhone 15 Pro Max 256GB Natural Titanium",          ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",              CategoryId = 1, Brand = "Apple",     Stock = 15, Rating = 4.9, ReviewCount = 234, IsFeatured = true,  IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 2,  Name = "Samsung Galaxy S24 Ultra 512GB",  Price = 3499, OldPrice = 3799, Description = "Samsung Galaxy S24 Ultra 512GB Titanium Black",            ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp",          CategoryId = 1, Brand = "Samsung",   Stock = 20, Rating = 4.8, ReviewCount = 189, IsFeatured = true,  IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 3,  Name = "iPhone 15 128GB",                 Price = 2799, OldPrice = 2999, Description = "Apple iPhone 15 128GB Blue",                              ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp",                    CategoryId = 1, Brand = "Apple",     Stock = 30, Rating = 4.7, ReviewCount = 312, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 4,  Name = "Samsung Galaxy A55 5G",           Price = 1199, OldPrice = 1399, Description = "Samsung Galaxy A55 5G 256GB Awesome Lilac",               ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp",           CategoryId = 1, Brand = "Samsung",   Stock = 45, Rating = 4.5, ReviewCount = 156, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 5,  Name = "Xiaomi 14 Pro 512GB",             Price = 2499, OldPrice = 2699, Description = "Xiaomi 14 Pro 512GB Black",                               ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/thumbnail.webp",                   CategoryId = 1, Brand = "Xiaomi",    Stock = 25, Rating = 4.6, ReviewCount = 98,  IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 6,  Name = "Google Pixel 8 Pro 256GB",        Price = 2299, OldPrice = 2499, Description = "Google Pixel 8 Pro 256GB Obsidian",                       ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp",                  CategoryId = 1, Brand = "Google",    Stock = 18, Rating = 4.7, ReviewCount = 145, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },

            // Laptops
            new Product { Id = 7,  Name = "MacBook Pro 14\" M3 Pro",         Price = 5999, OldPrice = 6299, Description = "Apple MacBook Pro 14-inch M3 Pro 18GB RAM 512GB SSD",   ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp", CategoryId = 2, Brand = "Apple",   Stock = 12, Rating = 4.9, ReviewCount = 178, IsFeatured = true,  IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 8,  Name = "Dell XPS 15 OLED",                Price = 4599, OldPrice = 4999, Description = "Dell XPS 15 OLED Intel Core i7 32GB 1TB",               ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp",       CategoryId = 2, Brand = "Dell",     Stock = 8,  Rating = 4.7, ReviewCount = 89,  IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 9,  Name = "ASUS ROG Zephyrus G14",           Price = 3299, OldPrice = 3599, Description = "ASUS ROG Zephyrus G14 AMD Ryzen 9 16GB RTX 4060",       ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp", CategoryId = 2, Brand = "ASUS",    Stock = 10, Rating = 4.8, ReviewCount = 134, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 10, Name = "Lenovo ThinkPad X1 Carbon",       Price = 3899, OldPrice = 4199, Description = "Lenovo ThinkPad X1 Carbon Gen 11 Intel i7 16GB 512GB", ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",                    CategoryId = 2, Brand = "Lenovo",   Stock = 15, Rating = 4.6, ReviewCount = 67,  IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },

            // TVs
            new Product { Id = 11, Name = "Samsung 65\" QLED 4K Q80C",       Price = 2899, OldPrice = 3299, Description = "Samsung 65 inch QLED 4K Smart TV Q80C 2023",            ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400",                               CategoryId = 3, Brand = "Samsung",   Stock = 7,  Rating = 4.7, ReviewCount = 89,  IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 12, Name = "LG OLED 55\" C3",                  Price = 3499, OldPrice = 3899, Description = "LG 55 inch OLED 4K Smart TV C3 2023",                  ImageUrl = "https://images.unsplash.com/photo-1571415060716-baff5b4bce74?w=400",                               CategoryId = 3, Brand = "LG",        Stock = 5,  Rating = 4.9, ReviewCount = 112, IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 13, Name = "Sony Bravia XR 65\" OLED",         Price = 4299, OldPrice = 4799, Description = "Sony Bravia XR 65 inch OLED 4K Google TV",             ImageUrl = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400",                               CategoryId = 3, Brand = "Sony",      Stock = 6,  Rating = 4.8, ReviewCount = 76,  IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },

            // Tablets
            new Product { Id = 14, Name = "iPad Pro 12.9\" M2 256GB",         Price = 3499, OldPrice = 3799, Description = "Apple iPad Pro 12.9-inch M2 256GB WiFi Space Gray",   ImageUrl = "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp",         CategoryId = 4, Brand = "Apple",     Stock = 20, Rating = 4.9, ReviewCount = 201, IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 15, Name = "Samsung Galaxy Tab S9+",           Price = 2699, OldPrice = 2999, Description = "Samsung Galaxy Tab S9+ 12.4\" 256GB WiFi Beige",      ImageUrl = "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp",   CategoryId = 4, Brand = "Samsung",   Stock = 14, Rating = 4.7, ReviewCount = 134, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },

            // Audio
            new Product { Id = 16, Name = "AirPods Pro 2nd Gen",              Price = 799,  OldPrice = 899,  Description = "Apple AirPods Pro 2nd Generation with MagSafe Case",  ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",           CategoryId = 5, Brand = "Apple",     Stock = 50, Rating = 4.8, ReviewCount = 456, IsFeatured = true,  IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 17, Name = "Sony WH-1000XM5",                  Price = 999,  OldPrice = 1199, Description = "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp", CategoryId = 5, Brand = "Sony",      Stock = 30, Rating = 4.9, ReviewCount = 389, IsFeatured = true,  IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 18, Name = "JBL Charge 5",                     Price = 499,  OldPrice = 599,  Description = "JBL Charge 5 Portable Bluetooth Speaker Blue",         ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",        CategoryId = 5, Brand = "JBL",       Stock = 40, Rating = 4.6, ReviewCount = 267, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },

            // Gaming
            new Product { Id = 19, Name = "PlayStation 5 Disc Edition",       Price = 2199, OldPrice = 2399, Description = "Sony PlayStation 5 Console with Ultra HD Blu-ray",    ImageUrl = "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",                               CategoryId = 7, Brand = "Sony",      Stock = 10, Rating = 4.9, ReviewCount = 567, IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 20, Name = "Xbox Series X 1TB",                Price = 1999, OldPrice = 2199, Description = "Microsoft Xbox Series X 1TB Console",                  ImageUrl = "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400",                               CategoryId = 7, Brand = "Microsoft",  Stock = 12, Rating = 4.8, ReviewCount = 423, IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },

            // More Smartphones
            new Product { Id = 21, Name = "iPhone 14 Pro 256GB",              Price = 2999, OldPrice = 3299, Description = "Apple iPhone 14 Pro 256GB Deep Purple",                ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp",                     CategoryId = 1, Brand = "Apple",     Stock = 22, Rating = 4.7, ReviewCount = 445, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 22, Name = "Samsung Galaxy S23 FE 256GB",      Price = 1499, OldPrice = 1699, Description = "Samsung Galaxy S23 FE 256GB Graphite",                 ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/thumbnail.webp",           CategoryId = 1, Brand = "Samsung",   Stock = 35, Rating = 4.5, ReviewCount = 210, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 23, Name = "Nothing Phone (2) 256GB",          Price = 1799, OldPrice = 1999, Description = "Nothing Phone (2) 256GB White",                        ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/thumbnail.webp",                     CategoryId = 1, Brand = "Nothing",   Stock = 18, Rating = 4.6, ReviewCount = 134, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 24, Name = "OnePlus 12 512GB",                 Price = 2199, OldPrice = 2399, Description = "OnePlus 12 512GB Silky Black",                         ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp",                    CategoryId = 1, Brand = "OnePlus",   Stock = 20, Rating = 4.7, ReviewCount = 167, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 25, Name = "Xiaomi Redmi Note 13 Pro 256GB",   Price = 799,  OldPrice = 899,  Description = "Xiaomi Redmi Note 13 Pro 256GB Midnight Black",         ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/thumbnail.webp",                    CategoryId = 1, Brand = "Xiaomi",    Stock = 60, Rating = 4.4, ReviewCount = 523, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 26, Name = "Samsung Galaxy Z Flip5 256GB",     Price = 2899, OldPrice = 3199, Description = "Samsung Galaxy Z Flip5 256GB Mint",                    ImageUrl = "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/thumbnail.webp",                     CategoryId = 1, Brand = "Samsung",   Stock = 12, Rating = 4.6, ReviewCount = 98,  IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },

            // More Laptops
            new Product { Id = 27, Name = "MacBook Air 15\" M2 256GB",        Price = 3999, OldPrice = 4299, Description = "Apple MacBook Air 15-inch M2 8GB 256GB Midnight",      ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp",           CategoryId = 2, Brand = "Apple",     Stock = 20, Rating = 4.8, ReviewCount = 234, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 28, Name = "HP Spectre x360 14\"",             Price = 3499, OldPrice = 3799, Description = "HP Spectre x360 14-inch Intel Core i7 16GB 512GB",    ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp", CategoryId = 2, Brand = "HP",      Stock = 9,  Rating = 4.6, ReviewCount = 78,  IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 29, Name = "Microsoft Surface Laptop 5",       Price = 2799, OldPrice = 2999, Description = "Microsoft Surface Laptop 5 13.5\" Intel i5 8GB",      ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",                  CategoryId = 2, Brand = "Microsoft",  Stock = 11, Rating = 4.5, ReviewCount = 56,  IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 30, Name = "Acer Predator Helios 16",          Price = 4999, OldPrice = 5499, Description = "Acer Predator Helios 16 Intel i9 32GB RTX 4080",      ImageUrl = "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp", CategoryId = 2, Brand = "Acer",    Stock = 6,  Rating = 4.7, ReviewCount = 89,  IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },

            // More Audio
            new Product { Id = 31, Name = "Samsung Galaxy Buds2 Pro",         Price = 449,  OldPrice = 549,  Description = "Samsung Galaxy Buds2 Pro Graphite ANC Wireless",       ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp", CategoryId = 5, Brand = "Samsung", Stock = 45, Rating = 4.6, ReviewCount = 312, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 32, Name = "Bose QuietComfort 45",             Price = 899,  OldPrice = 1099, Description = "Bose QuietComfort 45 Wireless Noise Cancelling",       ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp", CategoryId = 5, Brand = "Bose",      Stock = 25, Rating = 4.8, ReviewCount = 289, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 33, Name = "JBL Flip 6 Bluetooth Speaker",     Price = 329,  OldPrice = 399,  Description = "JBL Flip 6 Portable Waterproof Bluetooth Speaker",    ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",        CategoryId = 5, Brand = "JBL",       Stock = 55, Rating = 4.5, ReviewCount = 445, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 34, Name = "Marshall Stanmore III Bluetooth",   Price = 799,  OldPrice = 899,  Description = "Marshall Stanmore III Bluetooth Home Speaker Black",  ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp", CategoryId = 5, Brand = "Marshall", Stock = 15, Rating = 4.7, ReviewCount = 156, IsFeatured = true,  IsNew = false, HasInstallment = false, IsPublished = true },

            // More Tablets
            new Product { Id = 35, Name = "iPad Air 5th Gen 64GB",            Price = 2299, OldPrice = 2499, Description = "Apple iPad Air 5th Generation 64GB WiFi Blue",         ImageUrl = "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp",         CategoryId = 4, Brand = "Apple",     Stock = 25, Rating = 4.8, ReviewCount = 178, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 36, Name = "iPad Mini 6th Gen 64GB",           Price = 1899, OldPrice = 2099, Description = "Apple iPad Mini 6th Generation 64GB WiFi Purple",      ImageUrl = "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/thumbnail.webp",        CategoryId = 4, Brand = "Apple",     Stock = 18, Rating = 4.7, ReviewCount = 134, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 37, Name = "Xiaomi Pad 6 Pro 256GB",           Price = 1099, OldPrice = 1299, Description = "Xiaomi Pad 6 Pro 12.4-inch 256GB WiFi Black",          ImageUrl = "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp", CategoryId = 4, Brand = "Xiaomi",    Stock = 22, Rating = 4.5, ReviewCount = 89,  IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },

            // More TVs
            new Product { Id = 38, Name = "Samsung 55\" Crystal UHD 4K",      Price = 1499, OldPrice = 1799, Description = "Samsung 55-inch Crystal UHD 4K Smart TV AU8000",      ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400",                               CategoryId = 3, Brand = "Samsung",   Stock = 12, Rating = 4.5, ReviewCount = 234, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 39, Name = "LG 43\" NanoCell 4K",              Price = 999,  OldPrice = 1199, Description = "LG 43-inch NanoCell 4K Smart TV NANO75 2023",          ImageUrl = "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400",                               CategoryId = 3, Brand = "LG",        Stock = 18, Rating = 4.4, ReviewCount = 167, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },

            // More Gaming
            new Product { Id = 40, Name = "Nintendo Switch OLED",             Price = 1499, OldPrice = 1699, Description = "Nintendo Switch OLED Model White Joy-Con 64GB",        ImageUrl = "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400",                               CategoryId = 7, Brand = "Nintendo",   Stock = 20, Rating = 4.8, ReviewCount = 678, IsFeatured = false, IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 41, Name = "Steam Deck 512GB OLED",            Price = 2199, OldPrice = 2399, Description = "Valve Steam Deck 512GB OLED Limited Edition",          ImageUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",                               CategoryId = 7, Brand = "Valve",      Stock = 8,  Rating = 4.9, ReviewCount = 234, IsFeatured = true,  IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 42, Name = "DualSense Edge PS5 Controller",    Price = 499,  OldPrice = 549,  Description = "Sony DualSense Edge Wireless Controller for PS5",      ImageUrl = "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",                               CategoryId = 7, Brand = "Sony",      Stock = 30, Rating = 4.7, ReviewCount = 345, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },

            // Cameras
            new Product { Id = 43, Name = "Sony Alpha A7 IV",                 Price = 5499, OldPrice = 5999, Description = "Sony Alpha A7 IV Full-Frame Mirrorless Camera Body",  ImageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",                               CategoryId = 6, Brand = "Sony",      Stock = 6,  Rating = 4.9, ReviewCount = 123, IsFeatured = true,  IsNew = false, HasInstallment = true,  IsPublished = true },
            new Product { Id = 44, Name = "Canon EOS R6 Mark II",             Price = 4799, OldPrice = 5299, Description = "Canon EOS R6 Mark II Mirrorless Camera Body",          ImageUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",                               CategoryId = 6, Brand = "Canon",     Stock = 7,  Rating = 4.8, ReviewCount = 98,  IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
            new Product { Id = 45, Name = "GoPro Hero 12 Black",              Price = 899,  OldPrice = 999,  Description = "GoPro Hero 12 Black 5.3K Action Camera Waterproof",   ImageUrl = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",                               CategoryId = 6, Brand = "GoPro",     Stock = 35, Rating = 4.7, ReviewCount = 567, IsFeatured = false, IsNew = true,  HasInstallment = false, IsPublished = true },
            new Product { Id = 46, Name = "DJI Mini 4 Pro Drone",             Price = 2799, OldPrice = 2999, Description = "DJI Mini 4 Pro 4K HDR Drone with RC 2 Controller",    ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",                               CategoryId = 6, Brand = "DJI",       Stock = 10, Rating = 4.8, ReviewCount = 189, IsFeatured = true,  IsNew = true,  HasInstallment = true,  IsPublished = true },

            // Smart Home
            new Product { Id = 47, Name = "Apple HomePod 2nd Gen",            Price = 999,  OldPrice = 1099, Description = "Apple HomePod 2nd Generation Smart Speaker Midnight",  ImageUrl = "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp", CategoryId = 8, Brand = "Apple", Stock = 20, Rating = 4.7, ReviewCount = 234, IsFeatured = false, IsNew = false, HasInstallment = false, IsPublished = true },
            new Product { Id = 48, Name = "Xiaomi Robot Vacuum X20 Pro",      Price = 1299, OldPrice = 1499, Description = "Xiaomi Robot Vacuum X20 Pro 6000Pa Laser Navigation",  ImageUrl = "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=400",                               CategoryId = 8, Brand = "Xiaomi",    Stock = 15, Rating = 4.6, ReviewCount = 312, IsFeatured = false, IsNew = true,  HasInstallment = true,  IsPublished = true },
        };
        modelBuilder.Entity<Product>().HasData(products);

        modelBuilder.Entity<BenefitItem>().HasData(
            new BenefitItem { Id = 1, Icon = "🚚", Title = "უფასო მიწოდება",     Sub = "500₾-ზე მეტი შეკვეთისთვის", Order = 1 },
            new BenefitItem { Id = 2, Icon = "🔄", Title = "14 დღე დაბრუნება",   Sub = "უპრობლემოდ",                  Order = 2 },
            new BenefitItem { Id = 3, Icon = "🛡️", Title = "ოფიციალური გარანტია", Sub = "24 თვე",                      Order = 3 },
            new BenefitItem { Id = 4, Icon = "💳", Title = "0% განვადება",         Sub = "12 თვეზე",                    Order = 4 }
        );
    }
}
