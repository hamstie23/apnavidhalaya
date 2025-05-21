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
	Switch,
} from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { supabase } from "@/config/supabase";

interface Announcement {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	publishedAt?: string;
	expiresAt?: string;
	isPublished: boolean;
	visibleTo: ("admin" | "teacher" | "parent" | "student")[];
}

export default function AnnouncementsManagement() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterPublished, setFilterPublished] = useState<
		"all" | "published" | "draft"
	>("all");
	const [modalVisible, setModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedAnnouncement, setSelectedAnnouncement] =
		useState<Announcement | null>(null);
	const [newAnnouncement, setNewAnnouncement] = useState({
		title: "",
		content: "",
		isPublished: false,
		visibleTo: ["admin", "teacher", "parent", "student"] as (
			| "admin"
			| "teacher"
			| "parent"
			| "student"
		)[],
		publishDate: "",
		expiryDate: "",
	});

	// Mock data for demonstration
	const mockAnnouncements: Announcement[] = [
		{
			id: "1",
			title: "School Annual Day Celebration",
			content:
				"We are excited to announce our Annual Day celebration on June 15th. All students and parents are invited to join us for this special event.",
			createdAt: "2023-05-10",
			publishedAt: "2023-05-10",
			expiresAt: "2023-06-16",
			isPublished: true,
			visibleTo: ["admin", "teacher", "parent", "student"],
		},
		{
			id: "2",
			title: "Teacher's Meeting Notice",
			content:
				"All teachers are requested to attend a meeting on May 25th at 3:00 PM in the staff room to discuss the upcoming exams.",
			createdAt: "2023-05-15",
			publishedAt: "2023-05-15",
			isPublished: true,
			visibleTo: ["admin", "teacher"],
		},
		{
			id: "3",
			title: "Holiday Notice",
			content:
				"The school will remain closed on May 30th due to state elections. Classes will resume on May 31st.",
			createdAt: "2023-05-20",
			isPublished: false,
			visibleTo: ["admin", "teacher", "parent", "student"],
		},
	];

	// In a real app, this would fetch announcements from Supabase
	useEffect(() => {
		const fetchAnnouncements = async () => {
			setLoading(true);
			// In a real implementation, fetch from Supabase
			// const { data, error } = await supabase.from('announcements').select('*');

			// Using mock data for now
			setAnnouncements(mockAnnouncements);
			setLoading(false);
		};

		fetchAnnouncements();
	}, []);

	// Filter announcements based on search and published filter
	const filteredAnnouncements = announcements.filter((announcement) => {
		const matchesSearch =
			announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

		if (filterPublished === "all") {
			return matchesSearch;
		} else if (filterPublished === "published") {
			return matchesSearch && announcement.isPublished;
		} else {
			return matchesSearch && !announcement.isPublished;
		}
	});

	const handleSaveAnnouncement = () => {
		if (!newAnnouncement.title || !newAnnouncement.content) {
			Alert.alert("Error", "Title and content are required");
			return;
		}

		if (editingId) {
			// Update existing announcement
			const updatedAnnouncements = announcements.map((item) => {
				if (item.id === editingId) {
					return {
						...item,
						title: newAnnouncement.title,
						content: newAnnouncement.content,
						isPublished: newAnnouncement.isPublished,
						visibleTo: newAnnouncement.visibleTo,
						publishedAt: newAnnouncement.isPublished
							? item.publishedAt || new Date().toISOString().split("T")[0]
							: undefined,
						expiresAt: newAnnouncement.expiryDate || item.expiresAt,
					};
				}
				return item;
			});
			setAnnouncements(updatedAnnouncements);
		} else {
			// Add new announcement
			const newId = (announcements.length + 1).toString();
			const newAnnouncementItem: Announcement = {
				id: newId,
				title: newAnnouncement.title,
				content: newAnnouncement.content,
				createdAt: new Date().toISOString().split("T")[0],
				publishedAt: newAnnouncement.isPublished
					? new Date().toISOString().split("T")[0]
					: undefined,
				expiresAt: newAnnouncement.expiryDate || undefined,
				isPublished: newAnnouncement.isPublished,
				visibleTo: newAnnouncement.visibleTo,
			};
			setAnnouncements([...announcements, newAnnouncementItem]);
		}

		// Reset form and close modal
		resetForm();
	};

	const handleDeleteAnnouncement = (id: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this announcement?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: () => {
						const updatedAnnouncements = announcements.filter(
							(item) => item.id !== id,
						);
						setAnnouncements(updatedAnnouncements);
					},
					style: "destructive",
				},
			],
		);
	};

	const handleEditAnnouncement = (announcement: Announcement) => {
		setEditingId(announcement.id);
		setNewAnnouncement({
			title: announcement.title,
			content: announcement.content,
			isPublished: announcement.isPublished,
			visibleTo: announcement.visibleTo,
			publishDate: announcement.publishedAt || "",
			expiryDate: announcement.expiresAt || "",
		});
		setModalVisible(true);
	};

	const handleViewAnnouncement = (announcement: Announcement) => {
		setSelectedAnnouncement(announcement);
	};

	const resetForm = () => {
		setEditingId(null);
		setNewAnnouncement({
			title: "",
			content: "",
			isPublished: false,
			visibleTo: ["admin", "teacher", "parent", "student"],
			publishDate: "",
			expiryDate: "",
		});
		setModalVisible(false);
		setSelectedAnnouncement(null);
	};

	const toggleUserRole = (role: "admin" | "teacher" | "parent" | "student") => {
		const currentRoles = [...newAnnouncement.visibleTo];
		if (currentRoles.includes(role)) {
			setNewAnnouncement({
				...newAnnouncement,
				visibleTo: currentRoles.filter((r) => r !== role),
			});
		} else {
			setNewAnnouncement({
				...newAnnouncement,
				visibleTo: [...currentRoles, role],
			});
		}
	};

	const renderAnnouncementItem = ({ item }: { item: Announcement }) => (
		<Card style={styles.announcementCard}>
			<View style={styles.announcementHeader}>
				<H3>{item.title}</H3>
				{item.isPublished ? (
					<View style={styles.publishedBadge}>
						<Text style={styles.publishedText}>Published</Text>
					</View>
				) : (
					<View style={styles.draftBadge}>
						<Text style={styles.draftText}>Draft</Text>
					</View>
				)}
			</View>
			<P numberOfLines={2} style={styles.announcementContent}>
				{item.content}
			</P>
			<View style={styles.announcementMeta}>
				<Text style={styles.metaText}>Created: {item.createdAt}</Text>
				{item.publishedAt && (
					<Text style={styles.metaText}>Published: {item.publishedAt}</Text>
				)}
				{item.expiresAt && (
					<Text style={styles.metaText}>Expires: {item.expiresAt}</Text>
				)}
			</View>
			<View style={styles.audienceBadges}>
				{item.visibleTo.map((role) => (
					<View key={role} style={styles.roleBadge}>
						<Text style={styles.roleText}>
							{role.charAt(0).toUpperCase() + role.slice(1)}
						</Text>
					</View>
				))}
			</View>
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleViewAnnouncement(item)}
				>
					<Icon icon="ph:eye" size={20} color="#4F46E5" />
					<Text style={styles.actionButtonText}>View</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleEditAnnouncement(item)}
				>
					<Icon icon="ph:pencil" size={20} color="#4F46E5" />
					<Text style={styles.actionButtonText}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleDeleteAnnouncement(item.id)}
				>
					<Icon icon="ph:trash" size={20} color="#EF4444" />
					<Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
						Delete
					</Text>
				</TouchableOpacity>
			</View>
		</Card>
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<H1>Announcements</H1>
				<Muted>Create and manage school announcements</Muted>
			</View>

			<View style={styles.actions}>
				<View style={styles.searchContainer}>
					<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search announcements..."
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
					<Text style={styles.addButtonText}>New Announcement</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.filters}>
				<TouchableOpacity
					style={[
						styles.filterButton,
						filterPublished === "all" && styles.activeFilter,
					]}
					onPress={() => setFilterPublished("all")}
				>
					<Text
						style={[
							styles.filterText,
							filterPublished === "all" && styles.activeFilterText,
						]}
					>
						All
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterButton,
						filterPublished === "published" && styles.activeFilter,
					]}
					onPress={() => setFilterPublished("published")}
				>
					<Text
						style={[
							styles.filterText,
							filterPublished === "published" && styles.activeFilterText,
						]}
					>
						Published
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterButton,
						filterPublished === "draft" && styles.activeFilter,
					]}
					onPress={() => setFilterPublished("draft")}
				>
					<Text
						style={[
							styles.filterText,
							filterPublished === "draft" && styles.activeFilterText,
						]}
					>
						Drafts
					</Text>
				</TouchableOpacity>
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#4F46E5" />
				</View>
			) : (
				<FlatList
					data={filteredAnnouncements}
					renderItem={renderAnnouncementItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.announcementsList}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Icon icon="ph:bell" size={48} color="#D1D5DB" />
							<P style={styles.emptyText}>No announcements found</P>
						</View>
					}
				/>
			)}

			{/* Create/Edit Announcement Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={resetForm}
			>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalContent}>
						<H2 style={styles.modalTitle}>
							{editingId ? "Edit Announcement" : "Create New Announcement"}
						</H2>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Title (required)</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter announcement title"
								value={newAnnouncement.title}
								onChangeText={(text) =>
									setNewAnnouncement({ ...newAnnouncement, title: text })
								}
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Content (required)</Text>
							<TextInput
								style={[styles.input, styles.textArea]}
								placeholder="Enter announcement content"
								value={newAnnouncement.content}
								onChangeText={(text) =>
									setNewAnnouncement({ ...newAnnouncement, content: text })
								}
								multiline
								numberOfLines={5}
								textAlignVertical="top"
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
														newAnnouncement.visibleTo.includes(role) &&
															styles.checkboxSelected,
													]}
												>
													{newAnnouncement.visibleTo.includes(role) && (
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

						<View style={styles.inputGroup}>
							<View style={styles.switchRow}>
								<Text style={styles.inputLabel}>Publish Immediately</Text>
								<Switch
									value={newAnnouncement.isPublished}
									onValueChange={(value) =>
										setNewAnnouncement({
											...newAnnouncement,
											isPublished: value,
										})
									}
									trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
									thumbColor="#FFFFFF"
								/>
							</View>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Expiry Date (optional)</Text>
							<TextInput
								style={styles.input}
								placeholder="YYYY-MM-DD"
								value={newAnnouncement.expiryDate}
								onChangeText={(text) =>
									setNewAnnouncement({ ...newAnnouncement, expiryDate: text })
								}
							/>
						</View>

						<View style={styles.modalActions}>
							<TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.saveButton}
								onPress={handleSaveAnnouncement}
							>
								<Text style={styles.saveButtonText}>
									{editingId ? "Update" : "Create"}
								</Text>
							</TouchableOpacity>
						</View>
					</Card>
				</View>
			</Modal>

			{/* View Announcement Modal */}
			{selectedAnnouncement && (
				<Modal
					animationType="slide"
					transparent={true}
					visible={selectedAnnouncement !== null}
					onRequestClose={() => setSelectedAnnouncement(null)}
				>
					<View style={styles.modalOverlay}>
						<Card style={styles.modalContent}>
							<View style={styles.viewAnnouncementHeader}>
								<H2 style={styles.viewAnnouncementTitle}>
									{selectedAnnouncement.title}
								</H2>
								{selectedAnnouncement.isPublished ? (
									<View style={styles.publishedBadge}>
										<Text style={styles.publishedText}>Published</Text>
									</View>
								) : (
									<View style={styles.draftBadge}>
										<Text style={styles.draftText}>Draft</Text>
									</View>
								)}
							</View>

							<ScrollView style={styles.viewAnnouncementContent}>
								<P>{selectedAnnouncement.content}</P>
							</ScrollView>

							<View style={styles.viewAnnouncementMeta}>
								<Text style={styles.metaText}>
									Created: {selectedAnnouncement.createdAt}
								</Text>
								{selectedAnnouncement.publishedAt && (
									<Text style={styles.metaText}>
										Published: {selectedAnnouncement.publishedAt}
									</Text>
								)}
								{selectedAnnouncement.expiresAt && (
									<Text style={styles.metaText}>
										Expires: {selectedAnnouncement.expiresAt}
									</Text>
								)}
							</View>

							<View style={styles.visibleToContainer}>
								<Text style={styles.visibleToLabel}>Visible to:</Text>
								<View style={styles.audienceBadges}>
									{selectedAnnouncement.visibleTo.map((role) => (
										<View key={role} style={styles.roleBadge}>
											<Text style={styles.roleText}>
												{role.charAt(0).toUpperCase() + role.slice(1)}
											</Text>
										</View>
									))}
								</View>
							</View>

							<View style={styles.modalActions}>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={() => setSelectedAnnouncement(null)}
								>
									<Text style={styles.closeButtonText}>Close</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.editButton}
									onPress={() => {
										handleEditAnnouncement(selectedAnnouncement);
										setSelectedAnnouncement(null);
									}}
								>
									<Text style={styles.editButtonText}>Edit</Text>
								</TouchableOpacity>
							</View>
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
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingBottom: 16,
		gap: 8,
	},
	filterButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 16,
		backgroundColor: "#F3F4F6",
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	announcementsList: {
		padding: 16,
	},
	announcementCard: {
		padding: 16,
		marginBottom: 16,
	},
	announcementHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	publishedBadge: {
		backgroundColor: "#10B981",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	publishedText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "500",
	},
	draftBadge: {
		backgroundColor: "#F59E0B",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	draftText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "500",
	},
	announcementContent: {
		marginBottom: 12,
	},
	announcementMeta: {
		marginBottom: 12,
	},
	metaText: {
		fontSize: 12,
		color: "#6B7280",
		marginBottom: 4,
	},
	audienceBadges: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 16,
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
	actionButtons: {
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
	switchRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
	viewAnnouncementHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	viewAnnouncementTitle: {
		flex: 1,
		marginRight: 8,
	},
	viewAnnouncementContent: {
		maxHeight: 200,
		marginBottom: 16,
	},
	viewAnnouncementMeta: {
		marginBottom: 16,
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
