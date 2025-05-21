import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface GradeEntry {
	id: string;
	subject: string;
	term: string;
	grade: string;
	percentage: number;
	teacher: string;
	assessments: {
		id: string;
		title: string;
		type: string;
		score: string;
		maxScore: number;
		percentage: number;
		date: string;
	}[];
}

export default function GradesScreen() {
	const grades: GradeEntry[] = [
		{
			id: "1",
			subject: "Mathematics",
			term: "Spring 2023",
			grade: "A",
			percentage: 94,
			teacher: "Mr. Johnson",
			assessments: [
				{
					id: "1-1",
					title: "Mid-Term Exam",
					type: "Exam",
					score: "92/100",
					maxScore: 100,
					percentage: 92,
					date: "March 15, 2023",
				},
				{
					id: "1-2",
					title: "Final Exam",
					type: "Exam",
					score: "95/100",
					maxScore: 100,
					percentage: 95,
					date: "May 10, 2023",
				},
				{
					id: "1-3",
					title: "Homework Assignments",
					type: "Homework",
					score: "47/50",
					maxScore: 50,
					percentage: 94,
					date: "Throughout Term",
				},
			],
		},
		{
			id: "2",
			subject: "Science",
			term: "Spring 2023",
			grade: "A-",
			percentage: 90,
			teacher: "Mrs. Garcia",
			assessments: [
				{
					id: "2-1",
					title: "Mid-Term Exam",
					type: "Exam",
					score: "85/100",
					maxScore: 100,
					percentage: 85,
					date: "March 18, 2023",
				},
				{
					id: "2-2",
					title: "Lab Reports",
					type: "Lab Work",
					score: "95/100",
					maxScore: 100,
					percentage: 95,
					date: "Throughout Term",
				},
				{
					id: "2-3",
					title: "Final Project",
					type: "Project",
					score: "92/100",
					maxScore: 100,
					percentage: 92,
					date: "May 5, 2023",
				},
			],
		},
		{
			id: "3",
			subject: "History",
			term: "Spring 2023",
			grade: "B+",
			percentage: 88,
			teacher: "Mr. Smith",
			assessments: [
				{
					id: "3-1",
					title: "Research Paper",
					type: "Assignment",
					score: "88/100",
					maxScore: 100,
					percentage: 88,
					date: "April 10, 2023",
				},
				{
					id: "3-2",
					title: "Mid-Term Exam",
					type: "Exam",
					score: "85/100",
					maxScore: 100,
					percentage: 85,
					date: "March 20, 2023",
				},
				{
					id: "3-3",
					title: "Class Participation",
					type: "Participation",
					score: "92/100",
					maxScore: 100,
					percentage: 92,
					date: "Throughout Term",
				},
			],
		},
		{
			id: "4",
			subject: "English",
			term: "Spring 2023",
			grade: "A",
			percentage: 92,
			teacher: "Ms. Williams",
			assessments: [
				{
					id: "4-1",
					title: "Essay",
					type: "Assignment",
					score: "92/100",
					maxScore: 100,
					percentage: 92,
					date: "April 5, 2023",
				},
				{
					id: "4-2",
					title: "Book Analysis",
					type: "Project",
					score: "94/100",
					maxScore: 100,
					percentage: 94,
					date: "May 1, 2023",
				},
				{
					id: "4-3",
					title: "Vocabulary Quiz",
					type: "Quiz",
					score: "90/100",
					maxScore: 100,
					percentage: 90,
					date: "March 25, 2023",
				},
			],
		},
	];

	const getGradeColor = (grade: string) => {
		const firstChar = grade.charAt(0);
		switch (firstChar) {
			case "A":
				return "#10B981"; // Green
			case "B":
				return "#3B82F6"; // Blue
			case "C":
				return "#F59E0B"; // Amber
			case "D":
				return "#F97316"; // Orange
			case "F":
				return "#EF4444"; // Red
			default:
				return "#6B7280"; // Gray
		}
	};

	const getAssessmentTypeIcon = (type: string) => {
		switch (type) {
			case "Exam":
				return "ph:exam";
			case "Quiz":
				return "ph:check";
			case "Assignment":
				return "ph:book-open";
			case "Project":
				return "ph:folder";
			case "Homework":
				return "ph:pencil";
			case "Lab Work":
				return "ph:beaker";
			case "Participation":
				return "ph:users";
			default:
				return "ph:clipboard-text";
		}
	};

	const calculateOverallGPA = () => {
		const gradePoints = {
			"A+": 4.3,
			A: 4.0,
			"A-": 3.7,
			"B+": 3.3,
			B: 3.0,
			"B-": 2.7,
			"C+": 2.3,
			C: 2.0,
			"C-": 1.7,
			"D+": 1.3,
			D: 1.0,
			"D-": 0.7,
			F: 0.0,
		};

		const totalPoints = grades.reduce((sum, grade) => {
			return sum + (gradePoints[grade.grade as keyof typeof gradePoints] || 0);
		}, 0);

		return (totalPoints / grades.length).toFixed(2);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<H1>Academic Performance</H1>
				<Muted>View your grades and assessments</Muted>
			</View>

			<Card style={styles.summaryCard}>
				<View style={styles.summaryContent}>
					<View style={styles.summaryItem}>
						<H2 style={styles.summaryValue}>{calculateOverallGPA()}</H2>
						<Muted>GPA</Muted>
					</View>

					<View style={styles.summaryItem}>
						<H2 style={styles.summaryValue}>{grades.length}</H2>
						<Muted>Courses</Muted>
					</View>

					<View style={styles.summaryItem}>
						<H2 style={styles.summaryValue}>
							{Math.round(
								grades.reduce((sum, grade) => sum + grade.percentage, 0) /
									grades.length,
							)}
							%
						</H2>
						<Muted>Average</Muted>
					</View>
				</View>
			</Card>

			<H2 style={styles.sectionTitle}>Course Grades</H2>

			{grades.map((grade) => (
				<Card key={grade.id} style={styles.gradeCard}>
					<View style={styles.gradeHeader}>
						<View>
							<H3 style={styles.subjectTitle}>{grade.subject}</H3>
							<Muted>
								{grade.term} • {grade.teacher}
							</Muted>
						</View>

						<View
							style={[
								styles.gradeBadge,
								{ backgroundColor: getGradeColor(grade.grade) },
							]}
						>
							<P style={styles.gradeText}>{grade.grade}</P>
						</View>
					</View>

					<View style={styles.progressBarContainer}>
						<View
							style={[
								styles.progressBar,
								{
									width: `${grade.percentage}%`,
									backgroundColor: getGradeColor(grade.grade),
								},
							]}
						/>
						<P style={styles.percentageText}>{grade.percentage}%</P>
					</View>

					<View style={styles.assessmentsList}>
						<H3 style={styles.assessmentsTitle}>Assessments</H3>

						{grade.assessments.map((assessment) => (
							<View key={assessment.id} style={styles.assessmentItem}>
								<View style={styles.assessmentIconContainer}>
									<View
										style={[
											styles.assessmentIcon,
											{ backgroundColor: getGradeColor(grade.grade) + "20" },
										]}
									>
										<Icon
											icon={getAssessmentTypeIcon(assessment.type)}
											size={18}
											color={getGradeColor(grade.grade)}
										/>
									</View>
								</View>

								<View style={styles.assessmentDetails}>
									<View style={styles.assessmentHeader}>
										<View>
											<H3 style={styles.assessmentTitle}>{assessment.title}</H3>
											<Muted style={styles.assessmentMeta}>
												{assessment.type} • {assessment.date}
											</Muted>
										</View>
										<P style={styles.assessmentScore}>{assessment.score}</P>
									</View>

									<View style={styles.assessmentProgressContainer}>
										<View
											style={[
												styles.assessmentProgress,
												{
													width: `${assessment.percentage}%`,
													backgroundColor: getGradeColor(grade.grade),
												},
											]}
										/>
									</View>
								</View>
							</View>
						))}
					</View>
				</Card>
			))}
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
	summaryCard: {
		margin: 16,
		padding: 16,
	},
	summaryContent: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	summaryItem: {
		alignItems: "center",
	},
	summaryValue: {
		color: "#4F46E5",
		fontSize: 28,
		marginBottom: 4,
	},
	sectionTitle: {
		marginHorizontal: 16,
		marginTop: 16,
		marginBottom: 8,
	},
	gradeCard: {
		margin: 16,
		marginTop: 8,
		padding: 16,
	},
	gradeHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	subjectTitle: {
		fontSize: 18,
		marginBottom: 4,
	},
	gradeBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	gradeText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
	progressBarContainer: {
		height: 8,
		backgroundColor: "#E5E7EB",
		borderRadius: 4,
		marginBottom: 8,
		position: "relative",
	},
	progressBar: {
		height: 8,
		borderRadius: 4,
	},
	percentageText: {
		position: "absolute",
		right: 0,
		top: 12,
		fontSize: 12,
		color: "#6B7280",
	},
	assessmentsList: {
		marginTop: 24,
	},
	assessmentsTitle: {
		fontSize: 16,
		marginBottom: 16,
	},
	assessmentItem: {
		flexDirection: "row",
		marginBottom: 16,
	},
	assessmentIconContainer: {
		marginRight: 12,
	},
	assessmentIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	assessmentDetails: {
		flex: 1,
	},
	assessmentHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	assessmentTitle: {
		fontSize: 14,
		marginBottom: 2,
	},
	assessmentMeta: {
		fontSize: 12,
	},
	assessmentScore: {
		fontWeight: "600",
	},
	assessmentProgressContainer: {
		height: 4,
		backgroundColor: "#E5E7EB",
		borderRadius: 2,
	},
	assessmentProgress: {
		height: 4,
		borderRadius: 2,
	},
});
