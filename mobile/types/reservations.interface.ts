export interface Reservation {
    id: string;
    userId: string;
    eventId: string;
    spots: number;
    createdAt: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface ReservationsResponse {
    items: Reservation[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface CreateReservationRequest {
    userId: string;
    eventId: string;
    spots: number;
}