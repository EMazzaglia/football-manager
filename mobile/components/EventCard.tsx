import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Event } from '../types/events.interface';
import { Text } from '@react-navigation/elements';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    // Format date string to a more readable format
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.teamsContainer}>
                <Text style={styles.teamName}>
                    {event.homeTeam}
                </Text>
                <Text style={styles.versus}>vs</Text>
                <Text style={styles.teamName}>
                    {event.awayTeam}
                </Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Date:</Text>
                    <Text>{formattedDate}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>League:</Text>
                    <Text>{event.league}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Country:</Text>
                    <Text>{event.country}</Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        ${event.price}
                    </Text>
                </View>

                <View style={styles.seatsContainer}>
                    <Text style={event.availableSeats > 10 ? styles.seatsAvailable : styles.seatsLimited}>
                        {event.availableSeats} seats left
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: '#fff',
    },
    teamsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamName: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
    },
    versus: {
        marginHorizontal: 8,
        fontSize: 14,
        color: '#687076',
    },
    infoContainer: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: 70,
        color: '#687076',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceContainer: {
        backgroundColor: '#f0f8ff',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    price: {
        color: '#0a7ea4',
    },
    seatsContainer: {
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    seatsAvailable: {
        color: '#22c55e',
    },
    seatsLimited: {
        color: '#f59e0b',
    },
});

export default EventCard;