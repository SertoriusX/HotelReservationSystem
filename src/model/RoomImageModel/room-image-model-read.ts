export interface RoomImageModelRead {
  id: number;
  url: string;
  isMain?: boolean;
  roomId?: number;
  createdAt?: string;
}
