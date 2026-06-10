using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

var pgUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    if (!string.IsNullOrEmpty(pgUrl))
    {
        // Railway PostgreSQL — convert postgresql:// URL to Npgsql connection string
        var uri = new Uri(pgUrl);
        var userInfo = uri.UserInfo.Split(':');
        var connStr = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
        opt.UseNpgsql(connStr);
    }
    else
    {
        // Local development SQLite
        var dbPath = Environment.GetEnvironmentVariable("DB_PATH") ?? "mobix.db";
        opt.UseSqlite($"Data Source={dbPath}")
           .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }
});
builder.Services.AddSingleton<EmailService>();

// CORS — allow localhost (dev) + Vercel (prod) + any custom domain
var allowedOrigins = (Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries)
    .Concat(new[] {
        "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5176", "http://localhost:5177"
    })
    .Distinct()
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Add Benefits table if it doesn't exist (for existing databases)
    var isPostgres = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL"));
    if (isPostgres)
    {
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ""Benefits"" (
                ""Id"" SERIAL PRIMARY KEY,
                ""Icon"" TEXT NOT NULL DEFAULT '',
                ""Title"" TEXT NOT NULL DEFAULT '',
                ""Sub"" TEXT NOT NULL DEFAULT '',
                ""Order"" INTEGER NOT NULL DEFAULT 0
            );
        ");
        // Seed default benefits if empty
        var count = db.Benefits.Count();
        if (count == 0)
        {
            db.Database.ExecuteSqlRaw(@"
                INSERT INTO ""Benefits"" (""Icon"", ""Title"", ""Sub"", ""Order"") VALUES
                ('🚚', 'უფასო მიწოდება', '500₾-ზე მეტი შეკვეთისთვის', 1),
                ('🔄', '14 დღე დაბრუნება', 'უპრობლემოდ', 2),
                ('🛡️', 'ოფიციალური გარანტია', '24 თვე', 3),
                ('💳', '0% განვადება', '12 თვეზე', 4);
            ");
        }
    }
}

app.UseCors();
app.UseStaticFiles();
app.MapControllers();

app.Run();
