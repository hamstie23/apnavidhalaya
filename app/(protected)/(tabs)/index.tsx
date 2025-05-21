import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function Home() {
	const { colorScheme } = useColorScheme();
	const logoColor = colorScheme === "dark" ? "#6366f1" : "#4f46e5"; // Indigo shade

	return (
		<View className="flex-1 items-center bg-background p-4 gap-y-4">
			{/* School Logo */}
			<View style={[styles.logoContainer, { backgroundColor: logoColor }]}>
				<Text style={styles.logoText}>AV</Text>
			</View>

			<H1 className="text-center">Apna Vidhayalaya School App</H1>
			<Muted className="text-center">
				Welcome to Apna Vidhayalaya School Management System. Access all your
				school resources in one place.
			</Muted>

			<View className="w-full mt-4">
				<Button
					className="w-full mb-3"
					variant="default"
					size="default"
					onPress={() => router.push("/(protected)/modal")}
				>
					<Text>View Announcements</Text>
				</Button>
				<Button
					className="w-full"
					variant="outline"
					size="default"
					onPress={() => router.push("/(protected)/modal")}
				>
					<Text>Academic Calendar</Text>
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 40,
		marginBottom: 24,
	},
	logoText: {
		fontSize: 40,
		fontWeight: "bold",
		color: "white",
	},
});
