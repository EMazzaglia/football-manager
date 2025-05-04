import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Home() {
    return (<View>
        <Text>Home Page</Text>
        <Link href={"/event/"}>Events</Link>
    </View>)
}