using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MobixAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductVariants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Variants",
                table: "Products",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(4500), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8679), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8690), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8701), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8707), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8714), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8798), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8805), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8813), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8820), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8826), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8832), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8839), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8869), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8876), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8882), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8889), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8895), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8901), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8907), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8914), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8939), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8945), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8952), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8958), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8964), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8970), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(8976), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9003), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9010), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9016), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9022), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9028), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9035), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9041), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9069), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9092), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9098), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9104), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9111), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9117), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9123), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9129), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9135), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9142), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9148), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9154), "[]" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "CreatedAt", "Variants" },
                values: new object[] { new DateTime(2026, 6, 10, 11, 50, 22, 816, DateTimeKind.Utc).AddTicks(9160), "[]" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Variants",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(476));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5587));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5601));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5611));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5619));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5627));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5679));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5688));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5732));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5741));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5748));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5756));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5765));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5773));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5781));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5816));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5824));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5832));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5840));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5848));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5855));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5863));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5894));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5902));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5910));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5918));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5926));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5934));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5942));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 30,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5951));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5981));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5990));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(5998));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6006));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6014));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6022));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6030));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 38,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6061));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 39,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6070));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 40,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6077));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6085));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6093));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 43,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6114));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 44,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6121));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 45,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6129));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 46,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6137));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 47,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6145));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 48,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 4, 15, 45, 42, 247, DateTimeKind.Utc).AddTicks(6152));
        }
    }
}
