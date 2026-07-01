using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MobixAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddInstallmentMonths : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InstallmentMonths",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(1180), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3946), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3954), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3961), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3966), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3989), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3994), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(3999), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4004), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4008), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4013), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4017), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4036), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4041), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4045), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4050), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4055), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4059), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4064), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4081), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4086), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4115), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4120), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4125), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4129), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4134), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4139), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4157), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4162), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4166), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4171), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4176), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4181), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4185), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4203), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4208), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4212), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4217), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4221), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4226), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4231), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4248), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4253), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4258), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4262), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4267), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4271), 12 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "CreatedAt", "InstallmentMonths" },
                values: new object[] { new DateTime(2026, 7, 1, 14, 5, 59, 445, DateTimeKind.Utc).AddTicks(4276), 12 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InstallmentMonths",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 239, DateTimeKind.Utc).AddTicks(8920));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3383));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3433));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3443));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3453));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3461));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3470));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3479));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3487));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3494));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3554));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3562));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3569));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3613));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3620));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3627));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3634));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3662));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3669));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 20,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3677));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3684));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3691));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3698));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3705));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3733));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3740));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3748));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3755));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3762));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 30,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3769));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3776));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3783));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3809));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3816));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3823));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3830));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3837));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 38,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3844));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 39,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3851));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 40,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3878));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3885));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3892));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 43,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3911));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 44,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3919));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 45,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3926));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 46,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3933));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 47,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3940));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 48,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 1, 6, 48, 58, 240, DateTimeKind.Utc).AddTicks(3947));
        }
    }
}
