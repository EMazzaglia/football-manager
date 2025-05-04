import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const RootLayout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: '#25292e',
          },
        }}
      />
    </>
  );
}