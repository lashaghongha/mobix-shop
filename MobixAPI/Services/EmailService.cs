using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MobixAPI.Models;

namespace MobixAPI.Services;

public class EmailSettings
{
    public string SmtpHost    { get; set; } = "";
    public int    SmtpPort    { get; set; } = 587;
    public bool   UseSsl      { get; set; } = false;
    public string Username    { get; set; } = "";
    public string Password    { get; set; } = "";
    public string FromAddress { get; set; } = "";
    public string FromName    { get; set; } = "MobiX Shop";
    public string AdminEmail  { get; set; } = "";
}

public class EmailService
{
    private readonly EmailSettings _cfg;
    private readonly ILogger<EmailService> _log;

    public EmailService(IConfiguration config, ILogger<EmailService> log)
    {
        _cfg = config.GetSection("Email").Get<EmailSettings>() ?? new();
        _log = log;
    }

    public bool IsConfigured =>
        !string.IsNullOrEmpty(_cfg.SmtpHost) &&
        !string.IsNullOrEmpty(_cfg.Username) &&
        !string.IsNullOrEmpty(_cfg.Password) &&
        !string.IsNullOrEmpty(_cfg.FromAddress);

    public async Task SendOrderConfirmationAsync(Order order)
    {
        if (!IsConfigured) { _log.LogWarning("Email not configured — skipping order confirmation."); return; }

        // Email to customer
        await SendAsync(
            to: order.Email,
            subject: $"შეკვეთა #{order.Id} მიღებულია — MobiX",
            html: BuildCustomerHtml(order)
        );

        // Email to admin
        if (!string.IsNullOrEmpty(_cfg.AdminEmail))
        {
            await SendAsync(
                to: _cfg.AdminEmail,
                subject: $"[MobiX] ახალი შეკვეთა #{order.Id} — {order.FirstName} {order.LastName}",
                html: BuildAdminHtml(order)
            );
        }
    }

    private async Task SendAsync(string to, string subject, string html)
    {
        try
        {
            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress(_cfg.FromName, _cfg.FromAddress));
            msg.To.Add(MailboxAddress.Parse(to));
            msg.Subject = subject;
            msg.Body = new TextPart("html") { Text = html };

            using var client = new SmtpClient();
            await client.ConnectAsync(_cfg.SmtpHost, _cfg.SmtpPort,
                _cfg.UseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_cfg.Username, _cfg.Password);
            await client.SendAsync(msg);
            await client.DisconnectAsync(true);

            _log.LogInformation("Email sent to {to}: {subject}", to, subject);
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Failed to send email to {to}", to);
        }
    }

    private static string BuildCustomerHtml(Order order)
    {
        var items = string.Join("", order.Items.Select(i => $"""
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;">
                <img src="{i.ImageUrl}" width="48" style="border-radius:6px;vertical-align:middle;margin-right:10px;" />
                {i.ProductName}
              </td>
              <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:center;">{i.Quantity}</td>
              <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;">₾{i.Price:F2}</td>
            </tr>
        """));

        return $"""
        <!DOCTYPE html>
        <html>
        <body style="font-family:system-ui,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
            <div style="background:#c0152a;padding:28px 32px;">
              <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">Mobi<span style="font-size:30px;">X</span></h1>
            </div>
            <div style="padding:32px;">
              <h2 style="margin:0 0 8px;color:#111;">გმადლობთ შეკვეთისთვის!</h2>
              <p style="color:#666;margin:0 0 24px;">თქვენი შეკვეთა <strong>#{order.Id}</strong> მიღებულია და მუშავდება.</p>

              <table width="100%" style="border-collapse:collapse;border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 16px;text-align:left;font-size:12px;color:#888;font-weight:600;">პროდუქტი</th>
                    <th style="padding:10px 16px;text-align:center;font-size:12px;color:#888;font-weight:600;">რ-ბა</th>
                    <th style="padding:10px 16px;text-align:right;font-size:12px;color:#888;font-weight:600;">ფასი</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>

              <div style="text-align:right;margin-top:16px;font-size:20px;font-weight:800;color:#111;">
                სულ: ₾{order.Total:F2}
              </div>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

              <div style="color:#555;font-size:14px;line-height:1.8;">
                <strong>მიტანის მისამართი:</strong><br/>
                {order.FirstName} {order.LastName}<br/>
                {order.City}, {order.Address}<br/>
                {order.Phone}
              </div>
            </div>
            <div style="background:#f9fafb;padding:20px 32px;text-align:center;color:#aaa;font-size:12px;">
              MobiX · ყველა უფლება დაცულია
            </div>
          </div>
        </body>
        </html>
        """;
    }

    private static string BuildAdminHtml(Order order)
    {
        var items = string.Join("", order.Items.Select(i =>
            $"<li>{i.ProductName} × {i.Quantity} — ₾{i.Price:F2}</li>"));

        return $"""
        <!DOCTYPE html>
        <html>
        <body style="font-family:system-ui,sans-serif;padding:20px;">
          <h2>ახალი შეკვეთა #{order.Id}</h2>
          <p><strong>მომხმარებელი:</strong> {order.FirstName} {order.LastName}</p>
          <p><strong>Email:</strong> {order.Email}</p>
          <p><strong>ტელ:</strong> {order.Phone}</p>
          <p><strong>მისამართი:</strong> {order.City}, {order.Address}</p>
          <p><strong>გადახდა:</strong> {order.PaymentMethod}</p>
          <p><strong>სულ:</strong> ₾{order.Total:F2}</p>
          <h3>პროდუქტები:</h3>
          <ul>{items}</ul>
        </body>
        </html>
        """;
    }
}
