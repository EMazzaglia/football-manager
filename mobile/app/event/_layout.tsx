import { Stack } from "expo-router";

export default function EventsLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerTintColor: '#fff',
                headerTitle: 'Events',
                contentStyle: {
                    backgroundColor: '#25292e',
                },
            }}
        />
    );
}