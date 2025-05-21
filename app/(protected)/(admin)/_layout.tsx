import { Stack } from "expo-router";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.layoutContainer}>
				<AdminSidebar />
				<View style={styles.contentContainer}>
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: { backgroundColor: "#F9FAFB" },
						}}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
	layoutContainer: {
		flex: 1,
		flexDirection: "row",
	},
	contentContainer: {
		flex: 1,
	},
});
