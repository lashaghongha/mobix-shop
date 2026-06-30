using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Models;
using OpenAI;
using OpenAI.Chat;
using System.Text.Json;
using System.ClientModel;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/admin/agents")]
public class AgentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public AgentsController(AppDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }

    // ── POST /api/admin/agents/chat ────────────────────────────────────────────
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        var key = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        return Ok(new { ok = true, hasKey = !string.IsNullOrEmpty(key), keyHint = key?.Length > 4 ? key[..4] + "..." : "none" });
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AgentChatRequest req)
    {
        try
        {
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
                  ?? _cfg["OpenAI:ApiKey"];

        if (string.IsNullOrEmpty(apiKey))
            return StatusCode(500, new { error = "OPENAI_API_KEY არ არის კონფიგურირებული Railway-ზე." });

        var client = new OpenAIClient(apiKey);
        var chat   = client.GetChatClient("gpt-4o-mini");

        // ── System prompt ──────────────────────────────────────────────────────
        var systemPrompt = """
            შენ ხარ MobiX ონლაინ მაღაზიის AI ასისტენტი. ქართულ ენაზე პასუხობ.

            კატეგორიები: 1=სმარტფონები, 2=ლეპტოპები, 3=ტელევიზორები,
            4=ტაბლეტები, 5=აუდიო, 6=კამერები, 7=Gaming, 8=Smart Home.

            ════════════════════════════════════════════
            ᲞᲠᲝᲓᲣᲥᲢᲘᲡ ᲓᲐᲛᲐᲢᲔᲑᲐ — სავალდებულო წესები:
            ════════════════════════════════════════════
            ᲙᲠᲘᲢᲘᲙᲣᲚᲘ: როდესაც მომხმარებელი ამბობს "დაამატე [პროდუქტი]" — ᲓᲐᲣᲧᲝᲕᲜᲔᲑᲚᲘᲕ
            გამოიძახე `prepare_product_form` შენი ცოდნის გამოყენებით. ᲐᲠᲐᲡᲝᲓᲔᲡ ჰკითხო
            ფასი, სპეციფიკაცია ან სხვა ინფორმაცია. შენ ეს ყველაფერი იცი — გამოიყენე.
            თუ ფასი არ იცი, დაწერე გონივრული საბაზრო ფასი საქართველოში.

            1. ყოველთვის გამოიყენე `prepare_product_form` (არ გამოიყენო `create_product`)
            2. გამოიყენე შენი სრული ცოდნა — ყველა spec შეავსე ზუსტად
            3. ᲐᲠᲐᲡᲝᲓᲔᲡ დატოვო spec ველი ცარიელი — თუ მნიშვნელობა იცი, ჩაწერე
            4. ყველა ფერი ჩაწერე სახელი + სწორი HEX კოდი
            5. ყველა მეხსიერების ვარიანტი ჩაწერე ფასებით
            6. searchAlias: ქართული სახელი + ბრენდი + მოდელი, მძიმით გამოყოფილი

            ════════════════════════════════════════════
            ᲡᲛᲐᲠᲢᲤᲝᲜᲘᲡ ᲡᲠᲣᲚᲘ SPEC ᲒᲐᲡᲐᲦᲔᲑᲔᲑᲘ:
            ════════════════════════════════════════════
            brand_spec       → ბრენდი (Apple / Samsung / Google...)
            weight           → წონა გრამებში (მაგ: "194 g")
            battery_capacity → ელემენტი (მაგ: "3274 mAh, Li-Ion")
            charging_speed   → სადენიანი დამუხტვა (მაგ: "27W")
            wireless_charging→ უსადენო: "Yes" ან "No"
            wireless_speed   → უსადენო სიჩქარე (მაგ: "15W") — ცარიელი თუ No
            nfc              → "Yes" ან "No"
            release_year     → გამოშვების წელი (მაგ: "2024")
            screen_size      → ეკრანი (მაგ: "6.12 inches")
            resolution       → რეზოლუცია (მაგ: "2556×1179 px")
            refresh_rate     → Hz (მაგ: "120 Hz")
            brightness       → სიკაშკაშე (მაგ: "2000 nits")
            screen_type      → ტიპი (მაგ: "Super Retina XDR OLED")
            screen_protection→ დაცვა (მაგ: "Ceramic Shield")
            sim              → SIM ტიპი (მაგ: "Nano-SIM + eSIM")
            esim             → "Yes" ან "No"
            5g               → "Yes" ან "No"
            body             → კორპუსი (მაგ: "Titanium / Glass")
            ip               → IP დაცვა (მაგ: "IP68")
            chipset          → ჩიპი (მაგ: "Apple A18 Pro")
            gpu              → GPU (მაგ: "Apple GPU (6-core)")
            os               → სისტემა (მაგ: "iOS")
            os_version       → ვერსია (მაგ: "iOS 18")
            stereo           → სტერეო: "Yes" ან "No"
            bluetooth        → ვერსია (მაგ: "5.3")
            main_camera      → კამერა (მაგ: "48 MP, f/1.78, OIS")
            extra_cameras    → (მაგ: "Ultra Wide: 12 MP, f/2.2 | 5x Telephoto: 12 MP")
            front_camera     → წინა (მაგ: "12 MP, f/1.9, autofocus")
            main_video       → ვიდეო (მაგ: "4K@120fps HDR")
            front_video      → წინა ვიდეო (მაგ: "4K@60fps")
            storage          → შიდა (მაგ: "256 GB") — base ვარიანტი
            storage_type     → ტიპი (მაგ: "NVMe")
            ram              → RAM (მაგ: "8 GB")
            microsd          → "Yes" ან "No"
            jack35           → "Yes" ან "No"
            charging_port    → პორტი (მაგ: "USB-C" ან "Lightning")

            ════════════════════════════════════════════
            მოქმედების შემდეგ ქართულად მოკლედ ახსენი რა გააკეთე.
            """;

        // ── Tool definitions ───────────────────────────────────────────────────
        var tools = new List<ChatTool>
        {
            ChatTool.CreateFunctionTool(
                "prepare_product_form",
                "მოამზადებს პროდუქტის ფორმის მონაცემებს — DB-ში არ წერს, მომხმარებელი ამოწმებს ფორმაში",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "name":           { "type": "string",  "description": "პროდუქტის სახელი" },
                    "brand":          { "type": "string",  "description": "ბრენდი" },
                    "categoryId":     { "type": "integer", "description": "კატეგორიის ID: 1=სმარტფონები,2=ლეპტოპები,3=ტელევიზორები,4=ტაბლეტები,5=აუდიო,6=კამერები,7=Gaming,8=Smart Home" },
                    "price":          { "type": "number",  "description": "ფასი ლარში" },
                    "oldPrice":       { "type": "number",  "description": "ძველი ფასი" },
                    "description":    { "type": "string",  "description": "პროდუქტის სრული აღწერა ქართულად" },
                    "stock":          { "type": "integer", "description": "მარაგი" },
                    "searchAlias":    { "type": "string",  "description": "ქართული საძიებო ალიასები მძიმით" },
                    "isNew":          { "type": "boolean" },
                    "isFeatured":     { "type": "boolean" },
                    "hasInstallment": { "type": "boolean" },
                    "specs": {
                      "type": "object",
                      "description": "ტექნიკური სპეციფიკაციები. გასაღებები: brand_spec, weight, battery_capacity, charging_speed, wireless_charging, wireless_speed, nfc, release_year, screen_size, resolution, refresh_rate, brightness, screen_type, screen_protection, sim, esim, 5g, body, ip, chipset, gpu, os, os_version, stereo, bluetooth, main_camera, extra_cameras, front_camera, main_video, front_video, storage, storage_type, ram, microsd, jack35, charging_port",
                      "additionalProperties": { "type": "string" }
                    },
                    "colors": {
                      "type": "array",
                      "description": "ფერები — სახელი და HEX",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": { "type": "string" },
                          "hex":  { "type": "string" }
                        }
                      }
                    },
                    "variants": {
                      "type": "array",
                      "description": "მეხსიერების ვარიანტები",
                      "items": {
                        "type": "object",
                        "properties": {
                          "label":    { "type": "string" },
                          "price":    { "type": "number" },
                          "oldPrice": { "type": "number" },
                          "stock":    { "type": "integer" }
                        }
                      }
                    }
                  },
                  "required": ["name", "brand", "categoryId", "price", "description", "stock"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "create_product",
                "ახალი პროდუქტის დამატება მაღაზიაში (პირდაპირ DB-ში, ფორმის გარეშე)",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "name":           { "type": "string",  "description": "პროდუქტის სახელი" },
                    "brand":          { "type": "string",  "description": "ბრენდი" },
                    "categoryId":     { "type": "integer", "description": "კატეგორიის ID (1-8)" },
                    "price":          { "type": "number",  "description": "ფასი ლარში" },
                    "oldPrice":       { "type": "number",  "description": "ძველი ფასი (optional)" },
                    "description":    { "type": "string",  "description": "პროდუქტის აღწერა ქართულად" },
                    "stock":          { "type": "integer", "description": "მარაგი" },
                    "brand_spec":     { "type": "string",  "description": "ბრენდი spec-ისთვის" },
                    "searchAlias":    { "type": "string",  "description": "ქართული საძიებო ალიასები" },
                    "isNew":          { "type": "boolean", "description": "ახალი პროდუქტია?" },
                    "isFeatured":     { "type": "boolean", "description": "გამორჩეულია?" },
                    "hasInstallment": { "type": "boolean", "description": "განვადება?" }
                  },
                  "required": ["name", "brand", "categoryId", "price", "description", "stock"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "update_product_price",
                "პროდუქტის ფასის შეცვლა",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "productId": { "type": "integer", "description": "პროდუქტის ID" },
                    "price":     { "type": "number",  "description": "ახალი ფასი" },
                    "oldPrice":  { "type": "number",  "description": "ძველი ფასი (optional)" }
                  },
                  "required": ["productId", "price"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "update_stock",
                "პროდუქტის სტოკის განახლება",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "productId": { "type": "integer", "description": "პროდუქტის ID" },
                    "stock":     { "type": "integer", "description": "ახალი სტოკი" }
                  },
                  "required": ["productId", "stock"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "generate_seo",
                "პროდუქტის SEO მეტა-ტეგების გენერაცია",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "productId": { "type": "integer", "description": "პროდუქტის ID (optional)" },
                    "productName": { "type": "string", "description": "პროდუქტის სახელი" }
                  },
                  "required": ["productName"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "search_products",
                "პროდუქტების ძიება ბაზაში",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "query":      { "type": "string",  "description": "საძიებო სიტყვა" },
                    "categoryId": { "type": "integer", "description": "კატეგორიის ID (optional)" }
                  },
                  "required": ["query"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "apply_discount",
                "ფასდაკლების დამატება პროდუქტ(ებ)ზე",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "brand":      { "type": "string",  "description": "ბრენდი (optional)" },
                    "categoryId": { "type": "integer", "description": "კატეგორია (optional)" },
                    "productId":  { "type": "integer", "description": "კონკრეტული პროდუქტი (optional)" },
                    "percent":    { "type": "number",  "description": "ფასდაკლება პროცენტებში" }
                  },
                  "required": ["percent"]
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "get_low_stock",
                "დაბალი სტოკის მქონე პროდუქტების ჩამონათვალი",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "threshold": { "type": "integer", "description": "მინიმალური სტოკი (default: 5)" }
                  }
                }
                """)
            ),

            ChatTool.CreateFunctionTool(
                "generate_description",
                "პროდუქტის სრული აღწერის დაწერა ქართულად",
                BinaryData.FromString("""
                {
                  "type": "object",
                  "properties": {
                    "productName": { "type": "string", "description": "პროდუქტის სახელი" },
                    "specs":       { "type": "string", "description": "ტექნიკური მახასიათებლები" }
                  },
                  "required": ["productName"]
                }
                """)
            )
        };

        // ── Build messages ─────────────────────────────────────────────────────
        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(systemPrompt)
        };

        foreach (var msg in req.History)
        {
            if (msg.Role == "user")
                messages.Add(new UserChatMessage(msg.Content));
            else if (msg.Role == "assistant")
                messages.Add(new AssistantChatMessage(msg.Content));
        }
        messages.Add(new UserChatMessage(req.Message));

        // ── Agentic loop ───────────────────────────────────────────────────────
        var options = new ChatCompletionOptions { MaxOutputTokenCount = 1500 };
        foreach (var t in tools) options.Tools.Add(t);

        var actions = new List<AgentAction>();
        int loops = 0;

        while (loops++ < 5)
        {
            var completion = await chat.CompleteChatAsync(messages, options);
            var result     = completion.Value;

            if (result.FinishReason == ChatFinishReason.ToolCalls)
            {
                var assistantMsg = new AssistantChatMessage(result);
                messages.Add(assistantMsg);

                foreach (var call in result.ToolCalls)
                {
                    var (toolResult, action) = await ExecuteTool(call.FunctionName, call.FunctionArguments.ToString());
                    actions.Add(action);
                    messages.Add(new ToolChatMessage(call.Id, toolResult));
                }
            }
            else
            {
                var finalText = result.Content[0].Text;
                return Ok(new AgentChatResponse
                {
                    Message = finalText,
                    Actions = actions
                });
            }
        }

        return Ok(new AgentChatResponse
        {
            Message = "მოქმედება შესრულდა.",
            Actions = actions
        });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, type = ex.GetType().Name, stack = ex.StackTrace?.Split('\n').Take(5) });
        }
    }

    // ── Tool executor ──────────────────────────────────────────────────────────
    private async Task<(string result, AgentAction action)> ExecuteTool(string name, string argsJson)
    {
        try
        {
            using var doc  = JsonDocument.Parse(argsJson);
            var args = doc.RootElement;

            switch (name)
            {
                case "prepare_product_form":
                {
                    var specs = new Dictionary<string, string>();
                    if (args.TryGetProperty("specs", out var specsEl) && specsEl.ValueKind == JsonValueKind.Object)
                        foreach (var sp in specsEl.EnumerateObject())
                            specs[sp.Name] = sp.Value.GetString() ?? "";

                    var colors = new List<object>();
                    if (args.TryGetProperty("colors", out var colorsEl) && colorsEl.ValueKind == JsonValueKind.Array)
                        foreach (var c in colorsEl.EnumerateArray())
                            colors.Add(new { name = c.GetStringOrDefault("name"), hex = c.GetStringOrDefault("hex") });

                    var variants = new List<object>();
                    if (args.TryGetProperty("variants", out var varsEl) && varsEl.ValueKind == JsonValueKind.Array)
                        foreach (var v in varsEl.EnumerateArray())
                            variants.Add(new {
                                label    = v.GetStringOrDefault("label"),
                                price    = v.TryGetProperty("price",    out var vp) ? vp.GetDecimal() : 0,
                                oldPrice = v.TryGetProperty("oldPrice", out var vop) ? vop.GetDecimal() : (decimal?)null,
                                stock    = v.TryGetProperty("stock",    out var vs) ? vs.GetInt32() : 0
                            });

                    var formData = new {
                        name           = args.GetStringOrDefault("name"),
                        brand          = args.GetStringOrDefault("brand"),
                        categoryId     = args.GetIntOrDefault("categoryId", 1),
                        price          = args.GetDecimalOrDefault("price"),
                        oldPrice       = args.TryGetProperty("oldPrice", out var fop) ? fop.GetDecimal() : (decimal?)null,
                        description    = args.GetStringOrDefault("description"),
                        stock          = args.GetIntOrDefault("stock", 10),
                        searchAlias    = args.GetStringOrDefault("searchAlias"),
                        isNew          = args.GetBoolOrDefault("isNew", true),
                        isFeatured     = args.GetBoolOrDefault("isFeatured", false),
                        hasInstallment = args.GetBoolOrDefault("hasInstallment", true),
                        specs,
                        colors,
                        variants
                    };

                    return (JsonSerializer.Serialize(formData),
                        new AgentAction {
                            Agent    = "Product Agent",
                            Action   = "prepare_form",
                            Summary  = $"'{args.GetStringOrDefault("name")}' ფორმა მომზადდა",
                            FormData = JsonSerializer.Serialize(formData)
                        });
                }

                case "create_product":
                {
                    var product = new Product
                    {
                        Name          = args.GetStringOrDefault("name"),
                        Brand         = args.GetStringOrDefault("brand"),
                        CategoryId    = args.GetIntOrDefault("categoryId", 1),
                        Price         = args.GetDecimalOrDefault("price"),
                        OldPrice      = args.TryGetProperty("oldPrice", out var op) ? op.GetDecimal() : null,
                        Description   = args.GetStringOrDefault("description"),
                        Stock         = args.GetIntOrDefault("stock", 0),
                        SearchAlias   = args.GetStringOrDefault("searchAlias"),
                        IsNew         = args.GetBoolOrDefault("isNew", true),
                        IsFeatured    = args.GetBoolOrDefault("isFeatured", false),
                        HasInstallment= args.GetBoolOrDefault("hasInstallment", true),
                        IsPublished   = true,
                        Specs         = new Dictionary<string, string>(),
                        ImageUrl      = "",
                    };
                    _db.Products.Add(product);
                    await _db.SaveChangesAsync();
                    return ($"პროდუქტი დაემატა ID={product.Id}",
                        new AgentAction { Agent = "Product Agent", Action = "create", EntityId = product.Id, Summary = $"'{product.Name}' დაემატა (ID: {product.Id})" });
                }

                case "update_product_price":
                {
                    var id = args.GetIntOrDefault("productId");
                    var p  = await _db.Products.FindAsync(id);
                    if (p == null) return ("პროდუქტი ვერ მოიძებნა", new AgentAction { Agent = "Price Agent", Action = "error", Summary = "პროდუქტი ვერ მოიძებნა" });
                    p.OldPrice = p.Price;
                    p.Price    = args.GetDecimalOrDefault("price");
                    if (args.TryGetProperty("oldPrice", out var op2)) p.OldPrice = op2.GetDecimal();
                    await _db.SaveChangesAsync();
                    return ($"ფასი განახლდა: {p.Price}₾",
                        new AgentAction { Agent = "Price Agent", Action = "update_price", EntityId = id, Summary = $"'{p.Name}' ფასი: {p.Price}₾" });
                }

                case "update_stock":
                {
                    var id = args.GetIntOrDefault("productId");
                    var p  = await _db.Products.FindAsync(id);
                    if (p == null) return ("პროდუქტი ვერ მოიძებნა", new AgentAction { Agent = "Inventory Agent", Action = "error", Summary = "ვერ მოიძებნა" });
                    p.Stock = args.GetIntOrDefault("stock");
                    await _db.SaveChangesAsync();
                    return ($"სტოკი განახლდა: {p.Stock}",
                        new AgentAction { Agent = "Inventory Agent", Action = "update_stock", EntityId = id, Summary = $"'{p.Name}' სტოკი: {p.Stock}" });
                }

                case "generate_seo":
                {
                    var pName = args.GetStringOrDefault("productName");
                    var seo = new
                    {
                        title       = $"{pName} | MobiX — ყიდვა ონლაინ საქართველოში",
                        description = $"შეიძინეთ {pName} MobiX-ზე — სწრაფი მიტანა, გარანტია, განვადება. საუკეთესო ფასი!",
                        keywords    = $"{pName}, ყიდვა, ონლაინ, MobiX, ტელეფონი, ელექტრონიკა",
                        slug        = pName.ToLower().Replace(" ", "-").Replace("'", "")
                    };
                    return (JsonSerializer.Serialize(seo),
                        new AgentAction { Agent = "SEO Agent", Action = "generate_seo", Summary = $"'{pName}' SEO გენერირდა" });
                }

                case "search_products":
                {
                    var q  = args.GetStringOrDefault("query").ToLower();
                    var catId = args.TryGetProperty("categoryId", out var cat) ? (int?)cat.GetInt32() : null;
                    var query = _db.Products.AsQueryable();
                    if (catId.HasValue) query = query.Where(p => p.CategoryId == catId.Value);
                    var results = await query
                        .Where(p => p.Name.ToLower().Contains(q) || p.Brand.ToLower().Contains(q) || p.SearchAlias.ToLower().Contains(q))
                        .Take(5)
                        .Select(p => new { p.Id, p.Name, p.Brand, p.Price, p.Stock, p.IsPublished })
                        .ToListAsync();
                    return (JsonSerializer.Serialize(results),
                        new AgentAction { Agent = "Product Agent", Action = "search", Summary = $"'{q}' — {results.Count} შედეგი" });
                }

                case "apply_discount":
                {
                    var percent   = args.GetDecimalOrDefault("percent");
                    var brand     = args.TryGetProperty("brand",      out var b)   ? b.GetString()   : null;
                    var catId2    = args.TryGetProperty("categoryId", out var c)   ? (int?)c.GetInt32() : null;
                    var productId = args.TryGetProperty("productId",  out var pid) ? (int?)pid.GetInt32() : null;

                    var q2 = _db.Products.AsQueryable();
                    if (!string.IsNullOrEmpty(brand))  q2 = q2.Where(p => p.Brand.ToLower() == brand!.ToLower());
                    if (catId2.HasValue)   q2 = q2.Where(p => p.CategoryId == catId2.Value);
                    if (productId.HasValue) q2 = q2.Where(p => p.Id == productId.Value);

                    var prods = await q2.ToListAsync();
                    foreach (var p in prods)
                    {
                        p.OldPrice = p.Price;
                        p.Price    = Math.Round(p.Price * (1 - percent / 100), 2);
                    }
                    await _db.SaveChangesAsync();
                    return ($"{prods.Count} პროდუქტს {percent}% ფასდაკლება დაემატა",
                        new AgentAction { Agent = "Price Agent", Action = "discount", Summary = $"{percent}% ფასდაკლება — {prods.Count} პროდუქტი" });
                }

                case "get_low_stock":
                {
                    var threshold = args.TryGetProperty("threshold", out var t) ? t.GetInt32() : 5;
                    var low = await _db.Products
                        .Where(p => p.Stock <= threshold && p.IsPublished)
                        .OrderBy(p => p.Stock)
                        .Select(p => new { p.Id, p.Name, p.Brand, p.Stock })
                        .ToListAsync();
                    return (JsonSerializer.Serialize(low),
                        new AgentAction { Agent = "Inventory Agent", Action = "low_stock_check", Summary = $"{low.Count} პროდუქტი დაბალი სტოკით" });
                }

                case "generate_description":
                {
                    var pName2 = args.GetStringOrDefault("productName");
                    var specs2 = args.TryGetProperty("specs", out var sp) ? sp.GetString() : "";
                    var desc   = $"{pName2} — პრემიუმ ხარისხის პროდუქტი MobiX-ისგან. " +
                                 $"სრულყოფილი არჩევანი მათთვის, ვინც აფასებს ხარისხს. " +
                                 (string.IsNullOrEmpty(specs2) ? "" : $"მახასიათებლები: {specs2}. ") +
                                 "სწრაფი მიტანა, ოფიციალური გარანტია, განვადება.";
                    return (desc,
                        new AgentAction { Agent = "Description Agent", Action = "generate_description", Summary = $"'{pName2}' აღწერა გენერირდა" });
                }

                default:
                    return ("უცნობი tool", new AgentAction { Agent = "System", Action = name, Summary = "უცნობი მოქმედება" });
            }
        }
        catch (Exception ex)
        {
            return ($"შეცდომა: {ex.Message}", new AgentAction { Agent = "System", Action = "error", Summary = ex.Message });
        }
    }
}

// ── DTOs ───────────────────────────────────────────────────────────────────────
public record AgentChatRequest(string Message, List<ChatHistoryItem> History);
public record ChatHistoryItem(string Role, string Content);
public class AgentChatResponse
{
    public string Message { get; set; } = "";
    public List<AgentAction> Actions   { get; set; } = [];
}
public class AgentAction
{
    public string  Agent    { get; set; } = "";
    public string  Action   { get; set; } = "";
    public int?    EntityId { get; set; }
    public string  Summary  { get; set; } = "";
    public string? FormData { get; set; }
}

// ── JsonElement helpers ────────────────────────────────────────────────────────
internal static class JsonElementExtensions
{
    public static string GetStringOrDefault(this JsonElement e, string key, string def = "")
        => e.TryGetProperty(key, out var v) ? v.GetString() ?? def : def;

    public static int GetIntOrDefault(this JsonElement e, string key, int def = 0)
        => e.TryGetProperty(key, out var v) ? v.GetInt32() : def;

    public static decimal GetDecimalOrDefault(this JsonElement e, string key, decimal def = 0)
        => e.TryGetProperty(key, out var v) ? v.GetDecimal() : def;

    public static bool GetBoolOrDefault(this JsonElement e, string key, bool def = false)
        => e.TryGetProperty(key, out var v) ? v.GetBoolean() : def;
}
