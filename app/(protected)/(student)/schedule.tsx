import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

const DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const TIME_SLOTS = [
	"8:00 - 9:00",
	"9:00 - 10:00",
	"10:00 - 11:00",
	"11:00 - 12:00",
	"12:00 - 1:00",
	"1:00 - 2:00",
	"2:00 - 3:00",
	"3:00 - 4:00",
];

interface ScheduleItem {
	id: string;
	subject: string;
	teacher: string;
	room: string;
	timeSlot: string;
	day: string;
	color: string;
}

export default function ScheduleScreen() {
	const [selectedDay, setSelectedDay] = useState("Monday");

	const [schedule, setSchedule] = useState<ScheduleItem[]>([
		{
			id: "1",
			subject: "Mathematics",
			teacher: "Mr. Johnson",
			room: "Room 101",
			timeSlot: "8:00 - 9:00",
			day: "Monday",
			color: "#4F46E5",
		},
		{
			id: "2",
			subject: "Science",
			teacher: "Mrs. Garcia",
			room: "Lab 201",
			timeSlot: "9:00 - 10:00",
			day: "Monday",
			color: "#10B981",
		},
		{
			id: "3",
			subject: "History",
			teacher: "Mr. Smith",
			room: "Room 105",
			timeSlot: "11:00 - 12:00",
			day: "Monday",
			color: "#F59E0B",
		},
		{
			id: "4",
			subject: "English",
			teacher: "Ms. Williams",
			room: "Room 102",
			timeSlot: "1:00 - 2:00",
			day: "Monday",
			color: "#EF4444",
		},
		{
			id: "5",
			subject: "Physical Education",
			teacher: "Mr. Davis",
			room: "Gym",
			timeSlot: "3:00 - 4:00",
			day: "Monday",
			color: "#8B5CF6",
		},
		{
			id: "6",
			subject: "Computer Science",
			teacher: "Mrs. Martinez",
			room: "Computer Lab",
			timeSlot: "9:00 - 10:00",
			day: "Tuesday",
			color: "#0EA5E9",
		},
		{
			id: "7",
			subject: "Art",
			teacher: "Ms. Thompson",
			room: "Art Studio",
			timeSlot: "1:00 - 2:00",
			day: "Tuesday",
			color: "#EC4899",
		},
	]);

	const filteredSchedule = schedule.filter((item) => item.day === selectedDay);

	const getScheduleForTimeSlot = (timeSlot: string) => {
		return filteredSchedule.find((item) => item.timeSlot === timeSlot);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<H1>Class Schedule</H1>
				<Muted>Your weekly timetable</Muted>
			</View>

			<View style={styles.daySelector}>
				{DAYS.map((day) => (
					<TouchableOpacity
						key={day}
						style={[
							styles.dayButton,
							selectedDay === day && styles.selectedDayButton,
						]}
						onPress={() => setSelectedDay(day)}
					>
						<P
							style={[
								styles.dayButtonText,
								selectedDay === day && styles.selectedDayButtonText,
							]}
						>
							{day}
						</P>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.schedule}>
				<H2 style={styles.dayHeading}>{selectedDay}</H2>

				{TIME_SLOTS.map((timeSlot) => {
					const scheduleItem = getScheduleForTimeSlot(timeSlot);

					return (
						<View key={timeSlot} style={styles.timeSlotContainer}>
							<View style={styles.timeColumn}>
								<P style={styles.timeText}>{timeSlot}</P>
							</View>

							{scheduleItem ? (
								<Card
									style={[
										styles.classCard,
										{ borderLeftColor: scheduleItem.color, borderLeftWidth: 4 },
									]}
								>
									<H3 style={styles.subjectName}>{scheduleItem.subject}</H3>
									<View style={styles.classDetails}>
										<View style={styles.detailItem}>
											<Icon icon="ph:user" size={16} color="#6B7280" />
											<P style={styles.detailText}>{scheduleItem.teacher}</P>
										</View>
										<View style={styles.detailItem}>
											<Icon icon="ph:map-pin" size={16} color="#6B7280" />
											<P style={styles.detailText}>{scheduleItem.room}</P>
										</View>
									</View>
								</Card>
							) : (
								<Card style={styles.emptySlotCard}>
									<P style={styles.emptySlotText}>Free Period</P>
								</Card>
							)}
						</View>
					);
				})}
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
	daySelector: {
		flexDirection: "row",
		padding: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		justifyContent: "space-between",
	},
	dayButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		backgroundColor: "#F3F4F6",
	},
	selectedDayButton: {
		backgroundColor: "#4F46E5",
	},
	dayButtonText: {
		color: "#6B7280",
		fontWeight: "500",
	},
	selectedDayButtonText: {
		color: "#FFFFFF",
	},
	schedule: {
		padding: 16,
	},
	dayHeading: {
		marginBottom: 16,
	},
	timeSlotContainer: {
		flexDirection: "row",
		marginBottom: 16,
	},
	timeColumn: {
		width: 100,
		justifyContent: "center",
	},
	timeText: {
		color: "#6B7280",
		fontWeight: "500",
	},
	classCard: {
		flex: 1,
		padding: 16,
		marginLeft: 16,
	},
	subjectName: {
		fontSize: 18,
		marginBottom: 8,
	},
	classDetails: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	detailItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	detailText: {
		marginLeft: 6,
		color: "#6B7280",
	},
	emptySlotCard: {
		flex: 1,
		padding: 16,
		marginLeft: 16,
		backgroundColor: "#F9FAFB",
		borderStyle: "dashed",
		borderWidth: 1,
		borderColor: "#D1D5DB",
		justifyContent: "center",
		alignItems: "center",
	},
	emptySlotText: {
		color: "#9CA3AF",
		fontStyle: "italic",
	},
});
