import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    StatusBar
} from "react-native";
import { useRouter } from "expo-router";
import { Event, SearchEventsParams } from "@/types/events.interface";
import { getEvents, } from "@/api/event.service";
import { EventCard } from "@/components/EventCard";

export default function EventsList() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchEvents = async (params: SearchEventsParams = {}, refresh: boolean = false) => {
        try {
            setError(null);

            // Set the page parameter
            const queryParams = {
                ...params,
                page: refresh ? 1 : page,
                limit: 10 // Set your preferred limit
            };

            const response = await getEvents(queryParams);

            // Update state with the response data
            if (refresh || page === 1) {
                setEvents(response.items);
            } else {
                // Append to existing events for pagination
                setEvents(prevEvents => [...prevEvents, ...response.items]);
            }

            setTotalPages(response.totalPages);

            // Update page number for next fetch if there are more pages
            if (page < response.totalPages && !refresh) {
                setPage(page + 1);
            } else if (refresh) {
                setPage(2); // Reset to page 2 for next load more since we've loaded page 1 on refresh
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        // Initial data fetch
        fetchEvents();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchEvents({}, true);
    };

    const handleLoadMore = () => {
        if (page <= totalPages && !isLoadingMore) {
            setIsLoadingMore(true);
            fetchEvents();
        }
    };

    const handleEventPress = (eventId: string) => {
        router.push({
            pathname: "/event/[id]",
            params: { id: eventId }
        });
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#0070f3" />
                <Text style={styles.footerText}>Loading more events...</Text>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0070f3" />
                    <Text style={styles.loadingText}>Loading events...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && !refreshing && events.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <View style={styles.retryButton}>
                        <Text
                            style={styles.retryButtonText}
                            onPress={() => {
                                setLoading(true);
                                fetchEvents({}, true);
                            }}
                        >
                            Retry
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.header}>Upcoming Events</Text>
            <FlatList
                data={events}
                renderItem={({ item }) => (
                    <EventCard event={item} onPress={handleEventPress} />
                )}
                keyExtractor={(item) => item.eventId}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#fff"
                        colors={["#0070f3"]}
                        progressBackgroundColor="#333"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No events found</Text>
                    </View>
                }
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        padding: 16,
        paddingTop: 20,
    },
    listContainer: {
        padding: 16,
        paddingTop: 0,
    },
    loaderContainer: {
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#0070f3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
    },
    footerLoader: {
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#ccc',
        marginLeft: 8,
    },
});