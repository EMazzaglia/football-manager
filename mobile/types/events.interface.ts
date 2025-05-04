export interface Event {
    eventId: string;
    date: string;
    country: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    price: number;
    availableSeats: number;
}

export interface EventsResponse {
    items: Event[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface SearchEventsParams {
    country?: string;
    date?: string;
    homeTeam?: string;
    awayTeam?: string;
    team?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}