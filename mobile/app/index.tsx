import { Text, View, StyleSheet } from "react-native";
import EventCard from "@/components/EventCard";
import dayjs from "dayjs";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});