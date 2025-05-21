import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router, usePathname } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/context/supabase-provider";
import { H2, Muted } from "@/components/ui/typography";

interface NavItem {
  title: string;
  icon: string;
  path: string;
}

const NAVIGATION_ITEMS: NavItem[] = [
  { title: "Dashboard", icon: "ph:house", path: "/admin" },
  { title: "Users", icon: "ph:users", path: "/admin/users" },
  { title: "Calendar", icon: "ph:calendar", path: "/admin/calendar" },
  { title: "Announcements", icon: "ph:bell", path: "/admin/announcements" },
  { title: "Groups", icon: "ph:users-three", path: "/admin/groups" },
  { title: "Chat", icon: "ph:chat-circle", path: "/admin/chat" },
  { title: "Settings", icon: "ph:gear", path: "/admin/settings" },
];

export default function AdminSidebar() {
  const { signOut } = useAuth();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/welcome");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <H2>Apna Vidhayalaya</H2>
        <Muted>Admin Panel</Muted>
      </View>

      <View style={styles.navContainer}>
        {NAVIGATION_ITEMS.map((item) => (
          <Pressable
            key={item.title}
            style={[
              styles.navItem,
              pathname === item.path && styles.activeNavItem,
            ]}
            onPress={() => handleNavigation(item.path)}
          >
            <Icon
              icon={item.icon}
              color={pathname === item.path ? "#ffffff" : "#6B7280"}
              size={20}
            />
            <Text
              style={[
                styles.navText,
                pathname === item.path && styles.activeNavText,
              ]}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Icon icon="ph:sign-out" color="#EF4444" size={20} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    padding: 16,
    justifyContent: "space-between",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
  },
  navContainer: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeNavItem: {
    backgroundColor: "#4F46E5",
  },
  navText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  activeNavText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  signOutText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
}); 