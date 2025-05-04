import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown: false }} />
            <Tabs.Screen name="event/index" options={{ title: "Events" }} />
            <Tabs.Screen name="event/[id]" options={{ title: "Event Details" }} />
        </Tabs>
    );
}

export default TabsLayout;