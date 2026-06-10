using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/admin/upload")]
public class UploadController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("ფაილი არ არის");

        var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowed.Contains(file.ContentType.ToLower()))
            return BadRequest("მხოლოდ სურათები დასაშვებია (jpg, png, webp, gif)");

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest("ფაილი 10MB-ზე მეტია");

        var cloudName  = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
        var apiKey     = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
        var apiSecret  = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

        if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            return StatusCode(500, "Cloudinary კონფიგურაცია არ არის");

        var cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
        cloudinary.Api.Secure = true;

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File           = new FileDescription(file.FileName, stream),
            Folder         = "mobix",
            Transformation = new Transformation().Quality("auto").FetchFormat("auto"),
        };

        var result = await cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            return StatusCode(500, result.Error.Message);

        return Ok(new { url = result.SecureUrl.ToString() });
    }
}
