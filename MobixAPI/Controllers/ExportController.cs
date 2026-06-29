using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MobixAPI.Data;

namespace MobixAPI.Controllers;

[ApiController]
[Route("api/admin/export")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _db;
    public ExportController(AppDbContext db) => _db = db;

    [HttpGet("products")]
    public async Task<IActionResult> ExportProducts()
    {
        var products = await _db.Products
            .Include(p => p.Category)
            .OrderBy(p => p.CategoryId)
            .ThenBy(p => p.Brand)
            .ThenBy(p => p.Name)
            .ToListAsync();

        using var wb = new XLWorkbook();

        // Group by category
        var groups = products.GroupBy(p => p.Category?.NameGe ?? p.Category?.Name ?? "სხვა");

        foreach (var group in groups)
        {
            var sheetName = group.Key.Length > 31 ? group.Key[..31] : group.Key;
            var ws = wb.AddWorksheet(sheetName);

            // ── Header row ──────────────────────────────────────────────
            var headers = new[]
            {
                "ID", "სახელი", "ბრენდი", "ფასი (₾)", "ძველი ფასი (₾)",
                "ფერები", "მეხსიერებები / ვარიანტები",
                "სტოკი", "განვადება", "Featured", "ახალი", "გამოქვეყნებული",
                "SearchAlias", "ბმული"
            };

            for (int col = 1; col <= headers.Length; col++)
            {
                var cell = ws.Cell(1, col);
                cell.Value = headers[col - 1];
                cell.Style.Font.Bold = true;
                cell.Style.Font.FontColor = XLColor.White;
                cell.Style.Fill.BackgroundColor = XLColor.FromArgb(192, 21, 42); // #c0152a
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            // ── Data rows ───────────────────────────────────────────────
            int row = 2;
            foreach (var p in group)
            {
                // Parse colors from specs (color_ prefix)
                var colors = p.Specs
                    .Where(kv => kv.Key.StartsWith("color_"))
                    .Select(kv => kv.Key.Replace("color_", ""))
                    .ToList();

                // Parse variants
                var variants = p.Variants.Count > 0
                    ? string.Join(", ", p.Variants.Select(v => $"{v.Label} ({v.Price}₾)"))
                    : "";

                var values = new object[]
                {
                    p.Id,
                    p.Name,
                    p.Brand,
                    p.Price,
                    (object)(p.OldPrice.HasValue ? p.OldPrice.Value : ""),
                    string.Join(", ", colors),
                    variants,
                    p.Stock,
                    p.HasInstallment ? "კი" : "არა",
                    p.IsFeatured   ? "კი" : "არა",
                    p.IsNew        ? "კი" : "არა",
                    p.IsPublished  ? "კი" : "არა",
                    p.SearchAlias,
                    $"https://mobix-shop.vercel.app/product/{p.Id}"
                };

                for (int col = 1; col <= values.Length; col++)
                {
                    var cell = ws.Cell(row, col);
                    cell.Value = values[col - 1]?.ToString() ?? "";

                    // Price columns — number format
                    if (col == 4 || col == 5)
                    {
                        if (double.TryParse(values[col - 1]?.ToString(), out var num))
                        {
                            cell.Value = num;
                            cell.Style.NumberFormat.Format = "#,##0.00";
                        }
                    }

                    // Alternate row color
                    if (row % 2 == 0)
                        cell.Style.Fill.BackgroundColor = XLColor.FromArgb(252, 242, 243);

                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                    cell.Style.Border.OutsideBorderColor = XLColor.FromArgb(220, 220, 220);
                    cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                }

                // Link column — make it a hyperlink
                var linkCell = ws.Cell(row, headers.Length);
                linkCell.Value = $"https://mobix-shop.vercel.app/product/{p.Id}";
                linkCell.Style.Font.FontColor = XLColor.Blue;
                linkCell.Style.Font.Underline = XLFontUnderlineValues.Single;

                row++;
            }

            // ── Auto-fit columns ────────────────────────────────────────
            ws.Columns().AdjustToContents();
            // Cap very wide columns
            foreach (var col in ws.ColumnsUsed())
                if (col.Width > 50) col.Width = 50;

            // Freeze header row
            ws.SheetView.FreezeRows(1);

            // Auto-filter
            ws.RangeUsed()?.SetAutoFilter();
        }

        // ── Summary sheet ────────────────────────────────────────────────
        var summary = wb.AddWorksheet("სულ");
        summary.Cell(1, 1).Value = "კატეგორია";
        summary.Cell(1, 2).Value = "პროდუქტების რაოდენობა";
        summary.Cell(1, 3).Value = "გამოქვეყნებული";
        summary.Cell(1, 4).Value = "მინ. ფასი";
        summary.Cell(1, 5).Value = "მაქს. ფასი";

        var headerRow = summary.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.FromArgb(192, 21, 42);
        headerRow.Style.Font.FontColor = XLColor.White;

        int sRow = 2;
        foreach (var group in products.GroupBy(p => p.Category?.NameGe ?? "სხვა"))
        {
            summary.Cell(sRow, 1).Value = group.Key;
            summary.Cell(sRow, 2).Value = group.Count();
            summary.Cell(sRow, 3).Value = group.Count(p => p.IsPublished);
            summary.Cell(sRow, 4).Value = (double)group.Min(p => p.Price);
            summary.Cell(sRow, 5).Value = (double)group.Max(p => p.Price);
            summary.Cell(sRow, 4).Style.NumberFormat.Format = "#,##0.00 ₾";
            summary.Cell(sRow, 5).Style.NumberFormat.Format = "#,##0.00 ₾";
            sRow++;
        }

        summary.Columns().AdjustToContents();

        // ── Return file ──────────────────────────────────────────────────
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        ms.Position = 0;

        var fileName = $"mobix-products-{DateTime.UtcNow:yyyy-MM-dd}.xlsx";
        return File(ms.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName);
    }
}
