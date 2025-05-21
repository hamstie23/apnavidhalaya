import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";

export default function ParentLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#6B7280",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Icon icon="ph:house" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="student"
        options={{
          title: "Student",
          tabBarIcon: ({ color, size }) => (
            <Icon icon="ph:student" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Icon icon="ph:calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "Announcements",
          tabBarIcon: ({ color, size }) => (
            <Icon icon="ph:bell" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Icon icon="ph:chat-circle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}