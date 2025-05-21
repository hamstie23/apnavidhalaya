import { View } from "react-native";
import { H1, Muted } from "@/components/ui/typography";

export default function ErrorScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <H1 className="text-center">Account Setup Required</H1>
      <Muted className="text-center">
        Your account has not been properly set up. Please contact the administrator.
      </Muted>
    </View>
  );
}