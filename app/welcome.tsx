import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";

export default function WelcomeScreen() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const logoColor = colorScheme === "dark" ? "#6366f1" : "#4f46e5"; // Indigo shade

	return (
		<SafeAreaView className="flex flex-1 bg-background p-4">
			<View className="flex flex-1 items-center justify-center gap-y-4 web:m-4">
				{/* Apna Vidhayalaya School Logo */}
				<View style={[styles.logoContainer, { backgroundColor: logoColor }]}>
					<Text style={styles.logoText}>AV</Text>
				</View>
				<H1 className="text-center">Apna Vidhayalaya School App</H1>
				<Muted className="text-center">
					Complete school management system for students, parents, and staff.
					Access attendance, grades, assignments, and more.
				</Muted>
			</View>
			<View className="flex flex-col gap-y-4 web:m-4">
				<Button
					size="default"
					variant="default"
					onPress={() => {
						router.push("/sign-up");
					}}
				>
					<Text>Register</Text>
				</Button>
				<Button
					size="default"
					variant="secondary"
					onPress={() => {
						router.push("/sign-in");
					}}
				>
					<Text>Login</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	logoText: {
		fontSize: 40,
		fontWeight: "bold",
		color: "white",
	},
});
