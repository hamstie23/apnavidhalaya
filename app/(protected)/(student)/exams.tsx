import React, { useState } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface Exam {
	id: string;
	subject: string;
	date: string;
	time: string;
	location: string;
	type: string;
	status: "upcoming" | "completed";
	grade?: string;
}

export default function ExamsScreen() {
	const [exams, setExams] = useState<Exam[]>([
		{
			id: "1",
			subject: "Mathematics",
			date: "May 15, 2023",
			time: "9:00 AM - 11:00 AM",
			location: "Room 101",
			type: "Mid-Term",
			status: "upcoming",
		},
		{
			id: "2",
			subject: "Science",
			date: "May 18, 2023",
			time: "1:00 PM - 3:00 PM",
			location: "Lab 201",
			type: "Quiz",
			status: "upcoming",
		},
		{
			id: "3",
			subject: "History",
			date: "May 22, 2023",
			time: "10:00 AM - 12:00 PM",
			location: "Room 105",
			type: "Final",
			status: "upcoming",
		},
		{
			id: "4",
			subject: "English",
			date: "April 28, 2023",
			time: "9:00 AM - 11:00 AM",
			location: "Room 102",
			type: "Mid-Term",
			status: "completed",
			grade: "A-",
		},
		{
			id: "5",
			subject: "Computer Science",
			date: "April 25, 2023",
			time: "2:00 PM - 4:00 PM",
			location: "Computer Lab",
			type: "Practical",
			status: "completed",
			grade: "A",
		},
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "upcoming" | "completed"
	>("all");

	const filteredExams = exams.filter((exam) => {
		const matchesSearch =
			exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			exam.type.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || exam.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status: Exam["status"]) => {
		switch (status) {
			case "upcoming":
				return "#3B82F6"; // Blue
			case "completed":
				return "#10B981"; // Green
			default:
				return "#6B7280"; // Gray
		}
	};

	const getExamTypeColor = (type: string) => {
		switch (type) {
			case "Mid-Term":
				return "#F59E0B"; // Amber
			case "Final":
				return "#EF4444"; // Red
			case "Quiz":
				return "#8B5CF6"; // Purple
			case "Practical":
				return "#0EA5E9"; // Light Blue
			default:
				return "#6B7280"; // Gray
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<H1>Exams</H1>
				<Muted>View your upcoming and past exams</Muted>
			</View>

			<View style={styles.searchAndFilter}>
				<View style={styles.searchContainer}>
					<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search exams..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				<View style={styles.filters}>
					<TouchableOpacity
						style={[
							styles.filterButton,
							statusFilter === "all" && styles.activeFilter,
						]}
						onPress={() => setStatusFilter("all")}
					>
						<P
							style={[
								styles.filterText,
								statusFilter === "all" && styles.activeFilterText,
							]}
						>
							All
						</P>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.filterButton,
							statusFilter === "upcoming" && styles.activeFilter,
							statusFilter === "upcoming" && {
								backgroundColor: getStatusColor("upcoming") + "20",
							},
						]}
						onPress={() => setStatusFilter("upcoming")}
					>
						<P
							style={[
								styles.filterText,
								statusFilter === "upcoming" && {
									color: getStatusColor("upcoming"),
								},
							]}
						>
							Upcoming
						</P>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.filterButton,
							statusFilter === "completed" && styles.activeFilter,
							statusFilter === "completed" && {
								backgroundColor: getStatusColor("completed") + "20",
							},
						]}
						onPress={() => setStatusFilter("completed")}
					>
						<P
							style={[
								styles.filterText,
								statusFilter === "completed" && {
									color: getStatusColor("completed"),
								},
							]}
						>
							Completed
						</P>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.examsContainer}>
				{filteredExams.map((exam) => (
					<Card key={exam.id} style={styles.examCard}>
						<View style={styles.examHeader}>
							<View>
								<View style={styles.subjectContainer}>
									<H3 style={styles.examSubject}>{exam.subject}</H3>
									<View
										style={[
											styles.examTypeBadge,
											{ backgroundColor: getExamTypeColor(exam.type) + "20" },
										]}
									>
										<P
											style={[
												styles.examTypeText,
												{ color: getExamTypeColor(exam.type) },
											]}
										>
											{exam.type}
										</P>
									</View>
								</View>

								<View style={styles.examMetadata}>
									<View style={styles.metadataItem}>
										<Icon icon="ph:calendar" size={16} color="#6B7280" />
										<P style={styles.metadataText}>{exam.date}</P>
									</View>

									<View style={styles.metadataItem}>
										<Icon icon="ph:clock" size={16} color="#6B7280" />
										<P style={styles.metadataText}>{exam.time}</P>
									</View>

									<View style={styles.metadataItem}>
										<Icon icon="ph:map-pin" size={16} color="#6B7280" />
										<P style={styles.metadataText}>{exam.location}</P>
									</View>
								</View>
							</View>

							<View style={styles.examStatusContainer}>
								<View
									style={[
										styles.statusBadge,
										{ backgroundColor: getStatusColor(exam.status) + "20" },
									]}
								>
									<P
										style={[
											styles.statusText,
											{ color: getStatusColor(exam.status) },
										]}
									>
										{exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
									</P>
								</View>

								{exam.status === "completed" && exam.grade && (
									<View style={styles.gradeContainer}>
										<P style={styles.gradeLabel}>Grade:</P>
										<View style={styles.gradeBadge}>
											<P style={styles.gradeText}>{exam.grade}</P>
										</View>
									</View>
								)}
							</View>
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
	searchAndFilter: {
		padding: 16,
	},
	searchContainer: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		alignItems: "center",
		marginBottom: 16,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
	},
	filters: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	filterButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 16,
		backgroundColor: "#F3F4F6",
	},
	activeFilter: {
		backgroundColor: "#EBF5FF",
	},
	filterText: {
		color: "#6B7280",
		fontSize: 14,
	},
	activeFilterText: {
		color: "#3B82F6",
	},
	examsContainer: {
		padding: 16,
		paddingTop: 0,
	},
	examCard: {
		padding: 16,
		marginBottom: 16,
	},
	examHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	subjectContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	examSubject: {
		fontSize: 18,
		marginRight: 8,
	},
	examTypeBadge: {
		paddingVertical: 2,
		paddingHorizontal: 8,
		borderRadius: 12,
	},
	examTypeText: {
		fontSize: 12,
		fontWeight: "500",
	},
	examMetadata: {
		gap: 8,
	},
	metadataItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	metadataText: {
		marginLeft: 8,
		color: "#6B7280",
		fontSize: 14,
	},
	examStatusContainer: {
		alignItems: "flex-end",
	},
	statusBadge: {
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 16,
		marginBottom: 8,
	},
	statusText: {
		fontSize: 14,
		fontWeight: "500",
	},
	gradeContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	gradeLabel: {
		color: "#6B7280",
		marginRight: 8,
	},
	gradeBadge: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#10B981",
		alignItems: "center",
		justifyContent: "center",
	},
	gradeText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
});
