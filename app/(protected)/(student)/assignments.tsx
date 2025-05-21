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

interface Assignment {
	id: string;
	title: string;
	subject: string;
	dueDate: string;
	status: "pending" | "submitted" | "graded";
	description: string;
	grade?: string;
}

export default function AssignmentsScreen() {
	const [assignments, setAssignments] = useState<Assignment[]>([
		{
			id: "1",
			title: "Mathematics Homework",
			subject: "Mathematics",
			dueDate: "Tomorrow, 3:00 PM",
			status: "pending",
			description: "Complete problems 1-10 from Chapter 5",
		},
		{
			id: "2",
			title: "Science Lab Report",
			subject: "Science",
			dueDate: "Friday, 11:59 PM",
			status: "pending",
			description: "Write a report on the photosynthesis experiment",
		},
		{
			id: "3",
			title: "History Essay",
			subject: "History",
			dueDate: "Next Monday, 9:00 AM",
			status: "submitted",
			description: "Write a 500-word essay on World War II",
		},
		{
			id: "4",
			title: "English Book Review",
			subject: "English",
			dueDate: "Last Week",
			status: "graded",
			description: "Write a review of 'To Kill a Mockingbird'",
			grade: "A",
		},
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "submitted" | "graded"
	>("all");

	const filteredAssignments = assignments.filter((assignment) => {
		const matchesSearch =
			assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || assignment.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status: Assignment["status"]) => {
		switch (status) {
			case "pending":
				return "#F59E0B"; // Amber
			case "submitted":
				return "#3B82F6"; // Blue
			case "graded":
				return "#10B981"; // Green
			default:
				return "#6B7280"; // Gray
		}
	};

	const getStatusText = (status: Assignment["status"]) => {
		switch (status) {
			case "pending":
				return "Pending";
			case "submitted":
				return "Submitted";
			case "graded":
				return "Graded";
			default:
				return status;
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<H1>Assignments</H1>
				<Muted>View and manage your assignments</Muted>
			</View>

			<View style={styles.searchAndFilter}>
				<View style={styles.searchContainer}>
					<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search assignments..."
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
							statusFilter === "pending" && styles.activeFilter,
							statusFilter === "pending" && {
								backgroundColor: getStatusColor("pending") + "20",
							},
						]}
						onPress={() => setStatusFilter("pending")}
					>
						<P
							style={[
								styles.filterText,
								statusFilter === "pending" && {
									color: getStatusColor("pending"),
								},
							]}
						>
							Pending
						</P>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.filterButton,
							statusFilter === "submitted" && styles.activeFilter,
							statusFilter === "submitted" && {
								backgroundColor: getStatusColor("submitted") + "20",
							},
						]}
						onPress={() => setStatusFilter("submitted")}
					>
						<P
							style={[
								styles.filterText,
								statusFilter === "submitted" && {
									color: getStatusColor("submitted"),
								},
							]}
						>
							Submitted
						</P>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.filterButton,
							statusFilter === "graded" && styles.activeFilter,
							statusFilter === "graded" && {
								backgroundColor: getStatusColor("graded") + "20",
							},
						]}
						onPress={() => setStatusFilter("graded")}
					>
						<P
							style={[
								styles.filterText,
								statusFilter === "graded" && {
									color: getStatusColor("graded"),
								},
							]}
						>
							Graded
						</P>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.assignmentsContainer}>
				{filteredAssignments.map((assignment) => (
					<Card key={assignment.id} style={styles.assignmentCard}>
						<View style={styles.assignmentHeader}>
							<View>
								<H3 style={styles.assignmentTitle}>{assignment.title}</H3>
								<P style={styles.assignmentSubject}>{assignment.subject}</P>
							</View>
							<View
								style={[
									styles.statusBadge,
									{ backgroundColor: getStatusColor(assignment.status) + "20" },
								]}
							>
								<P
									style={[
										styles.statusText,
										{ color: getStatusColor(assignment.status) },
									]}
								>
									{getStatusText(assignment.status)}
								</P>

								{assignment.status === "graded" && assignment.grade && (
									<View style={styles.gradeBadge}>
										<P style={styles.gradeText}>{assignment.grade}</P>
									</View>
								)}
							</View>
						</View>

						<P style={styles.assignmentDescription}>{assignment.description}</P>

						<View style={styles.assignmentFooter}>
							<View style={styles.dueDate}>
								<Icon icon="ph:clock" size={16} color="#6B7280" />
								<P style={styles.dueDateText}>Due: {assignment.dueDate}</P>
							</View>

							{assignment.status === "pending" && (
								<TouchableOpacity style={styles.submitButton}>
									<P style={styles.submitButtonText}>Submit</P>
								</TouchableOpacity>
							)}

							{assignment.status === "submitted" && (
								<View style={styles.submittedStatus}>
									<Icon icon="ph:check-circle" size={16} color="#3B82F6" />
									<P style={styles.submittedText}>Submitted</P>
								</View>
							)}
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
	assignmentsContainer: {
		padding: 16,
		paddingTop: 0,
	},
	assignmentCard: {
		padding: 16,
		marginBottom: 16,
	},
	assignmentHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	assignmentTitle: {
		fontSize: 18,
		marginBottom: 4,
	},
	assignmentSubject: {
		color: "#6B7280",
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 16,
		backgroundColor: "#F3F4F6",
	},
	statusText: {
		fontSize: 14,
		fontWeight: "500",
	},
	gradeBadge: {
		marginLeft: 6,
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "#10B981",
		alignItems: "center",
		justifyContent: "center",
	},
	gradeText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	assignmentDescription: {
		marginBottom: 16,
	},
	assignmentFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	dueDate: {
		flexDirection: "row",
		alignItems: "center",
	},
	dueDateText: {
		marginLeft: 6,
		color: "#6B7280",
		fontSize: 14,
	},
	submitButton: {
		backgroundColor: "#4F46E5",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
	},
	submitButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "500",
	},
	submittedStatus: {
		flexDirection: "row",
		alignItems: "center",
	},
	submittedText: {
		marginLeft: 6,
		color: "#3B82F6",
		fontSize: 14,
	},
});
