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

interface Group {
	id: string;
	name: string;
	description: string;
	type: "class" | "team" | "club" | "committee" | "other";
	memberCount: number;
	createdAt: string;
	classTeacher?: string;
}

interface GroupMember {
	id: string;
	name: string;
	email: string;
	role: "admin" | "teacher" | "parent" | "student";
	joinedAt: string;
}

export default function GroupsManagement() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGroupType, setSelectedGroupType] = useState<"all" | Group["type"]>("all");
	const [modalVisible, setModalVisible] = useState(false);
	const [memberModalVisible, setMemberModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
	const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
	const [membersLoading, setMembersLoading] = useState(false);
	const [newGroup, setNewGroup] = useState({
		name: "",
		description: "",
		type: "class" as Group["type"],
		classTeacher: "",
	});

	// Mock data for demonstration
	const mockGroups: Group[] = [
		{
			id: "1",
			name: "Class 10-A",
			description: "Science section for 10th grade students",
			type: "class",
			memberCount: 32,
			createdAt: "2023-04-01",
			classTeacher: "John Smith",
		},
		{
			id: "2",
			name: "Class 9-B",
			description: "Commerce section for 9th grade students",
			type: "class",
			memberCount: 28,
			createdAt: "2023-04-01",
			classTeacher: "Maria Garcia",
		},
		{
			id: "3",
			name: "Cricket Team",
			description: "School cricket team for inter-school tournaments",
			type: "team",
			memberCount: 15,
			createdAt: "2023-03-15",
		},
		{
			id: "4",
			name: "Science Club",
			description: "Club for students interested in science experiments and projects",
			type: "club",
			memberCount: 22,
			createdAt: "2023-02-10",
		},
		{
			id: "5",
			name: "Parent-Teacher Committee",
			description: "Committee for parent-teacher collaboration and school improvement",
			type: "committee",
			memberCount: 12,
			createdAt: "2023-01-05",
		},
	];

	// Mock members data
	const mockMembers: Record<string, GroupMember[]> = {
		"1": [
			{
				id: "m1",
				name: "Alice Johnson",
				email: "alice@example.com",
				role: "student",
				joinedAt: "2023-04-02",
			},
			{
				id: "m2",
				name: "Bob Williams",
				email: "bob@example.com",
				role: "student",
				joinedAt: "2023-04-02",
			},
			{
				id: "m3",
				name: "John Smith",
				email: "john@school.com",
				role: "teacher",
				joinedAt: "2023-04-01",
			},
			{
				id: "m4",
				name: "Robert Johnson",
				email: "robert@example.com",
				role: "parent",
				joinedAt: "2023-04-05",
			},
		],
	};

	// In a real app, this would fetch groups from Supabase
	useEffect(() => {
		const fetchGroups = async () => {
			setLoading(true);
			// In a real implementation, fetch from Supabase
			// const { data, error } = await supabase.from('groups').select('*');
			
			// Using mock data for now
			setGroups(mockGroups);
			setLoading(false);
		};

		fetchGroups();
	}, []);

	// Filter groups based on search and type
	const filteredGroups = groups.filter((group) => {
		const matchesSearch = 
			group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			group.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = selectedGroupType === "all" || group.type === selectedGroupType;

		return matchesSearch && matchesType;
	});

	const handleSaveGroup = () => {
		if (!newGroup.name) {
			Alert.alert("Error", "Group name is required");
			return;
		}

		if (editingId) {
			// Update existing group
			const updatedGroups = groups.map((item) => {
				if (item.id === editingId) {
					return {
						...item,
						name: newGroup.name,
						description: newGroup.description,
						type: newGroup.type,
						classTeacher: newGroup.type === "class" ? newGroup.classTeacher : undefined,
					};
				}
				return item;
			});
			setGroups(updatedGroups);
		} else {
			// Add new group
			const newId = (groups.length + 1).toString();
			const newGroupItem: Group = {
				id: newId,
				name: newGroup.name,
				description: newGroup.description,
				type: newGroup.type,
				memberCount: 0,
				createdAt: new Date().toISOString().split("T")[0],
				classTeacher: newGroup.type === "class" ? newGroup.classTeacher : undefined,
			};
			setGroups([...groups, newGroupItem]);
		}

		// Reset form and close modal
		resetForm();
	};

	const handleDeleteGroup = (id: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this group? All members will be removed from this group.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: () => {
						const updatedGroups = groups.filter((item) => item.id !== id);
						setGroups(updatedGroups);
					},
					style: "destructive",
				},
			]
		);
	};

	const handleEditGroup = (group: Group) => {
		setEditingId(group.id);
		setNewGroup({
			name: group.name,
			description: group.description,
			type: group.type,
			classTeacher: group.classTeacher || "",
		});
		setModalVisible(true);
	};

	const handleViewMembers = (group: Group) => {
		setSelectedGroup(group);
		setMembersLoading(true);
		
		// In a real app, fetch members from Supabase
		// Simulate API call with timeout
		setTimeout(() => {
			const members = mockMembers[group.id] || [];
			setGroupMembers(members);
			setMembersLoading(false);
			setMemberModalVisible(true);
		}, 500);
	};

	const resetForm = () => {
		setEditingId(null);
		setNewGroup({
			name: "",
			description: "",
			type: "class",
			classTeacher: "",
		});
		setModalVisible(false);
	};

	const getGroupTypeColor = (type: Group["type"]) => {
		switch (type) {
			case "class":
				return "#4F46E5"; // Indigo
			case "team":
				return "#10B981"; // Green
			case "club":
				return "#F59E0B"; // Amber
			case "committee":
				return "#6366F1"; // Purple
			default:
				return "#6B7280"; // Gray
		}
	};

	const getGroupTypeIcon = (type: Group["type"]) => {
		switch (type) {
			case "class":
				return "ph:chalkboard-teacher";
			case "team":
				return "ph:soccer-ball";
			case "club":
				return "ph:users-three";
			case "committee":
				return "ph:users";
			default:
				return "ph:users-four";
		}
	};

	const getRoleColor = (role: GroupMember["role"]) => {
		switch (role) {
			case "admin":
				return "#EF4444"; // Red
			case "teacher":
				return "#4F46E5"; // Indigo
			case "parent":
				return "#10B981"; // Green
			case "student":
				return "#F59E0B"; // Amber
			default:
				return "#6B7280"; // Gray
		}
	};

	const renderGroupItem = ({ item }: { item: Group }) => (
		<Card style={styles.groupCard}>
			<View style={styles.groupHeader}>
				<View style={styles.groupTypeIconContainer}>
					<Icon 
						icon={getGroupTypeIcon(item.type)} 
						size={24} 
						color={getGroupTypeColor(item.type)} 
					/>
				</View>
				<View style={styles.groupInfo}>
					<View style={styles.groupTitleRow}>
						<H3 style={styles.groupTitle}>{item.name}</H3>
						<View 
							style={[
								styles.groupTypeBadge, 
								{ backgroundColor: getGroupTypeColor(item.type) }
							]}
						>
							<Text style={styles.groupTypeText}>
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</Text>
						</View>
					</View>
					<P numberOfLines={2} style={styles.groupDescription}>
						{item.description}
					</P>
					<View style={styles.groupMeta}>
						<View style={styles.metaItem}>
							<Icon icon="ph:users" size={16} color="#6B7280" />
							<Text style={styles.metaText}>{item.memberCount} members</Text>
						</View>
						{item.classTeacher && (
							<View style={styles.metaItem}>
								<Icon icon="ph:user-circle" size={16} color="#6B7280" />
								<Text style={styles.metaText}>Teacher: {item.classTeacher}</Text>
							</View>
						)}
						<View style={styles.metaItem}>
							<Icon icon="ph:calendar" size={16} color="#6B7280" />
							<Text style={styles.metaText}>Created: {item.createdAt}</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.groupActions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleViewMembers(item)}
				>
					<Icon icon="ph:users" size={20} color="#4F46E5" />
					<Text style={styles.actionButtonText}>Members</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleEditGroup(item)}
				>
					<Icon icon="ph:pencil" size={20} color="#4F46E5" />
					<Text style={styles.actionButtonText}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleDeleteGroup(item.id)}
				>
					<Icon icon="ph:trash" size={20} color="#EF4444" />
					<Text style={[styles.actionButtonText, { color: "#EF4444" }]}>Delete</Text>
				</TouchableOpacity>
			</View>
		</Card>
	);

	const renderMemberItem = ({ item }: { item: GroupMember }) => (
		<View style={styles.memberItem}>
			<View style={styles.memberInfo}>
				<View 
					style={[
						styles.memberAvatar, 
						{ backgroundColor: getRoleColor(item.role) }
					]}
				>
					<Text style={styles.avatarText}>
						{item.name.charAt(0).toUpperCase()}
					</Text>
				</View>
				<View style={styles.memberDetails}>
					<Text style={styles.memberName}>{item.name}</Text>
					<Text style={styles.memberEmail}>{item.email}</Text>
					<View 
						style={[
							styles.roleBadge, 
							{ backgroundColor: getRoleColor(item.role) + "20" }
						]}
					>
						<Text 
							style={[
								styles.roleText, 
								{ color: getRoleColor(item.role) }
							]}
						>
							{item.role.charAt(0).toUpperCase() + item.role.slice(1)}
						</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity style={styles.removeButton}>
				<Icon icon="ph:x" size={16} color="#EF4444" />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<H1>Groups</H1>
				<Muted>Manage classes and user groups</Muted>
			</View>

			<View style={styles.actions}>
				<View style={styles.searchContainer}>
					<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search groups..."
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
					<Text style={styles.addButtonText}>Create Group</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.filters}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
					<TouchableOpacity
						style={[
							styles.filterButton,
							selectedGroupType === "all" && styles.activeFilter,
						]}
						onPress={() => setSelectedGroupType("all")}
					>
						<Text
							style={[
								styles.filterText,
								selectedGroupType === "all" && styles.activeFilterText,
							]}
						>
							All Groups
						</Text>
					</TouchableOpacity>
					{(["class", "team", "club", "committee", "other"] as Group["type"][]).map((type) => (
						<TouchableOpacity
							key={type}
							style={[
								styles.filterButton,
								selectedGroupType === type && styles.activeFilter,
								{ backgroundColor: selectedGroupType === type ? getGroupTypeColor(type) : "#F3F4F6" }
							]}
							onPress={() => setSelectedGroupType(type)}
						>
							<Text
								style={[
									styles.filterText,
									selectedGroupType === type && styles.activeFilterText,
								]}
							>
								{type.charAt(0).toUpperCase() + type.slice(1)}s
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#4F46E5" />
				</View>
			) : (
				<FlatList
					data={filteredGroups}
					renderItem={renderGroupItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.groupsList}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Icon icon="ph:users-three" size={48} color="#D1D5DB" />
							<P style={styles.emptyText}>No groups found</P>
						</View>
					}
				/>
			)}

			{/* Create/Edit Group Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={resetForm}
			>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalContent}>
						<H2 style={styles.modalTitle}>
							{editingId ? "Edit Group" : "Create New Group"}
						</H2>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Group Name (required)</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter group name"
								value={newGroup.name}
								onChangeText={(text) => setNewGroup({ ...newGroup, name: text })}
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Description</Text>
							<TextInput
								style={[styles.input, styles.textArea]}
								placeholder="Enter group description"
								value={newGroup.description}
								onChangeText={(text) => setNewGroup({ ...newGroup, description: text })}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Group Type</Text>
							<View style={styles.typeSelector}>
								{(["class", "team", "club", "committee", "other"] as Group["type"][]).map((type) => (
									<TouchableOpacity
										key={type}
										style={[
											styles.typeOption,
											newGroup.type === type && styles.activeTypeOption,
											newGroup.type === type && { backgroundColor: getGroupTypeColor(type) }
										]}
										onPress={() => setNewGroup({ ...newGroup, type })}
									>
										<Text
											style={[
												styles.typeOptionText,
												newGroup.type === type && styles.activeTypeOptionText,
											]}
										>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{newGroup.type === "class" && (
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Class Teacher</Text>
								<TextInput
									style={styles.input}
									placeholder="Enter class teacher's name"
									value={newGroup.classTeacher}
									onChangeText={(text) => setNewGroup({ ...newGroup, classTeacher: text })}
								/>
							</View>
						)}

						<View style={styles.modalActions}>
							<TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.saveButton}
								onPress={handleSaveGroup}
							>
								<Text style={styles.saveButtonText}>
									{editingId ? "Update" : "Create"}
								</Text>
							</TouchableOpacity>
						</View>
					</Card>
				</View>
			</Modal>

			{/* View Members Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={memberModalVisible}
				onRequestClose={() => setMemberModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<Card style={[styles.modalContent, styles.memberModalContent]}>
						{selectedGroup && (
							<>
								<View style={styles.memberModalHeader}>
									<H2>{selectedGroup.name}</H2>
									<View style={styles.memberCount}>
										<Text style={styles.memberCountText}>
											{groupMembers.length} {groupMembers.length === 1 ? "member" : "members"}
										</Text>
									</View>
								</View>

								<View style={styles.memberActions}>
									<TouchableOpacity style={styles.addMemberButton}>
										<Icon icon="ph:plus" size={16} color="#FFFFFF" />
										<Text style={styles.addMemberText}>Add Member</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.messageButton}>
										<Icon icon="ph:chat" size={16} color="#4F46E5" />
										<Text style={styles.messageButtonText}>Message All</Text>
									</TouchableOpacity>
								</View>

								{membersLoading ? (
									<View style={styles.loadingContainer}>
										<ActivityIndicator size="small" color="#4F46E5" />
									</View>
								) : (
									<FlatList
										data={groupMembers}
										renderItem={renderMemberItem}
										keyExtractor={(item) => item.id}
										contentContainerStyle={styles.membersList}
										ListEmptyComponent={
											<View style={styles.emptyMembersState}>
												<Icon icon="ph:users" size={36} color="#D1D5DB" />
												<P style={styles.emptyText}>No members in this group</P>
											</View>
										}
									/>
								)}

								<View style={styles.modalActions}>
									<TouchableOpacity
										style={styles.closeButton}
										onPress={() => setMemberModalVisible(false)}
									>
										<Text style={styles.closeButtonText}>Close</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
					</Card>
				</View>
			</Modal>
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	groupsList: {
		padding: 16,
	},
	groupCard: {
		padding: 16,
		marginBottom: 16,
	},
	groupHeader: {
		flexDirection: "row",
		marginBottom: 16,
	},
	groupTypeIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#F3F4F6",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	groupInfo: {
		flex: 1,
	},
	groupTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	groupTitle: {
		flex: 1,
		marginRight: 8,
	},
	groupTypeBadge: {
		paddingVertical: 2,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	groupTypeText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "500",
	},
	groupDescription: {
		marginBottom: 12,
		color: "#6B7280",
	},
	groupMeta: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	metaText: {
		marginLeft: 4,
		fontSize: 12,
		color: "#6B7280",
	},
	groupActions: {
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
		padding: 24,
	},
	memberModalContent: {
		maxHeight: "80%",
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
		marginRight: 8,
		marginBottom: 8,
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
	memberModalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	memberCount: {
		backgroundColor: "#F3F4F6",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 16,
	},
	memberCountText: {
		fontSize: 12,
		color: "#4B5563",
	},
	memberActions: {
		flexDirection: "row",
		marginBottom: 16,
		gap: 12,
	},
	addMemberButton: {
		flexDirection: "row",
		backgroundColor: "#4F46E5",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		alignItems: "center",
		gap: 4,
	},
	addMemberText: {
		color: "#FFFFFF",
		fontWeight: "500",
		fontSize: 14,
	},
	messageButton: {
		flexDirection: "row",
		backgroundColor: "#EBF5FF",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		alignItems: "center",
		gap: 4,
	},
	messageButtonText: {
		color: "#4F46E5",
		fontWeight: "500",
		fontSize: 14,
	},
	membersList: {
		marginVertical: 8,
	},
	memberItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	memberInfo: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	memberAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#4F46E5",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	avatarText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	memberDetails: {
		flex: 1,
	},
	memberName: {
		fontSize: 14,
		fontWeight: "500",
		color: "#111827",
	},
	memberEmail: {
		fontSize: 12,
		color: "#6B7280",
		marginBottom: 4,
	},
	roleBadge: {
		alignSelf: "flex-start",
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 4,
		backgroundColor: "#EBF5FF",
	},
	roleText: {
		fontSize: 10,
		fontWeight: "500",
		color: "#4F46E5",
	},
	removeButton: {
		padding: 8,
	},
	emptyMembersState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
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
}); 