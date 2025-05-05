import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createReservation } from "@/api/reservation.service";
import { CreateReservationRequest } from "@/types/reservations.interface";

export default function ReservationPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const eventId = params.eventId as string;
    const homeTeam = params.homeTeam as string;
    const awayTeam = params.awayTeam as string;
    const date = params.date as string;
    const price = parseFloat(params.price as string || "0");
    const availableSeats = parseInt(params.availableSeats as string || "0");

    // If i would have authentication and sign up I would offert to buy tickets but before going through sign up into login the new user and then coming back to this page.
    // since Im going without auth, harcoding a userId
    const [userId, setUserId] = useState("user1234");
    const [spots, setSpots] = useState("1");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateReservation = async () => {
        const spotsNum = parseInt(spots);
        if (isNaN(spotsNum) || spotsNum < 1 || spotsNum > 2) {
            setError("Please enter a valid number of spots (1 or 2)");
            return;
        }

        // Check if enough seats are available
        if (spotsNum > availableSeats) {
            setError(`Only ${availableSeats} seats available for this event`);
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const reservationData: CreateReservationRequest = {
                userId,
                eventId,
                spots: spotsNum
            };

            await createReservation(reservationData);

            Alert.alert(
                "Reservation Created",
                `You have successfully reserved ${spotsNum} ticket(s) for ${homeTeam} vs ${awayTeam}`,
                [
                    {
                        text: "View My Tickets",
                        onPress: () => router.push("/reservations")
                    },
                    {
                        text: "Back to Events",
                        onPress: () => router.push("/events")
                    }
                ]
            );
        } catch (err) {
            console.error("Error creating reservation:", err);
            setError("Failed to create reservation. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!eventId) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>No event selected. Please select an event first.</Text>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.push("/events")}
                    >
                        <Text style={styles.backButtonText}>Browse Events</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>Book Tickets</Text>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.eventCard}>
                        <Text style={styles.eventTitle}>{homeTeam} vs {awayTeam}</Text>
                        <Text style={styles.eventDetail}>{new Date(date).toLocaleDateString()}</Text>
                        <Text style={styles.eventPrice}>Price: ${price}</Text>
                        <Text style={styles.eventSeats}>Available Seats: {availableSeats}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Number of Tickets (1-2)</Text>
                        <TextInput
                            style={styles.input}
                            value={spots}
                            onChangeText={setSpots}
                            keyboardType="number-pad"
                            maxLength={1}
                            placeholder="1"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total Price:</Text>
                            <Text style={styles.totalPrice}>${price * parseInt(spots || "1")}</Text>
                        </View>

                        <Pressable
                            style={[
                                styles.submitButton,
                                submitting && styles.disabledButton
                            ]}
                            onPress={handleCreateReservation}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Confirm Reservation</Text>
                            )}
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    backButton: {
        backgroundColor: '#0070f3',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    eventCard: {
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    eventDetail: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 4,
    },
    eventPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0fc76e',
        marginTop: 8,
    },
    eventSeats: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },
    formContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0fc76e',
    },
    submitButton: {
        backgroundColor: '#0070f3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    disabledButton: {
        backgroundColor: '#333',
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#555',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});