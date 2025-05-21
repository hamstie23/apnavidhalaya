import { View, StyleSheet, ScrollView } from "react-native";
import { H1, H2, Muted } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <H1>Admin Dashboard</H1>
        <Muted>Welcome to Apna Vidhayalaya School Management</Muted>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Icon icon="ph:users" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>156</H2>
          <Muted>Total Users</Muted>
        </Card>

        <Card style={styles.statsCard}>
          <Icon icon="ph:calendar" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>12</H2>
          <Muted>Events This Month</Muted>
        </Card>

        <Card style={styles.statsCard}>
          <Icon icon="ph:bell" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>8</H2>
          <Muted>New Announcements</Muted>
        </Card>

        <Card style={styles.statsCard}>
          <Icon icon="ph:chat-circle" size={24} color="#4F46E5" />
          <H2 style={styles.statsNumber}>45</H2>
          <Muted>Active Chats</Muted>
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
});