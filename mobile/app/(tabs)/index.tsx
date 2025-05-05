// app/(tabs)/index.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useRouter } from "expo-router";
import { getEvents } from "@/api/event.service";
import { Event } from "@/types/events.interface";
import { EventCard } from "@/components/EventCard";

export default function Home() {
    const router = useRouter();
    const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const response = await getEvents({ limit: 3 });
                setFeaturedEvents(response.items);
            } catch (error) {
                console.error("Error fetching featured events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedEvents();
    }, []);

    const handleEventPress = (eventId: string) => {
        router.push({
            pathname: "/events/[id]",
            params: { id: eventId }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.featuredSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured Events</Text>
                        <Pressable onPress={() => router.push('/events')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </Pressable>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading events...</Text>
                        </View>
                    ) : (
                        <View style={styles.eventsList}>
                            {featuredEvents.map((event) => (
                                <EventCard
                                    key={event.eventId}
                                    event={event}
                                    onPress={handleEventPress}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginTop: 20,
        marginBottom: 24,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 16,
        color: '#ccc',
        lineHeight: 22,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: '#444',
    },
    actionText: {
        color: '#fff',
        marginTop: 8,
        fontWeight: '500',
    },
    featuredSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    seeAllText: {
        color: '#0070f3',
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: '#ccc',
    },
    eventsList: {
        gap: 16,
    },
    categoriesSection: {
        marginBottom: 24,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        gap: 12,
    },
    categoryCard: {
        width: '47%',
        backgroundColor: '#333',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#444',
    },
    categoryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});