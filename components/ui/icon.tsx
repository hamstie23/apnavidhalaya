import { StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

interface IconProps {
	icon: string;
	color?: string;
	size?: number;
}

export function Icon({ icon, color = "black", size = 24 }: IconProps) {
	// Parse the icon string to determine which icon pack to use
	// Format expected: "pack:icon-name" like "ion:home" or "fa:user"
	const [pack, name] = icon.includes(":") ? icon.split(":") : ["mc", icon];

	return (
		<View style={styles.container}>
			{pack === "ion" && <Ionicons name={name} size={size} color={color} />}
			{pack === "fa" && <FontAwesome name={name} size={size} color={color} />}
			{(pack === "mc" || pack === "ph") && (
				<MaterialCommunityIcons
					name={mapPhToMc(name)}
					size={size}
					color={color}
				/>
			)}
		</View>
	);
}

// Function to map phosphor icon names to material community icon names
function mapPhToMc(name: string): string {
	// Map for common phosphor icons used in the app
	const iconMap: Record<string, string> = {
		// User related
		users: "account-group",
		"users-three": "account-group",
		"users-four": "account-group",
		user: "account",
		"user-circle": "account-circle",
		"chalkboard-teacher": "teach",
		
		// Communication
		"chat-circle": "chat",
		"chat-centered-text": "chat-processing",
		chat: "chat-outline",
		bell: "bell",
		phone: "phone",
		"paper-plane-right": "send",
		"video-camera": "video",
		paperclip: "paperclip",
		
		// Content & Documents
		"file-pdf": "file-pdf-box",
		"book-open": "book-open-variant",
		exam: "clipboard-text",
		folder: "folder",
		beaker: "flask",
		
		// Charts & Analytics
		"chart-line": "chart-line",
		"chart-bar": "chart-bar",
		
		// Navigation & UI
		info: "information",
		"sign-out": "logout",
		house: "home",
		calendar: "calendar",
		gear: "cog",
		pencil: "pencil",
		plus: "plus",
		trash: "delete",
		"caret-left": "chevron-left",
		"caret-right": "chevron-right",
		"caret-up": "chevron-up",
		"caret-down": "chevron-down",
		"magnifying-glass": "magnify",
		check: "check",
		"check-circle": "check-circle",
		x: "close",
		eye: "eye",
		clock: "clock-outline",
		"map-pin": "map-marker",
		list: "format-list-bulleted",
		
		// Sports
		"soccer-ball": "soccer",
	};

	return iconMap[name] || name;
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});
