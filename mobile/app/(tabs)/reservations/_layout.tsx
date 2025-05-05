import { Stack } from "expo-router";

const ReservationsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="createReservation" options={{ title: "Create Reservation" }} />
            <Stack.Screen name="index" options={{ title: "My Tickets" }} />
        </Stack>
    );
}
export default ReservationsLayout;