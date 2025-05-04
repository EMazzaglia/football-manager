
import client from './client';
import { CreateReservationRequest, Reservation, ReservationsResponse } from '../types/reservations.interface';

export const createReservation = async (data: CreateReservationRequest): Promise<Reservation> => {
    const response = await client.post('/reservations', data);
    return response.data;
};

export const getUserReservations = async (
    userId: string,
    status?: 'pending' | 'confirmed' | 'cancelled',
    page: number = 1,
    limit: number = 10
): Promise<ReservationsResponse> => {
    const response = await client.get(`/reservations/user/${userId}`, {
        params: { status, page, limit }
    });
    return response.data;
};