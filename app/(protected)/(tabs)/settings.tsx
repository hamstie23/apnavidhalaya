import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";

export default function Settings() {
	const { signOut } = useAuth();

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Apna Vidhayalaya Settings</H1>

			<Button
				className="w-full"
				size="default"
				variant="outline"
				onPress={() => {}}
			>
				<Text>Update Profile</Text>
			</Button>

			<Button
				className="w-full"
				size="default"
				variant="outline"
				onPress={() => {}}
			>
				<Text>Notification Preferences</Text>
			</Button>

			<Button
				className="w-full"
				size="default"
				variant="outline"
				onPress={() => {}}
			>
				<Text>About School</Text>
			</Button>

			<Button
				className="w-full mt-8"
				size="default"
				variant="destructive"
				onPress={async () => {
					await signOut();
				}}
			>
				<Text>Sign Out</Text>
			</Button>
		</View>
	);
}
