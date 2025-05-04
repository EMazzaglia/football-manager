
import client from './client';
import { Event, EventsResponse, SearchEventsParams } from '../types/events.interface';

export const getEvents = async (params?: SearchEventsParams): Promise<EventsResponse> => {
    const response = await client.get('/events', { params });
    return response.data;
};

export const getEventById = async (id: string): Promise<Event> => {
    const response = await client.get(`/events/${id}`);
    return response.data;
};