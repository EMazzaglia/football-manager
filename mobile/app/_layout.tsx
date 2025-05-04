import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen name="details" options={{ title: "Details" }} />
    </Stack>
  );
}
