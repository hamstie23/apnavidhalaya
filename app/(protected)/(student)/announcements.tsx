import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface Announcement {
	id: string;
	title: string;
	body: string;
	date: string;
	author: string;
	category: "general" | "academic" | "event" | "important";
	isNew: boolean;
	isExpanded?: boolean;
}

export default function AnnouncementsScreen() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([
		{
			id: "1",
			title: "End of Term Exams Schedule",
			body: "Please note that end of term examinations will begin on June 15th. The detailed schedule has been posted on the school notice board and is available for download in the School Portal. Students are advised to prepare accordingly and reach out to their respective teachers for any clarifications.",
			date: "May 10, 2023",
			author: "Principal Williams",
			category: "academic",
			isNew: true,
		},
		{
			id: "2",
			title: "Annual Sports Day",
			body: "The annual sports day will be held on May 25th at the school grounds. All students are encouraged to participate in various events. Registration for different sports categories will start from tomorrow. Parents are cordially invited to attend and cheer for their children.",
			date: "May 8, 2023",
			author: "Sports Department",
			category: "event",
			isNew: true,
		},
		{
			id: "3",
			title: "School Infrastructure Maintenance",
			body: "Please be informed that the school building will undergo maintenance work from May 20th to May 22nd. During this period, some areas might have restricted access. However, classes will continue as scheduled. We apologize for any inconvenience this might cause.",
			date: "May 5, 2023",
			author: "Administration",
			category: "general",
			isNew: false,
		},
		{
			id: "4",
			title: "Fee Payment Reminder",
			body: "This is a reminder that the last date for payment of fees for the current term is May 15th. Late payment will attract a penalty. Parents are requested to clear all dues before the deadline.",
			date: "May 2, 2023",
			author: "Accounts Department",
			category: "important",
			isNew: false,
		},
		{
			id: "5",
			title: "Career Counseling Session",
			body: "A career counseling session for students of grade 10 and above will be held on May 12th in the school auditorium. Representatives from various universities will be present to guide students regarding higher education opportunities. Attendance is mandatory for senior students.",
			date: "April 28, 2023",
			author: "Guidance Counselor",
			category: "academic",
			isNew: false,
		},
	]);

	const [filter, setFilter] = useState<
		"all" | "general" | "academic" | "event" | "important"
	>("all");

	const toggleExpand = (id: string) => {
		setAnnouncements((prev) =>
			prev.map((announcement) =>
				announcement.id === id
					? {
							...announcement,
							isExpanded: !announcement.isExpanded,
							isNew: false,
						}
					: announcement,
			),
		);
	};

	const getCategoryColor = (category: Announcement["category"]) => {
		switch (category) {
			case "general":
				return "#6B7280"; // Gray
			case "academic":
				return "#3B82F6"; // Blue
			case "event":
				return "#10B981"; // Green
			case "important":
				return "#EF4444"; // Red
			default:
				return "#6B7280"; // Gray
		}
	};

	const getCategoryIcon = (category: Announcement["category"]) => {
		switch (category) {
			case "general":
				return "ph:info";
			case "academic":
				return "ph:book-open";
			case "event":
				return "ph:calendar";
			case "important":
				return "ph:bell";
			default:
				return "ph:info";
		}
	};

	const filteredAnnouncements = announcements.filter(
		(announcement) => filter === "all" || announcement.category === filter,
	);

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<H1>Announcements</H1>
				<Muted>Stay updated with school news and events</Muted>
			</View>

			<View style={styles.filterContainer}>
				<TouchableOpacity
					style={[styles.filterButton, filter === "all" && styles.activeFilter]}
					onPress={() => setFilter("all")}
				>
					<Icon
						icon="ph:list"
						size={18}
						color={filter === "all" ? "#4F46E5" : "#6B7280"}
					/>
					<P
						style={[
							styles.filterText,
							filter === "all" && styles.activeFilterText,
						]}
					>
						All
					</P>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.filterButton,
						filter === "academic" && styles.activeFilter,
						filter === "academic" && {
							backgroundColor: getCategoryColor("academic") + "15",
						},
					]}
					onPress={() => setFilter("academic")}
				>
					<Icon
						icon={getCategoryIcon("academic")}
						size={18}
						color={
							filter === "academic" ? getCategoryColor("academic") : "#6B7280"
						}
					/>
					<P
						style={[
							styles.filterText,
							filter === "academic" && { color: getCategoryColor("academic") },
						]}
					>
						Academic
					</P>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.filterButton,
						filter === "event" && styles.activeFilter,
						filter === "event" && {
							backgroundColor: getCategoryColor("event") + "15",
						},
					]}
					onPress={() => setFilter("event")}
				>
					<Icon
						icon={getCategoryIcon("event")}
						size={18}
						color={filter === "event" ? getCategoryColor("event") : "#6B7280"}
					/>
					<P
						style={[
							styles.filterText,
							filter === "event" && { color: getCategoryColor("event") },
						]}
					>
						Events
					</P>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.filterButton,
						filter === "important" && styles.activeFilter,
						filter === "important" && {
							backgroundColor: getCategoryColor("important") + "15",
						},
					]}
					onPress={() => setFilter("important")}
				>
					<Icon
						icon={getCategoryIcon("important")}
						size={18}
						color={
							filter === "important" ? getCategoryColor("important") : "#6B7280"
						}
					/>
					<P
						style={[
							styles.filterText,
							filter === "important" && {
								color: getCategoryColor("important"),
							},
						]}
					>
						Important
					</P>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.filterButton,
						filter === "general" && styles.activeFilter,
						filter === "general" && {
							backgroundColor: getCategoryColor("general") + "15",
						},
					]}
					onPress={() => setFilter("general")}
				>
					<Icon
						icon={getCategoryIcon("general")}
						size={18}
						color={
							filter === "general" ? getCategoryColor("general") : "#6B7280"
						}
					/>
					<P
						style={[
							styles.filterText,
							filter === "general" && { color: getCategoryColor("general") },
						]}
					>
						General
					</P>
				</TouchableOpacity>
			</View>

			<View style={styles.announcementsContainer}>
				{filteredAnnouncements.map((announcement) => (
					<TouchableOpacity
						key={announcement.id}
						style={styles.announcementCard}
						onPress={() => toggleExpand(announcement.id)}
					>
						<Card
							style={[
								styles.announcementCardInner,
								announcement.isNew && styles.newAnnouncementCard,
							]}
						>
							<View style={styles.announcementHeader}>
								<View style={styles.categoryIconContainer}>
									<View
										style={[
											styles.categoryIcon,
											{
												backgroundColor:
													getCategoryColor(announcement.category) + "20",
											},
										]}
									>
										<Icon
											icon={getCategoryIcon(announcement.category)}
											size={20}
											color={getCategoryColor(announcement.category)}
										/>
									</View>
								</View>

								<View style={styles.announcementMeta}>
									<View style={styles.titleContainer}>
										<H3 style={styles.announcementTitle}>
											{announcement.title}
										</H3>
										{announcement.isNew && (
											<View style={styles.newBadge}>
												<P style={styles.newBadgeText}>NEW</P>
											</View>
										)}
									</View>

									<Muted style={styles.announcementInfo}>
										{announcement.date} • {announcement.author}
									</Muted>
								</View>

								<Icon
									icon={
										announcement.isExpanded ? "ph:caret-up" : "ph:caret-down"
									}
									size={20}
									color="#6B7280"
								/>
							</View>

							{announcement.isExpanded && (
								<View style={styles.announcementBody}>
									<P>{announcement.body}</P>
								</View>
							)}
						</Card>
					</TouchableOpacity>
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
	filterContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 16,
		gap: 8,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
		backgroundColor: "#F3F4F6",
	},
	activeFilter: {
		backgroundColor: "#EBF5FF",
	},
	filterText: {
		marginLeft: 6,
		color: "#6B7280",
		fontSize: 14,
	},
	activeFilterText: {
		color: "#4F46E5",
	},
	announcementsContainer: {
		padding: 16,
		paddingTop: 0,
	},
	announcementCard: {
		marginBottom: 12,
	},
	announcementCardInner: {
		padding: 16,
	},
	newAnnouncementCard: {
		borderLeftWidth: 4,
		borderLeftColor: "#4F46E5",
	},
	announcementHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	categoryIconContainer: {
		marginRight: 12,
	},
	categoryIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	announcementMeta: {
		flex: 1,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
	},
	announcementTitle: {
		fontSize: 16,
		marginRight: 8,
	},
	newBadge: {
		backgroundColor: "#4F46E5",
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 4,
	},
	newBadgeText: {
		color: "#FFFFFF",
		fontSize: 10,
		fontWeight: "600",
	},
	announcementInfo: {
		fontSize: 12,
	},
	announcementBody: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
	},
});
