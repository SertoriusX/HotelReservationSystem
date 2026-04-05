using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelReservationSystem.Migrations
{
    /// <inheritdoc />
    public partial class database : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelImageRooms_Hotels_HotelId",
                table: "HotelImageRooms");

            migrationBuilder.DropIndex(
                name: "IX_HotelImageRooms_HotelId",
                table: "HotelImageRooms");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "HotelImageRooms");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "HotelImageRooms",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HotelImageRooms_HotelId",
                table: "HotelImageRooms",
                column: "HotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelImageRooms_Hotels_HotelId",
                table: "HotelImageRooms",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id");
        }
    }
}
