import EventCard from '@/components/EventCard';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';

export default function Details() {
    return (
        <View>
            <Text>Details Screen</Text>
            <EventCard event={
                {
                    eventId: '1',
                    date: dayjs().add(2, 'days').toISOString(),
                    country: 'Spain',
                    homeTeam: 'Barcelona',
                    awayTeam: 'Madrid',
                    league: 'Espanish League',
                    price: 100,
                    availableSeats: 10000
                }} />
        </View>
    );
}