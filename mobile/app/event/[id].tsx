import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getEventById } from "@/api/event.service";
import { Event } from "@/types/events.interface";

export const EventDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event>({
        eventId: "",
        date: "",
        country: "",
        homeTeam: "",
        awayTeam: "",
        league: "",
        price: 0,
        availableSeats: 0,
    });
    const [loading, setIsLoading] = useState(true);

    const fetchEvent = async (id: string) => {
        try {
            const event = await getEventById(id);
            setEvent(event);
        } catch (error) {
            console.error("Error fetching event:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchEvent(id as string);
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading event details...</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Event not found</Text>
                <Pressable style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{event.homeTeam} vs {event.awayTeam}</Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Date & Time</Text>
                    <Text style={styles.infoText}>{event.date}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Country</Text>
                    <Text style={styles.infoText}>{event.country}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Price</Text>
                    <Text style={styles.infoText}>{event.price}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>League</Text>
                    <Text style={styles.infoText}>{event.league}</Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.infoLabel}>Available seats</Text>
                    <Text style={styles.descriptionText}>${event.availableSeats}</Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.infoLabel}>Price</Text>
                    <Text style={styles.descriptionText}>${event.price}</Text>
                </View>

                <Pressable style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Back to Events</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    content: {
        padding: 16,
        paddingTop: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
    },
    infoContainer: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ccc',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 16,
        color: '#fff',
    },
    descriptionContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#0070f3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
        marginBottom: 24,
    },
});