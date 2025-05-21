import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import { useState, useEffect } from "react";
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
		title: "Assignments",
		description: "View and submit your assignments",
		icon: "ph:book-open",
		color: "#4F46E5",
		route: "assignments",
	},
	{
		title: "Schedule",
		description: "Check your class timetable",
		icon: "ph:calendar",
		color: "#0EA5E9",
		route: "schedule",
	},
	{
		title: "Grades",
		description: "View your academic performance",
		icon: "ph:chart-line",
		color: "#10B981",
		route: "grades",
	},
	{
		title: "Announcements",
		description: "Important school announcements",
		icon: "ph:bell",
		color: "#F59E0B",
		route: "announcements",
	},
];

export default function StudentDashboard() {
	const { session } = useAuth();
	const [stats, setStats] = useState({
		pendingAssignments: 0,
		upcomingExams: 0,
		attendancePercentage: 0,
		announcementsCount: 0,
	});
	const [loading, setLoading] = useState(true);
	const [upcomingEvents, setUpcomingEvents] = useState([
		{
			id: "1",
			title: "Math Quiz",
			date: "Tomorrow, 10:00 AM",
			type: "exam",
		},
		{
			id: "2",
			title: "Science Project Submission",
			date: "Friday, 3:00 PM",
			type: "assignment",
		},
		{
			id: "3",
			title: "Annual Sports Day",
			date: "Next Monday, 9:00 AM",
			type: "event",
		},
	]);

	// In a real app, this would fetch actual data from Supabase
	useEffect(() => {
		const fetchStats = async () => {
			setLoading(true);
			// Mock data for now - would be replaced with actual db queries
			setStats({
				pendingAssignments: 5,
				upcomingExams: 2,
				attendancePercentage: 92,
				announcementsCount: 3,
			});
			setLoading(false);
		};

		fetchStats();
	}, []);

	const handleQuickAccess = (route: string) => {
		router.push(route as any);
	};

	const getEventTypeIcon = (type: string) => {
		switch (type) {
			case "exam":
				return "ph:exam";
			case "assignment":
				return "ph:book-open";
			case "event":
				return "ph:calendar";
			default:
				return "ph:calendar";
		}
	};

	const getEventTypeColor = (type: string) => {
		switch (type) {
			case "exam":
				return "#EF4444";
			case "assignment":
				return "#4F46E5";
			case "event":
				return "#10B981";
			default:
				return "#6B7280";
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<H1>Student Dashboard</H1>
				<Muted>Welcome back, {session?.user?.email}</Muted>
			</View>

			<View style={styles.statsContainer}>
				<Card style={styles.statsCard}>
					<Icon icon="ph:book-open" size={24} color="#4F46E5" />
					<H2 style={styles.statsNumber}>{stats.pendingAssignments}</H2>
					<Muted>Pending Assignments</Muted>
				</Card>

				<Card style={styles.statsCard}>
					<Icon icon="ph:exam" size={24} color="#EF4444" />
					<H2 style={styles.statsNumber}>{stats.upcomingExams}</H2>
					<Muted>Upcoming Exams</Muted>
				</Card>

				<Card style={styles.statsCard}>
					<Icon icon="ph:chart-bar" size={24} color="#10B981" />
					<H2 style={styles.statsNumber}>{stats.attendancePercentage}%</H2>
					<Muted>Attendance</Muted>
				</Card>

				<Card style={styles.statsCard}>
					<Icon icon="ph:bell" size={24} color="#F59E0B" />
					<H2 style={styles.statsNumber}>{stats.announcementsCount}</H2>
					<Muted>New Announcements</Muted>
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
								<View
									style={[
										styles.iconCircle,
										{ backgroundColor: item.color + "15" },
									]}
								>
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
				<H3 style={styles.sectionTitle}>Upcoming Events</H3>
				{upcomingEvents.map((event) => (
					<Card key={event.id} style={styles.eventCard}>
						<View style={styles.eventIconContainer}>
							<View
								style={[
									styles.eventIcon,
									{ backgroundColor: getEventTypeColor(event.type) + "15" },
								]}
							>
								<Icon
									icon={getEventTypeIcon(event.type)}
									size={24}
									color={getEventTypeColor(event.type)}
								/>
							</View>
						</View>
						<View style={styles.eventDetails}>
							<H3 style={styles.eventTitle}>{event.title}</H3>
							<Muted>{event.date}</Muted>
						</View>
					</Card>
				))}
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
	eventCard: {
		marginHorizontal: 16,
		marginBottom: 12,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	eventIconContainer: {
		marginRight: 16,
	},
	eventIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	eventDetails: {
		flex: 1,
	},
	eventTitle: {
		fontSize: 16,
		marginBottom: 4,
	},
});
