import { RoomImageModelRead } from "../RoomImageModel/room-image-model-read";

export interface WishlishModel {
  roomId: number;
  roomName: string;
  roomPrice: number;
  hotelName: string;
  createdAt: string;
  imgs: RoomImageModelRead[];
}
