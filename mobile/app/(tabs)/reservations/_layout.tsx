import { Stack } from "expo-router";

const ReservationsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" options={{ title: "Create Reservation" }} />
            <Stack.Screen name="my-tickets" options={{ title: "My Tickets" }} />
        </Stack>
    );
}
export default ReservationsLayout;