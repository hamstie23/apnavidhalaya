import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
	Modal,
	Text,
	Alert,
} from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { supabase } from "@/config/supabase";

interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	startTime: string;
	endTime: string;
	location: string;
	type: "academic" | "sports" | "cultural" | "holiday" | "exam" | "other";
	visibleTo: ("admin" | "teacher" | "parent" | "student")[];
	createdAt: string;
	createdBy: string;
}

export default function CalendarManagement() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [selectedEventType, setSelectedEventType] = useState<string | "all">(
		"all",
	);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		date: new Date().toISOString().split("T")[0],
		startTime: "09:00",
		endTime: "10:00",
		location: "",
		type: "academic" as Event["type"],
		visibleTo: ["admin", "teacher", "parent", "student"] as (
			| "admin"
			| "teacher"
			| "parent"
			| "student"
		)[],
	});

	// Mock data for demonstration
	const mockEvents: Event[] = [
		{
			id: "1",
			title: "Annual Sports Day",
			description:
				"Annual sports day for all students. Parents are invited to attend and cheer for their children.",
			date: "2023-06-15",
			startTime: "09:00",
			endTime: "16:00",
			location: "School Sports Ground",
			type: "sports",
			visibleTo: ["admin", "teacher", "parent", "student"],
			createdAt: "2023-05-10",
			createdBy: "Admin User",
		},
		{
			id: "2",
			title: "Teachers' Meeting",
			description:
				"Monthly teachers' meeting to discuss academic progress and upcoming events.",
			date: "2023-06-05",
			startTime: "14:00",
			endTime: "16:00",
			location: "Staff Room",
			type: "academic",
			visibleTo: ["admin", "teacher"],
			createdAt: "2023-05-15",
			createdBy: "Admin User",
		},
		{
			id: "3",
			title: "Final Exams",
			description:
				"Final examinations for all classes. Students should check the detailed schedule.",
			date: "2023-06-20",
			startTime: "09:00",
			endTime: "12:00",
			location: "All Classrooms",
			type: "exam",
			visibleTo: ["admin", "teacher", "parent", "student"],
			createdAt: "2023-05-18",
			createdBy: "Admin User",
		},
		{
			id: "4",
			title: "Cultural Program",
			description:
				"Annual cultural program featuring performances by students.",
			date: "2023-06-25",
			startTime: "17:00",
			endTime: "20:00",
			location: "School Auditorium",
			type: "cultural",
			visibleTo: ["admin", "teacher", "parent", "student"],
			createdAt: "2023-05-20",
			createdBy: "Admin User",
		},
		{
			id: "5",
			title: "Summer Holiday",
			description: "Beginning of summer holidays. School will remain closed.",
			date: "2023-06-30",
			startTime: "00:00",
			endTime: "23:59",
			location: "School",
			type: "holiday",
			visibleTo: ["admin", "teacher", "parent", "student"],
			createdAt: "2023-05-25",
			createdBy: "Admin User",
		},
	];

	// In a real app, this would fetch events from Supabase
	useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true);
			// In a real implementation, fetch from Supabase
			// const { data, error } = await supabase.from('events').select('*');

			// Using mock data for now
			setEvents(mockEvents);
			setLoading(false);
		};

		fetchEvents();
	}, []);

	const daysInMonth = (month: number, year: number) => {
		return new Date(year, month, 0).getDate();
	};

	const getFirstDayOfMonth = (month: number, year: number) => {
		return new Date(year, month - 1, 1).getDay();
	};

	// Filter events based on search, month, year, and type
	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date);
		const matchesMonth = eventDate.getMonth() + 1 === selectedMonth;
		const matchesYear = eventDate.getFullYear() === selectedYear;
		const matchesSearch =
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType =
			selectedEventType === "all" || event.type === selectedEventType;

		return matchesMonth && matchesYear && matchesSearch && matchesType;
	});

	const handleSaveEvent = () => {
		if (!newEvent.title || !newEvent.date) {
			Alert.alert("Error", "Title and date are required");
			return;
		}

		if (editingId) {
			// Update existing event
			const updatedEvents = events.map((item) => {
				if (item.id === editingId) {
					return {
						...item,
						title: newEvent.title,
						description: newEvent.description,
						date: newEvent.date,
						startTime: newEvent.startTime,
						endTime: newEvent.endTime,
						location: newEvent.location,
						type: newEvent.type,
						visibleTo: newEvent.visibleTo,
					};
				}
				return item;
			});
			setEvents(updatedEvents);
		} else {
			// Add new event
			const newId = (events.length + 1).toString();
			const newEventItem: Event = {
				id: newId,
				title: newEvent.title,
				description: newEvent.description,
				date: newEvent.date,
				startTime: newEvent.startTime,
				endTime: newEvent.endTime,
				location: newEvent.location,
				type: newEvent.type,
				visibleTo: newEvent.visibleTo,
				createdAt: new Date().toISOString().split("T")[0],
				createdBy: "Current Admin User", // Would use actual user in real app
			};
			setEvents([...events, newEventItem]);
		}

		// Reset form and close modal
		resetForm();
	};

	const handleDeleteEvent = (id: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this event?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: () => {
						const updatedEvents = events.filter((item) => item.id !== id);
						setEvents(updatedEvents);
					},
					style: "destructive",
				},
			],
		);
	};

	const handleEditEvent = (event: Event) => {
		setEditingId(event.id);
		setNewEvent({
			title: event.title,
			description: event.description,
			date: event.date,
			startTime: event.startTime,
			endTime: event.endTime,
			location: event.location,
			type: event.type,
			visibleTo: event.visibleTo,
		});
		setModalVisible(true);
	};

	const handleViewEvent = (event: Event) => {
		setSelectedEvent(event);
	};

	const resetForm = () => {
		setEditingId(null);
		setNewEvent({
			title: "",
			description: "",
			date: new Date().toISOString().split("T")[0],
			startTime: "09:00",
			endTime: "10:00",
			location: "",
			type: "academic",
			visibleTo: ["admin", "teacher", "parent", "student"],
		});
		setModalVisible(false);
		setSelectedEvent(null);
	};

	const toggleUserRole = (role: "admin" | "teacher" | "parent" | "student") => {
		const currentRoles = [...newEvent.visibleTo];
		if (currentRoles.includes(role)) {
			setNewEvent({
				...newEvent,
				visibleTo: currentRoles.filter((r) => r !== role),
			});
		} else {
			setNewEvent({
				...newEvent,
				visibleTo: [...currentRoles, role],
			});
		}
	};

	const getEventTypeColor = (type: Event["type"]) => {
		switch (type) {
			case "academic":
				return "#4F46E5"; // Indigo
			case "sports":
				return "#10B981"; // Green
			case "cultural":
				return "#F59E0B"; // Amber
			case "holiday":
				return "#EF4444"; // Red
			case "exam":
				return "#6366F1"; // Purple
			default:
				return "#6B7280"; // Gray
		}
	};

	const renderEventItem = ({ item }: { item: Event }) => (
		<Card style={styles.eventCard}>
			<View style={styles.eventHeader}>
				<View
					style={[
						styles.eventTypeBadge,
						{ backgroundColor: getEventTypeColor(item.type) },
					]}
				>
					<Text style={styles.eventTypeText}>
						{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
					</Text>
				</View>
				<Text style={styles.eventDate}>
					{new Date(item.date).toLocaleDateString(undefined, {
						weekday: "short",
						month: "short",
						day: "numeric",
					})}
				</Text>
			</View>
			<H3 style={styles.eventTitle}>{item.title}</H3>
			<View style={styles.eventTimeLocation}>
				<View style={styles.eventTime}>
					<Icon icon="ph:clock" size={16} color="#6B7280" />
					<Text style={styles.eventTimeText}>
						{item.startTime} - {item.endTime}
					</Text>
				</View>
				{item.location && (
					<View style={styles.eventLocation}>
						<Icon icon="ph:map-pin" size={16} color="#6B7280" />
						<Text style={styles.eventLocationText}>{item.location}</Text>
					</View>
				)}
			</View>
			<View style={styles.eventActions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleViewEvent(item)}
				>
					<Icon icon="ph:eye" size={20} color="#4F46E5" />
					<Text style={styles.actionButtonText}>View</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleEditEvent(item)}
				>
					<Icon icon="ph:pencil" size={20} color="#4F46E5" />
					<Text style={styles.actionButtonText}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleDeleteEvent(item.id)}
				>
					<Icon icon="ph:trash" size={20} color="#EF4444" />
					<Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
						Delete
					</Text>
				</TouchableOpacity>
			</View>
		</Card>
	);

	const renderCalendarHeader = () => {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		return (
			<View style={styles.calendarHeader}>
				<View style={styles.monthYearSelector}>
					<TouchableOpacity
						style={styles.monthYearButton}
						onPress={() => {
							if (selectedMonth === 1) {
								setSelectedMonth(12);
								setSelectedYear(selectedYear - 1);
							} else {
								setSelectedMonth(selectedMonth - 1);
							}
						}}
					>
						<Icon icon="ph:caret-left" size={20} color="#4F46E5" />
					</TouchableOpacity>
					<Text style={styles.monthYearText}>
						{months[selectedMonth - 1]} {selectedYear}
					</Text>
					<TouchableOpacity
						style={styles.monthYearButton}
						onPress={() => {
							if (selectedMonth === 12) {
								setSelectedMonth(1);
								setSelectedYear(selectedYear + 1);
							} else {
								setSelectedMonth(selectedMonth + 1);
							}
						}}
					>
						<Icon icon="ph:caret-right" size={20} color="#4F46E5" />
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<H1>Calendar</H1>
				<Muted>Manage school events and schedule</Muted>
			</View>

			<View style={styles.actions}>
				<View style={styles.searchContainer}>
					<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search events..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => {
						resetForm();
						setModalVisible(true);
					}}
				>
					<Icon icon="ph:plus" size={20} color="#FFFFFF" />
					<Text style={styles.addButtonText}>Add Event</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.filters}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.filterScroll}
				>
					<TouchableOpacity
						style={[
							styles.filterButton,
							selectedEventType === "all" && styles.activeFilter,
						]}
						onPress={() => setSelectedEventType("all")}
					>
						<Text
							style={[
								styles.filterText,
								selectedEventType === "all" && styles.activeFilterText,
							]}
						>
							All Events
						</Text>
					</TouchableOpacity>
					{["academic", "sports", "cultural", "holiday", "exam", "other"].map(
						(type) => (
							<TouchableOpacity
								key={type}
								style={[
									styles.filterButton,
									selectedEventType === type && styles.activeFilter,
									{
										backgroundColor:
											selectedEventType === type
												? getEventTypeColor(type as Event["type"])
												: "#F3F4F6",
									},
								]}
								onPress={() => setSelectedEventType(type)}
							>
								<Text
									style={[
										styles.filterText,
										selectedEventType === type && styles.activeFilterText,
									]}
								>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</Text>
							</TouchableOpacity>
						),
					)}
				</ScrollView>
			</View>

			{renderCalendarHeader()}

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#4F46E5" />
				</View>
			) : (
				<FlatList
					data={filteredEvents}
					renderItem={renderEventItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.eventsList}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Icon icon="ph:calendar" size={48} color="#D1D5DB" />
							<P style={styles.emptyText}>No events found</P>
						</View>
					}
				/>
			)}

			{/* Create/Edit Event Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={resetForm}
			>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalContent}>
						<ScrollView>
							<H2 style={styles.modalTitle}>
								{editingId ? "Edit Event" : "Create New Event"}
							</H2>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Title (required)</Text>
								<TextInput
									style={styles.input}
									placeholder="Enter event title"
									value={newEvent.title}
									onChangeText={(text) =>
										setNewEvent({ ...newEvent, title: text })
									}
								/>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Description</Text>
								<TextInput
									style={[styles.input, styles.textArea]}
									placeholder="Enter event description"
									value={newEvent.description}
									onChangeText={(text) =>
										setNewEvent({ ...newEvent, description: text })
									}
									multiline
									numberOfLines={4}
									textAlignVertical="top"
								/>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Event Type</Text>
								<View style={styles.typeSelector}>
									{(
										[
											"academic",
											"sports",
											"cultural",
											"holiday",
											"exam",
											"other",
										] as Event["type"][]
									).map((type) => (
										<TouchableOpacity
											key={type}
											style={[
												styles.typeOption,
												newEvent.type === type && styles.activeTypeOption,
												newEvent.type === type && {
													backgroundColor: getEventTypeColor(type),
												},
											]}
											onPress={() => setNewEvent({ ...newEvent, type })}
										>
											<Text
												style={[
													styles.typeOptionText,
													newEvent.type === type && styles.activeTypeOptionText,
												]}
											>
												{type.charAt(0).toUpperCase() + type.slice(1)}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Date (required)</Text>
								<TextInput
									style={styles.input}
									placeholder="YYYY-MM-DD"
									value={newEvent.date}
									onChangeText={(text) =>
										setNewEvent({ ...newEvent, date: text })
									}
								/>
							</View>

							<View style={styles.timeInputsRow}>
								<View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
									<Text style={styles.inputLabel}>Start Time</Text>
									<TextInput
										style={styles.input}
										placeholder="HH:MM"
										value={newEvent.startTime}
										onChangeText={(text) =>
											setNewEvent({ ...newEvent, startTime: text })
										}
									/>
								</View>
								<View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
									<Text style={styles.inputLabel}>End Time</Text>
									<TextInput
										style={styles.input}
										placeholder="HH:MM"
										value={newEvent.endTime}
										onChangeText={(text) =>
											setNewEvent({ ...newEvent, endTime: text })
										}
									/>
								</View>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Location</Text>
								<TextInput
									style={styles.input}
									placeholder="Enter event location"
									value={newEvent.location}
									onChangeText={(text) =>
										setNewEvent({ ...newEvent, location: text })
									}
								/>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Visible to</Text>
								<View style={styles.visibilityOptions}>
									{(["admin", "teacher", "parent", "student"] as const).map(
										(role) => (
											<TouchableOpacity
												key={role}
												style={styles.visibilityOption}
												onPress={() => toggleUserRole(role)}
											>
												<View style={styles.checkboxContainer}>
													<View
														style={[
															styles.checkbox,
															newEvent.visibleTo.includes(role) &&
																styles.checkboxSelected,
														]}
													>
														{newEvent.visibleTo.includes(role) && (
															<Icon icon="ph:check" size={12} color="#FFFFFF" />
														)}
													</View>
													<Text style={styles.checkboxLabel}>
														{role.charAt(0).toUpperCase() + role.slice(1)}s
													</Text>
												</View>
											</TouchableOpacity>
										),
									)}
								</View>
							</View>

							<View style={styles.modalActions}>
								<TouchableOpacity
									style={styles.cancelButton}
									onPress={resetForm}
								>
									<Text style={styles.cancelButtonText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.saveButton}
									onPress={handleSaveEvent}
								>
									<Text style={styles.saveButtonText}>
										{editingId ? "Update" : "Create"}
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</Card>
				</View>
			</Modal>

			{/* View Event Modal */}
			{selectedEvent && (
				<Modal
					animationType="slide"
					transparent={true}
					visible={selectedEvent !== null}
					onRequestClose={() => setSelectedEvent(null)}
				>
					<View style={styles.modalOverlay}>
						<Card style={styles.modalContent}>
							<ScrollView>
								<View style={styles.viewEventHeader}>
									<View
										style={[
											styles.eventTypeBadge,
											{
												backgroundColor: getEventTypeColor(selectedEvent.type),
											},
										]}
									>
										<Text style={styles.eventTypeText}>
											{selectedEvent.type.charAt(0).toUpperCase() +
												selectedEvent.type.slice(1)}
										</Text>
									</View>
									<H2 style={styles.viewEventTitle}>{selectedEvent.title}</H2>
								</View>

								<View style={styles.viewEventDetails}>
									<View style={styles.detailRow}>
										<Icon icon="ph:calendar" size={20} color="#6B7280" />
										<Text style={styles.detailText}>
											{new Date(selectedEvent.date).toLocaleDateString(
												undefined,
												{
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												},
											)}
										</Text>
									</View>
									<View style={styles.detailRow}>
										<Icon icon="ph:clock" size={20} color="#6B7280" />
										<Text style={styles.detailText}>
											{selectedEvent.startTime} - {selectedEvent.endTime}
										</Text>
									</View>
									{selectedEvent.location && (
										<View style={styles.detailRow}>
											<Icon icon="ph:map-pin" size={20} color="#6B7280" />
											<Text style={styles.detailText}>
												{selectedEvent.location}
											</Text>
										</View>
									)}
								</View>

								{selectedEvent.description && (
									<View style={styles.descriptionContainer}>
										<Text style={styles.descriptionLabel}>Description</Text>
										<P style={styles.descriptionText}>
											{selectedEvent.description}
										</P>
									</View>
								)}

								<View style={styles.visibleToContainer}>
									<Text style={styles.visibleToLabel}>Visible to:</Text>
									<View style={styles.audienceBadges}>
										{selectedEvent.visibleTo.map((role) => (
											<View key={role} style={styles.roleBadge}>
												<Text style={styles.roleText}>
													{role.charAt(0).toUpperCase() + role.slice(1)}
												</Text>
											</View>
										))}
									</View>
								</View>

								<View style={styles.eventMeta}>
									<Text style={styles.metaText}>
										Created: {selectedEvent.createdAt}
									</Text>
									<Text style={styles.metaText}>
										By: {selectedEvent.createdBy}
									</Text>
								</View>

								<View style={styles.modalActions}>
									<TouchableOpacity
										style={styles.closeButton}
										onPress={() => setSelectedEvent(null)}
									>
										<Text style={styles.closeButtonText}>Close</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.editButton}
										onPress={() => {
											handleEditEvent(selectedEvent);
											setSelectedEvent(null);
										}}
									>
										<Text style={styles.editButtonText}>Edit</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</Card>
					</View>
				</Modal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
	header: {
		padding: 24,
		backgroundColor: "#FFFFFF",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	actions: {
		flexDirection: "row",
		padding: 16,
		gap: 16,
		alignItems: "center",
	},
	searchContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		paddingHorizontal: 12,
		alignItems: "center",
	},
	searchInput: {
		flex: 1,
		height: 40,
		marginLeft: 8,
	},
	addButton: {
		flexDirection: "row",
		backgroundColor: "#4F46E5",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
		gap: 8,
	},
	addButtonText: {
		color: "#FFFFFF",
		fontWeight: "500",
	},
	filters: {
		paddingHorizontal: 16,
	},
	filterScroll: {
		flexDirection: "row",
		paddingBottom: 16,
	},
	filterButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 16,
		backgroundColor: "#F3F4F6",
		marginRight: 8,
	},
	activeFilter: {
		backgroundColor: "#4F46E5",
	},
	filterText: {
		fontSize: 14,
		color: "#6B7280",
	},
	activeFilterText: {
		color: "#FFFFFF",
	},
	calendarHeader: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	monthYearSelector: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	monthYearButton: {
		padding: 8,
	},
	monthYearText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#111827",
		marginHorizontal: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	eventsList: {
		padding: 16,
	},
	eventCard: {
		padding: 16,
		marginBottom: 16,
	},
	eventHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	eventTypeBadge: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
		alignSelf: "flex-start",
	},
	eventTypeText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "500",
	},
	eventDate: {
		fontSize: 14,
		color: "#6B7280",
	},
	eventTitle: {
		fontSize: 18,
		marginBottom: 12,
	},
	eventTimeLocation: {
		marginBottom: 16,
	},
	eventTime: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	eventTimeText: {
		marginLeft: 8,
		color: "#6B7280",
	},
	eventLocation: {
		flexDirection: "row",
		alignItems: "center",
	},
	eventLocationText: {
		marginLeft: 8,
		color: "#6B7280",
	},
	eventActions: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		paddingTop: 12,
		justifyContent: "flex-end",
		gap: 16,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	actionButtonText: {
		color: "#4F46E5",
		fontWeight: "500",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 48,
	},
	emptyText: {
		marginTop: 16,
		color: "#9CA3AF",
		fontSize: 16,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "90%",
		maxWidth: 500,
		maxHeight: "80%",
		padding: 24,
	},
	modalTitle: {
		marginBottom: 24,
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 8,
		color: "#4B5563",
	},
	input: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: "#FFFFFF",
	},
	textArea: {
		minHeight: 100,
	},
	timeInputsRow: {
		flexDirection: "row",
		marginBottom: 16,
	},
	typeSelector: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	typeOption: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: "#F3F4F6",
		marginBottom: 8,
		marginRight: 8,
	},
	activeTypeOption: {
		backgroundColor: "#4F46E5",
	},
	typeOptionText: {
		fontSize: 14,
		color: "#4B5563",
	},
	activeTypeOptionText: {
		color: "#FFFFFF",
	},
	visibilityOptions: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	visibilityOption: {
		marginRight: 16,
		marginBottom: 8,
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#D1D5DB",
		marginRight: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxSelected: {
		backgroundColor: "#4F46E5",
		borderColor: "#4F46E5",
	},
	checkboxLabel: {
		fontSize: 14,
		color: "#4B5563",
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 24,
		gap: 12,
	},
	cancelButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	cancelButtonText: {
		color: "#6B7280",
	},
	saveButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: "#4F46E5",
	},
	saveButtonText: {
		color: "#FFFFFF",
		fontWeight: "500",
	},
	viewEventHeader: {
		marginBottom: 16,
	},
	viewEventTitle: {
		marginTop: 8,
	},
	viewEventDetails: {
		marginBottom: 16,
		backgroundColor: "#F9FAFB",
		padding: 12,
		borderRadius: 8,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	detailText: {
		marginLeft: 8,
		color: "#4B5563",
	},
	descriptionContainer: {
		marginBottom: 16,
	},
	descriptionLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#4B5563",
		marginBottom: 8,
	},
	descriptionText: {
		color: "#4B5563",
	},
	visibleToContainer: {
		marginBottom: 16,
	},
	visibleToLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#4B5563",
		marginBottom: 8,
	},
	audienceBadges: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	roleBadge: {
		backgroundColor: "#F3F4F6",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	roleText: {
		fontSize: 12,
		color: "#4B5563",
	},
	eventMeta: {
		marginBottom: 16,
	},
	metaText: {
		fontSize: 12,
		color: "#6B7280",
		marginBottom: 4,
	},
	closeButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	closeButtonText: {
		color: "#6B7280",
	},
	editButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: "#4F46E5",
	},
	editButtonText: {
		color: "#FFFFFF",
		fontWeight: "500",
	},
});
