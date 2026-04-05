export interface ReviewModelRead {
    id: number;
    userId: number;
    username: string;
    roomId: number;
    roomName: string;
    hotelName?: string;
    comment: string;
    rating: number;
    createdAt: string;
}
