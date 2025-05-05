
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useRouter } from "expo-router";
import { getUserReservations } from "@/api/reservation.service";
import { Reservation } from "@/types/reservations.interface";
import { Ionicons } from "@expo/vector-icons";


export default function MyReservationsPage() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hardcoding userId for demonstration purposes
    const userId = "user1234";

    const fetchReservations = async (refresh = false) => {
        try {
            if (!refresh) setLoading(true);
            setError(null);

            const response = await getUserReservations(userId);
            setReservations(response.items);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            setError("Failed to load your reservations. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchReservations(true);
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderReservationItem = ({ item }: { item: Reservation }) => {
        return (
            <View style={styles.reservationCard}>
                <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackText}>Reservation #{item.id}</Text>
                    <Text style={styles.fallbackDetail}>Spots: {item.spots}</Text>
                    <Text style={styles.fallbackDetail}>
                        Reserved on {formatDate(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0070f3" />
                    <Text style={styles.loadingText}>Loading your reservations...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Tickets</Text>
                <Pressable
                    style={styles.newButton}
                    onPress={() => router.push("/events")}
                >
                    <Text style={styles.newButtonText}>New Reservation</Text>
                </Pressable>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable
                        style={styles.retryButton}
                        onPress={() => fetchReservations()}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            )}

            <FlatList
                data={reservations}
                renderItem={renderReservationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                        colors={["#0070f3"]}
                        progressBackgroundColor="#333"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="ticket-outline" size={64} color="#555" />
                        <Text style={styles.emptyText}>You don't have any tickets yet</Text>
                        <Pressable
                            style={styles.browseButton}
                            onPress={() => router.push("/events")}
                        >
                            <Text style={styles.browseButtonText}>Browse Events</Text>
                        </Pressable>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    newButton: {
        backgroundColor: '#0070f3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    newButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
        paddingTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderRadius: 8,
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    reservationCard: {
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#0070f3',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    matchText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8,
    },
    pendingBadge: {
        backgroundColor: '#f0ad4e',
    },
    confirmedBadge: {
        backgroundColor: '#5cb85c',
    },
    cancelledBadge: {
        backgroundColor: '#d9534f',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    detailsContainer: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        color: '#ccc',
        fontSize: 14,
        marginLeft: 8,
    },
    reservedDate: {
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
    },
    fallbackContainer: {
        padding: 8,
    },
    fallbackText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    fallbackDetail: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        marginTop: 40,
    },
    emptyText: {
        color: '#ccc',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    browseButton: {
        backgroundColor: '#0070f3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});