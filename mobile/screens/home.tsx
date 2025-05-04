import EventCard from "@/components/EventCard";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import dayjs from "dayjs";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
    },
});