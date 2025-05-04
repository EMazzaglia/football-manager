import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Event } from '@/types/events.interface';

interface EventCardProps {
    event: Event;
    onPress: (id: string) => void;
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Pressable
            style={styles.container}
            onPress={() => onPress(event.eventId)}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.league}>{event.league}</Text>
                    <Text style={styles.date}>{formatDate(event.date)}</Text>
                </View>

                <View style={styles.matchContainer}>
                    <Text style={styles.teamName}>{event.homeTeam}</Text>
                    <View style={styles.vsContainer}>
                        <Text style={styles.vs}>VS</Text>
                    </View>
                    <Text style={styles.teamName}>{event.awayTeam}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.location}>{event.country}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${event.price}</Text>
                        <Text style={styles.seats}>{event.availableSeats} seats left</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    league: {
        color: '#0070f3',
        fontWeight: '600',
        fontSize: 14,
    },
    date: {
        color: '#ccc',
        fontSize: 14,
    },
    matchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    teamName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    vsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        marginHorizontal: 8,
    },
    vs: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    location: {
        color: '#ccc',
        fontSize: 14,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        color: '#0fc76e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    seats: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 2,
    },
});