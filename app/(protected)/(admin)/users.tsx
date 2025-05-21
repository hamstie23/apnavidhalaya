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

type UserRole = "admin" | "teacher" | "parent" | "student";

interface User {
	id: string;
	email: string;
	role: UserRole;
	name?: string;
	createdAt: string;
	lastActive?: string;
}

export default function UsersManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
	const [modalVisible, setModalVisible] = useState(false);
	const [newUser, setNewUser] = useState({
		email: "",
		password: "",
		name: "",
		role: "student" as UserRole,
	});

	// Mock data for demonstration
	const mockUsers: User[] = [
		{
			id: "1",
			email: "admin@school.com",
			role: "admin",
			name: "Admin User",
			createdAt: "2023-05-10",
			lastActive: "2023-05-21",
		},
		{
			id: "2",
			email: "teacher1@school.com",
			role: "teacher",
			name: "John Smith",
			createdAt: "2023-05-12",
			lastActive: "2023-05-20",
		},
		{
			id: "3",
			email: "teacher2@school.com",
			role: "teacher",
			name: "Maria Garcia",
			createdAt: "2023-05-15",
			lastActive: "2023-05-21",
		},
		{
			id: "4",
			email: "parent1@example.com",
			role: "parent",
			name: "Robert Johnson",
			createdAt: "2023-05-05",
			lastActive: "2023-05-18",
		},
		{
			id: "5",
			email: "parent2@example.com",
			role: "parent",
			name: "Sarah Williams",
			createdAt: "2023-05-08",
			lastActive: "2023-05-19",
		},
		{
			id: "6",
			email: "student1@example.com",
			role: "student",
			name: "James Brown",
			createdAt: "2023-05-10",
			lastActive: "2023-05-20",
		},
	];

	// In a real app, this would fetch users from Supabase
	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			// In a real implementation, fetch from Supabase
			// const { data, error } = await supabase.from('profiles').select('*');

			// Using mock data for now
			setUsers(mockUsers);
			setFilteredUsers(mockUsers);
			setLoading(false);
		};

		fetchUsers();
	}, []);

	// Filter users based on search and role filter
	useEffect(() => {
		let result = users;

		if (searchQuery) {
			result = result.filter(
				(user) =>
					user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.email.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		if (selectedRole !== "all") {
			result = result.filter((user) => user.role === selectedRole);
		}

		setFilteredUsers(result);
	}, [searchQuery, selectedRole, users]);

	const handleAddUser = () => {
		// In a real app, this would create a new user in Supabase Auth and add a profile
		if (!newUser.email || !newUser.password || !newUser.role) {
			Alert.alert("Error", "Please fill all required fields");
			return;
		}

		// Mock adding a user
		const newUserId = (users.length + 1).toString();
		const createdUser: User = {
			id: newUserId,
			email: newUser.email,
			name: newUser.name,
			role: newUser.role,
			createdAt: new Date().toISOString().split("T")[0],
		};

		setUsers([...users, createdUser]);
		setModalVisible(false);
		setNewUser({
			email: "",
			password: "",
			name: "",
			role: "student",
		});
	};

	const handleDeleteUser = (userId: string) => {
		// In a real app, this would delete the user from Supabase Auth
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this user?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: () => {
						// Mock deletion
						const updatedUsers = users.filter((user) => user.id !== userId);
						setUsers(updatedUsers);
					},
					style: "destructive",
				},
			],
		);
	};

	const renderUserItem = ({ item }: { item: User }) => (
		<Card style={styles.userCard}>
			<View style={styles.userInfo}>
				<View style={styles.userAvatar}>
					<Text style={styles.avatarText}>
						{item.name
							? item.name.charAt(0).toUpperCase()
							: item.email.charAt(0).toUpperCase()}
					</Text>
				</View>
				<View style={styles.userDetails}>
					<H3 style={styles.userName}>{item.name || "Unnamed User"}</H3>
					<P>{item.email}</P>
					<View style={styles.roleBadge}>
						<Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
					</View>
				</View>
			</View>
			<View style={styles.userActions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => {
						/* Edit user functionality */
					}}
				>
					<Icon icon="ph:pencil" size={20} color="#6B7280" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => handleDeleteUser(item.id)}
				>
					<Icon icon="ph:trash" size={20} color="#EF4444" />
				</TouchableOpacity>
			</View>
		</Card>
	);

	const renderRoleFilter = (role: UserRole | "all", label: string) => (
		<TouchableOpacity
			style={[
				styles.filterButton,
				selectedRole === role && styles.activeFilter,
			]}
			onPress={() => setSelectedRole(role)}
		>
			<Text
				style={[
					styles.filterText,
					selectedRole === role && styles.activeFilterText,
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<H1>User Management</H1>
				<Muted>Manage all users of the platform</Muted>
			</View>

			<View style={styles.actions}>
				<View style={styles.searchContainer}>
					<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search users..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setModalVisible(true)}
				>
					<Icon icon="ph:plus" size={20} color="#FFFFFF" />
					<Text style={styles.addButtonText}>Add User</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.filters}>
				{renderRoleFilter("all", "All Users")}
				{renderRoleFilter("admin", "Admins")}
				{renderRoleFilter("teacher", "Teachers")}
				{renderRoleFilter("parent", "Parents")}
				{renderRoleFilter("student", "Students")}
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#4F46E5" />
				</View>
			) : (
				<FlatList
					data={filteredUsers}
					renderItem={renderUserItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.usersList}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Icon icon="ph:users" size={48} color="#D1D5DB" />
							<P style={styles.emptyText}>No users found</P>
						</View>
					}
				/>
			)}

			{/* Add User Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalContent}>
						<H2 style={styles.modalTitle}>Add New User</H2>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Email (required)</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter email address"
								value={newUser.email}
								onChangeText={(text) => setNewUser({ ...newUser, email: text })}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Password (required)</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter password"
								value={newUser.password}
								onChangeText={(text) =>
									setNewUser({ ...newUser, password: text })
								}
								secureTextEntry
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Name</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter full name"
								value={newUser.name}
								onChangeText={(text) => setNewUser({ ...newUser, name: text })}
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Role (required)</Text>
							<View style={styles.roleSelector}>
								{(["admin", "teacher", "parent", "student"] as UserRole[]).map(
									(role) => (
										<TouchableOpacity
											key={role}
											style={[
												styles.roleOption,
												newUser.role === role && styles.activeRoleOption,
											]}
											onPress={() => setNewUser({ ...newUser, role })}
										>
											<Text
												style={[
													styles.roleOptionText,
													newUser.role === role && styles.activeRoleOptionText,
												]}
											>
												{role.charAt(0).toUpperCase() + role.slice(1)}
											</Text>
										</TouchableOpacity>
									),
								)}
							</View>
						</View>

						<View style={styles.modalActions}>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.createButton}
								onPress={handleAddUser}
							>
								<Text style={styles.createButtonText}>Create User</Text>
							</TouchableOpacity>
						</View>
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
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingBottom: 16,
		gap: 8,
		flexWrap: "wrap",
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
	usersList: {
		padding: 16,
	},
	userCard: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		marginBottom: 12,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	userAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#4F46E5",
		justifyContent: "center",
		alignItems: "center",
	},
	avatarText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	userDetails: {
		marginLeft: 16,
	},
	userName: {
		fontSize: 16,
		marginBottom: 4,
	},
	roleBadge: {
		backgroundColor: "#F3F4F6",
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
		marginTop: 4,
		alignSelf: "flex-start",
	},
	roleText: {
		fontSize: 12,
		color: "#4B5563",
		fontWeight: "500",
	},
	userActions: {
		flexDirection: "row",
		gap: 12,
	},
	actionButton: {
		padding: 8,
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
	roleSelector: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	roleOption: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: "#F3F4F6",
	},
	activeRoleOption: {
		backgroundColor: "#4F46E5",
	},
	roleOptionText: {
		color: "#4B5563",
	},
	activeRoleOptionText: {
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
	createButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: "#4F46E5",
	},
	createButtonText: {
		color: "#FFFFFF",
		fontWeight: "500",
	},
});
