using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;
using MobixAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// SQLite path: use /data/mobix.db on Railway (persistent volume), fallback to local
var dbPath = Environment.GetEnvironmentVariable("DB_PATH") ?? "mobix.db";

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite($"Data Source={dbPath}")
       .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));
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
    db.Database.Migrate();
}

app.UseCors();
app.UseStaticFiles();
app.MapControllers();

app.Run();
