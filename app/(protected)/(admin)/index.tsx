import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";
import { useAuth } from "@/context/supabase-provider";

interface QuickAccessItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const QUICK_ACCESS: QuickAccessItem[] = [
  {
    title: "Manage Users",
    description: "Add, edit, or remove user accounts",
    icon: "ph:users",
    color: "#4F46E5",
    route: "users",
  },
  {
    title: "Announcements",
    description: "Create and manage announcements",
    icon: "ph:bell",
    color: "#0EA5E9",
    route: "announcements",
  },
  {
    title: "Calendar",
    description: "Schedule and manage events",
    icon: "ph:calendar",
    color: "#10B981",
    route: "calendar",
  },
  {
    title: "Group Management",
    description: "Manage classes and user groups",
    icon: "ph:users-three",
    color: "#F59E0B",
    route: "groups",
  },
];

export default function AdminDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalAnnouncements: 0,
    totalGroups: 0,
  });
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch actual data from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // Mock data for now - would be replaced with actual db queries
      setStats({
        totalUsers: 156,
        totalEvents: 12,
        totalAnnouncements: 8,
        totalGroups: 15,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const handleQuickAccess = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <H1>Admin Dashboard</H1>
        <Muted>Welcome back, {session?.user?.email}</Muted>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Icon icon="ph:users" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>{stats.totalUsers}</H2>
          <Muted>Total Users</Muted>
        </Card>

        <Card style={styles.statsCard}>
          <Icon icon="ph:calendar" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>{stats.totalEvents}</H2>
          <Muted>Events This Month</Muted>
        </Card>

        <Card style={styles.statsCard}>
          <Icon icon="ph:bell" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>{stats.totalAnnouncements}</H2>
          <Muted>Announcements</Muted>
        </Card>

        <Card style={styles.statsCard}>
          <Icon icon="ph:users-three" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>{stats.totalGroups}</H2>
          <Muted>Groups</Muted>
        </Card>
      </View>

      <View style={styles.section}>
        <H3 style={styles.sectionTitle}>Quick Access</H3>
        <View style={styles.quickAccessContainer}>
          {QUICK_ACCESS.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.quickAccessCard}
              onPress={() => handleQuickAccess(item.route)}
            >
              <Card style={styles.quickAccessCardInner}>
                <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                  <Icon icon={item.icon} size={24} color={item.color} />
                </View>
                <H3 style={styles.quickAccessTitle}>{item.title}</H3>
                <P style={styles.quickAccessDescription}>{item.description}</P>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <H3 style={styles.sectionTitle}>Recent Activity</H3>
        <Card style={styles.recentActivityCard}>
          <P>No recent activity to display</P>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statsContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statsCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statsNumber: {
    color: "#4F46E5",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
  },
  quickAccessContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  quickAccessCard: {
    width: "50%",
    padding: 8,
  },
  quickAccessCardInner: {
    padding: 16,
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickAccessDescription: {
    color: "#6B7280",
    fontSize: 14,
  },
  recentActivityCard: {
    marginHorizontal: 16,
    padding: 16,
  },
});