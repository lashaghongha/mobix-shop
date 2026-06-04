using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MobixAPI.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    NameGe = table.Column<string>(type: "TEXT", nullable: false),
                    Icon = table.Column<string>(type: "TEXT", nullable: false),
                    Slug = table.Column<string>(type: "TEXT", nullable: false),
                    ParentId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_Categories_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Categories",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: false),
                    Address = table.Column<string>(type: "TEXT", nullable: false),
                    City = table.Column<string>(type: "TEXT", nullable: false),
                    Total = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    PaymentMethod = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    OldPrice = table.Column<decimal>(type: "TEXT", nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    Images = table.Column<string>(type: "TEXT", nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    Rating = table.Column<double>(type: "REAL", nullable: false),
                    ReviewCount = table.Column<int>(type: "INTEGER", nullable: false),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsNew = table.Column<bool>(type: "INTEGER", nullable: false),
                    HasInstallment = table.Column<bool>(type: "INTEGER", nullable: false),
                    Specs = table.Column<string>(type: "TEXT", nullable: false),
                    IsPublished = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductName = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SessionId = table.Column<string>(type: "TEXT", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Icon", "Name", "NameGe", "ParentId", "Slug" },
                values: new object[,]
                {
                    { 1, "📱", "Smartphones", "სმარტფონები", null, "smartphones" },
                    { 2, "💻", "Laptops", "ლეპტოპები", null, "laptops" },
                    { 3, "📺", "TVs", "ტელევიზორები", null, "tvs" },
                    { 4, "📟", "Tablets", "ტაბლეტები", null, "tablets" },
                    { 5, "🎧", "Audio", "აუდიო", null, "audio" },
                    { 6, "📷", "Cameras", "კამერები", null, "cameras" },
                    { 7, "🎮", "Gaming", "გეიმინგი", null, "gaming" },
                    { 8, "🏠", "Smart Home", "სმარტ ჰომი", null, "smart-home" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "CreatedAt", "Description", "HasInstallment", "ImageUrl", "Images", "IsFeatured", "IsNew", "IsPublished", "Name", "OldPrice", "Price", "Rating", "ReviewCount", "Specs", "Stock" },
                values: new object[,]
                {
                    { 1, "Apple", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(476), "Apple iPhone 15 Pro Max 256GB Natural Titanium", true, "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp", "[]", true, true, true, "iPhone 15 Pro Max 256GB", 4299m, 3999m, 4.9000000000000004, 234, "{}", 15 },
                    { 2, "Samsung", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5587), "Samsung Galaxy S24 Ultra 512GB Titanium Black", true, "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp", "[]", true, true, true, "Samsung Galaxy S24 Ultra 512GB", 3799m, 3499m, 4.7999999999999998, 189, "{}", 20 },
                    { 3, "Apple", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5601), "Apple iPhone 15 128GB Blue", true, "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp", "[]", false, true, true, "iPhone 15 128GB", 2999m, 2799m, 4.7000000000000002, 312, "{}", 30 },
                    { 4, "Samsung", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5611), "Samsung Galaxy A55 5G 256GB Awesome Lilac", true, "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/thumbnail.webp", "[]", false, false, true, "Samsung Galaxy A55 5G", 1399m, 1199m, 4.5, 156, "{}", 45 },
                    { 5, "Xiaomi", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5619), "Xiaomi 14 Pro 512GB Black", true, "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/thumbnail.webp", "[]", true, false, true, "Xiaomi 14 Pro 512GB", 2699m, 2499m, 4.5999999999999996, 98, "{}", 25 },
                    { 6, "Google", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5627), "Google Pixel 8 Pro 256GB Obsidian", true, "https://cdn.dummyjson.com/product-images/smartphones/realme-c35/thumbnail.webp", "[]", false, true, true, "Google Pixel 8 Pro 256GB", 2499m, 2299m, 4.7000000000000002, 145, "{}", 18 },
                    { 7, "Apple", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5679), "Apple MacBook Pro 14-inch M3 Pro 18GB RAM 512GB SSD", true, "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp", "[]", true, true, true, "MacBook Pro 14\" M3 Pro", 6299m, 5999m, 4.9000000000000004, 178, "{}", 12 },
                    { 8, "Dell", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5688), "Dell XPS 15 OLED Intel Core i7 32GB 1TB", true, "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp", "[]", true, false, true, "Dell XPS 15 OLED", 4999m, 4599m, 4.7000000000000002, 89, "{}", 8 },
                    { 9, "ASUS", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5732), "ASUS ROG Zephyrus G14 AMD Ryzen 9 16GB RTX 4060", true, "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp", "[]", false, true, true, "ASUS ROG Zephyrus G14", 3599m, 3299m, 4.7999999999999998, 134, "{}", 10 },
                    { 10, "Lenovo", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5741), "Lenovo ThinkPad X1 Carbon Gen 11 Intel i7 16GB 512GB", true, "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp", "[]", false, false, true, "Lenovo ThinkPad X1 Carbon", 4199m, 3899m, 4.5999999999999996, 67, "{}", 15 },
                    { 11, "Samsung", 3, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5748), "Samsung 65 inch QLED 4K Smart TV Q80C 2023", true, "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400", "[]", true, false, true, "Samsung 65\" QLED 4K Q80C", 3299m, 2899m, 4.7000000000000002, 89, "{}", 7 },
                    { 12, "LG", 3, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5756), "LG 55 inch OLED 4K Smart TV C3 2023", true, "https://images.unsplash.com/photo-1571415060716-baff5b4bce74?w=400", "[]", true, false, true, "LG OLED 55\" C3", 3899m, 3499m, 4.9000000000000004, 112, "{}", 5 },
                    { 13, "Sony", 3, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5765), "Sony Bravia XR 65 inch OLED 4K Google TV", true, "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400", "[]", false, true, true, "Sony Bravia XR 65\" OLED", 4799m, 4299m, 4.7999999999999998, 76, "{}", 6 },
                    { 14, "Apple", 4, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5773), "Apple iPad Pro 12.9-inch M2 256GB WiFi Space Gray", true, "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp", "[]", true, false, true, "iPad Pro 12.9\" M2 256GB", 3799m, 3499m, 4.9000000000000004, 201, "{}", 20 },
                    { 15, "Samsung", 4, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5781), "Samsung Galaxy Tab S9+ 12.4\" 256GB WiFi Beige", true, "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp", "[]", false, true, true, "Samsung Galaxy Tab S9+", 2999m, 2699m, 4.7000000000000002, 134, "{}", 14 },
                    { 16, "Apple", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5816), "Apple AirPods Pro 2nd Generation with MagSafe Case", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp", "[]", true, false, true, "AirPods Pro 2nd Gen", 899m, 799m, 4.7999999999999998, 456, "{}", 50 },
                    { 17, "Sony", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5824), "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp", "[]", true, false, true, "Sony WH-1000XM5", 1199m, 999m, 4.9000000000000004, 389, "{}", 30 },
                    { 18, "JBL", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5832), "JBL Charge 5 Portable Bluetooth Speaker Blue", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp", "[]", false, false, true, "JBL Charge 5", 599m, 499m, 4.5999999999999996, 267, "{}", 40 },
                    { 19, "Sony", 7, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5840), "Sony PlayStation 5 Console with Ultra HD Blu-ray", true, "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400", "[]", true, false, true, "PlayStation 5 Disc Edition", 2399m, 2199m, 4.9000000000000004, 567, "{}", 10 },
                    { 20, "Microsoft", 7, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5848), "Microsoft Xbox Series X 1TB Console", true, "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400", "[]", true, false, true, "Xbox Series X 1TB", 2199m, 1999m, 4.7999999999999998, 423, "{}", 12 },
                    { 21, "Apple", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5855), "Apple iPhone 14 Pro 256GB Deep Purple", true, "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp", "[]", false, false, true, "iPhone 14 Pro 256GB", 3299m, 2999m, 4.7000000000000002, 445, "{}", 22 },
                    { 22, "Samsung", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5863), "Samsung Galaxy S23 FE 256GB Graphite", true, "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/thumbnail.webp", "[]", false, false, true, "Samsung Galaxy S23 FE 256GB", 1699m, 1499m, 4.5, 210, "{}", 35 },
                    { 23, "Nothing", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5894), "Nothing Phone (2) 256GB White", true, "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/thumbnail.webp", "[]", false, true, true, "Nothing Phone (2) 256GB", 1999m, 1799m, 4.5999999999999996, 134, "{}", 18 },
                    { 24, "OnePlus", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5902), "OnePlus 12 512GB Silky Black", true, "https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/thumbnail.webp", "[]", false, true, true, "OnePlus 12 512GB", 2399m, 2199m, 4.7000000000000002, 167, "{}", 20 },
                    { 25, "Xiaomi", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5910), "Xiaomi Redmi Note 13 Pro 256GB Midnight Black", false, "https://cdn.dummyjson.com/product-images/smartphones/vivo-v9/thumbnail.webp", "[]", false, false, true, "Xiaomi Redmi Note 13 Pro 256GB", 899m, 799m, 4.4000000000000004, 523, "{}", 60 },
                    { 26, "Samsung", 1, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5918), "Samsung Galaxy Z Flip5 256GB Mint", true, "https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/thumbnail.webp", "[]", true, false, true, "Samsung Galaxy Z Flip5 256GB", 3199m, 2899m, 4.5999999999999996, 98, "{}", 12 },
                    { 27, "Apple", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5926), "Apple MacBook Air 15-inch M2 8GB 256GB Midnight", true, "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp", "[]", false, false, true, "MacBook Air 15\" M2 256GB", 4299m, 3999m, 4.7999999999999998, 234, "{}", 20 },
                    { 28, "HP", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5934), "HP Spectre x360 14-inch Intel Core i7 16GB 512GB", true, "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp", "[]", false, true, true, "HP Spectre x360 14\"", 3799m, 3499m, 4.5999999999999996, 78, "{}", 9 },
                    { 29, "Microsoft", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5942), "Microsoft Surface Laptop 5 13.5\" Intel i5 8GB", true, "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp", "[]", false, false, true, "Microsoft Surface Laptop 5", 2999m, 2799m, 4.5, 56, "{}", 11 },
                    { 30, "Acer", 2, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5951), "Acer Predator Helios 16 Intel i9 32GB RTX 4080", true, "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp", "[]", false, true, true, "Acer Predator Helios 16", 5499m, 4999m, 4.7000000000000002, 89, "{}", 6 },
                    { 31, "Samsung", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5981), "Samsung Galaxy Buds2 Pro Graphite ANC Wireless", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp", "[]", false, false, true, "Samsung Galaxy Buds2 Pro", 549m, 449m, 4.5999999999999996, 312, "{}", 45 },
                    { 32, "Bose", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5990), "Bose QuietComfort 45 Wireless Noise Cancelling", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp", "[]", false, false, true, "Bose QuietComfort 45", 1099m, 899m, 4.7999999999999998, 289, "{}", 25 },
                    { 33, "JBL", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5998), "JBL Flip 6 Portable Waterproof Bluetooth Speaker", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp", "[]", false, false, true, "JBL Flip 6 Bluetooth Speaker", 399m, 329m, 4.5, 445, "{}", 55 },
                    { 34, "Marshall", 5, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6006), "Marshall Stanmore III Bluetooth Home Speaker Black", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp", "[]", true, false, true, "Marshall Stanmore III Bluetooth", 899m, 799m, 4.7000000000000002, 156, "{}", 15 },
                    { 35, "Apple", 4, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6014), "Apple iPad Air 5th Generation 64GB WiFi Blue", true, "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp", "[]", false, false, true, "iPad Air 5th Gen 64GB", 2499m, 2299m, 4.7999999999999998, 178, "{}", 25 },
                    { 36, "Apple", 4, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6022), "Apple iPad Mini 6th Generation 64GB WiFi Purple", true, "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/thumbnail.webp", "[]", false, false, true, "iPad Mini 6th Gen 64GB", 2099m, 1899m, 4.7000000000000002, 134, "{}", 18 },
                    { 37, "Xiaomi", 4, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6030), "Xiaomi Pad 6 Pro 12.4-inch 256GB WiFi Black", true, "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp", "[]", false, true, true, "Xiaomi Pad 6 Pro 256GB", 1299m, 1099m, 4.5, 89, "{}", 22 },
                    { 38, "Samsung", 3, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6061), "Samsung 55-inch Crystal UHD 4K Smart TV AU8000", true, "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400", "[]", false, false, true, "Samsung 55\" Crystal UHD 4K", 1799m, 1499m, 4.5, 234, "{}", 12 },
                    { 39, "LG", 3, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6070), "LG 43-inch NanoCell 4K Smart TV NANO75 2023", true, "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400", "[]", false, false, true, "LG 43\" NanoCell 4K", 1199m, 999m, 4.4000000000000004, 167, "{}", 18 },
                    { 40, "Nintendo", 7, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6077), "Nintendo Switch OLED Model White Joy-Con 64GB", true, "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400", "[]", false, false, true, "Nintendo Switch OLED", 1699m, 1499m, 4.7999999999999998, 678, "{}", 20 },
                    { 41, "Valve", 7, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6085), "Valve Steam Deck 512GB OLED Limited Edition", true, "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400", "[]", true, true, true, "Steam Deck 512GB OLED", 2399m, 2199m, 4.9000000000000004, 234, "{}", 8 },
                    { 42, "Sony", 7, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6093), "Sony DualSense Edge Wireless Controller for PS5", false, "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400", "[]", false, false, true, "DualSense Edge PS5 Controller", 549m, 499m, 4.7000000000000002, 345, "{}", 30 },
                    { 43, "Sony", 6, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6114), "Sony Alpha A7 IV Full-Frame Mirrorless Camera Body", true, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", "[]", true, false, true, "Sony Alpha A7 IV", 5999m, 5499m, 4.9000000000000004, 123, "{}", 6 },
                    { 44, "Canon", 6, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6121), "Canon EOS R6 Mark II Mirrorless Camera Body", true, "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400", "[]", false, true, true, "Canon EOS R6 Mark II", 5299m, 4799m, 4.7999999999999998, 98, "{}", 7 },
                    { 45, "GoPro", 6, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6129), "GoPro Hero 12 Black 5.3K Action Camera Waterproof", false, "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400", "[]", false, true, true, "GoPro Hero 12 Black", 999m, 899m, 4.7000000000000002, 567, "{}", 35 },
                    { 46, "DJI", 6, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6137), "DJI Mini 4 Pro 4K HDR Drone with RC 2 Controller", true, "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400", "[]", true, true, true, "DJI Mini 4 Pro Drone", 2999m, 2799m, 4.7999999999999998, 189, "{}", 10 },
                    { 47, "Apple", 8, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6145), "Apple HomePod 2nd Generation Smart Speaker Midnight", false, "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp", "[]", false, false, true, "Apple HomePod 2nd Gen", 1099m, 999m, 4.7000000000000002, 234, "{}", 20 },
                    { 48, "Xiaomi", 8, new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6152), "Xiaomi Robot Vacuum X20 Pro 6000Pa Laser Navigation", true, "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=400", "[]", false, true, true, "Xiaomi Robot Vacuum X20 Pro", 1499m, 1299m, 4.5999999999999996, 312, "{}", 15 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentId",
                table: "Categories",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
