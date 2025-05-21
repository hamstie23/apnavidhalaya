import React, { useState, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
	Text,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { H1, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/context/supabase-provider";

interface ChatRoom {
	id: string;
	name: string;
	type: "private" | "group";
	lastMessage?: string;
	lastMessageTime?: string;
	unreadCount: number;
	participants: ChatParticipant[];
	isActive: boolean;
}

interface ChatParticipant {
	id: string;
	name: string;
	avatar?: string;
	role: "admin" | "teacher" | "parent" | "student";
	isOnline: boolean;
	lastActive?: string;
}

interface ChatMessage {
	id: string;
	roomId: string;
	senderId: string;
	senderName: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	attachments?: { name: string; url: string; type: string }[];
}

export default function ChatManagement() {
	const { session } = useAuth();
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
	const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
	const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [newMessage, setNewMessage] = useState("");
	const messageListRef = useRef<FlatList>(null);

	// Mock data for demonstration
	const mockChatRooms: ChatRoom[] = [
		{
			id: "1",
			name: "Class 10-A Group",
			type: "group",
			lastMessage: "Quiz tomorrow. Please prepare!",
			lastMessageTime: "10:30 AM",
			unreadCount: 2,
			participants: [
				{
					id: "p1",
					name: "Admin User",
					role: "admin",
					isOnline: true,
				},
				{
					id: "p2",
					name: "John Smith",
					role: "teacher",
					isOnline: true,
					lastActive: "10 min ago",
				},
				{
					id: "p3",
					name: "Sarah Williams",
					role: "parent",
					isOnline: false,
					lastActive: "2 hours ago",
				},
			],
			isActive: true,
		},
		{
			id: "2",
			name: "John Smith",
			type: "private",
			lastMessage: "Can we discuss the syllabus?",
			lastMessageTime: "Yesterday",
			unreadCount: 0,
			participants: [
				{
					id: "p1",
					name: "Admin User",
					role: "admin",
					isOnline: true,
				},
				{
					id: "p2",
					name: "John Smith",
					role: "teacher",
					isOnline: true,
					lastActive: "10 min ago",
				},
			],
			isActive: true,
		},
		{
			id: "3",
			name: "Parent-Teacher Committee",
			type: "group",
			lastMessage: "Next meeting is on Friday",
			lastMessageTime: "Yesterday",
			unreadCount: 5,
			participants: [
				{
					id: "p1",
					name: "Admin User",
					role: "admin",
					isOnline: true,
				},
				{
					id: "p2",
					name: "John Smith",
					role: "teacher",
					isOnline: true,
				},
				{
					id: "p3",
					name: "Sarah Williams",
					role: "parent",
					isOnline: false,
					lastActive: "2 hours ago",
				},
				{
					id: "p4",
					name: "Robert Johnson",
					role: "parent",
					isOnline: false,
					lastActive: "1 day ago",
				},
			],
			isActive: true,
		},
		{
			id: "4",
			name: "Alice Johnson",
			type: "private",
			lastMessage: "Thank you for your help!",
			lastMessageTime: "2 days ago",
			unreadCount: 0,
			participants: [
				{
					id: "p1",
					name: "Admin User",
					role: "admin",
					isOnline: true,
				},
				{
					id: "p5",
					name: "Alice Johnson",
					role: "student",
					isOnline: false,
					lastActive: "3 hours ago",
				},
			],
			isActive: true,
		},
	];

	// Mock messages for room 1
	const mockMessages: Record<string, ChatMessage[]> = {
		"1": [
			{
				id: "m1",
				roomId: "1",
				senderId: "p2",
				senderName: "John Smith",
				message: "Hello everyone! The quiz on chapter 5 will be held tomorrow.",
				timestamp: "10:30 AM",
				isRead: true,
			},
			{
				id: "m2",
				roomId: "1",
				senderId: "p2",
				senderName: "John Smith",
				message:
					"Please prepare well. The quiz will cover topics from pages 50-70.",
				timestamp: "10:31 AM",
				isRead: true,
			},
			{
				id: "m3",
				roomId: "1",
				senderId: "p3",
				senderName: "Sarah Williams",
				message: "Will the quiz also include the practical exercises?",
				timestamp: "10:45 AM",
				isRead: true,
			},
			{
				id: "m4",
				roomId: "1",
				senderId: "p2",
				senderName: "John Smith",
				message:
					"Yes, it will include some questions based on the practical exercises we did last week.",
				timestamp: "11:00 AM",
				isRead: false,
			},
			{
				id: "m5",
				roomId: "1",
				senderId: "p2",
				senderName: "John Smith",
				message: "I've also uploaded some reference materials.",
				timestamp: "11:01 AM",
				isRead: false,
				attachments: [
					{
						name: "study_guide.pdf",
						url: "https://example.com/study_guide.pdf",
						type: "document",
					},
				],
			},
		],
	};

	// In a real app, this would fetch chat rooms from Supabase
	useEffect(() => {
		const fetchChatRooms = async () => {
			setLoading(true);
			// In a real implementation, fetch from Supabase
			// const { data, error } = await supabase.from('chat_rooms').select('*');

			// Using mock data for now
			setChatRooms(mockChatRooms);
			setFilteredRooms(mockChatRooms);
			setLoading(false);
		};

		fetchChatRooms();
	}, []);

	// Filter chat rooms based on search
	useEffect(() => {
		if (searchQuery) {
			const filtered = chatRooms.filter((room) =>
				room.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);
			setFilteredRooms(filtered);
		} else {
			setFilteredRooms(chatRooms);
		}
	}, [searchQuery, chatRooms]);

	// Load messages when room is selected
	useEffect(() => {
		if (selectedRoom) {
			setLoadingMessages(true);

			// Simulate API call
			setTimeout(() => {
				// In a real app, fetch from Supabase
				// const { data, error } = await supabase.from('messages')
				//   .select('*')
				//   .eq('roomId', selectedRoom.id)
				//   .order('timestamp', { ascending: true });

				// Using mock data for now
				const roomMessages = mockMessages[selectedRoom.id] || [];
				setMessages(roomMessages);
				setLoadingMessages(false);

				// Mark unread messages as read
				const updatedRooms = chatRooms.map((room) => {
					if (room.id === selectedRoom.id) {
						return { ...room, unreadCount: 0 };
					}
					return room;
				});

				setChatRooms(updatedRooms);
				setFilteredRooms(
					filteredRooms.map((room) => {
						if (room.id === selectedRoom.id) {
							return { ...room, unreadCount: 0 };
						}
						return room;
					}),
				);

				// Scroll to bottom of message list
				setTimeout(() => {
					messageListRef.current?.scrollToEnd({ animated: true });
				}, 100);
			}, 500);
		}
	}, [selectedRoom]);

	const handleSendMessage = () => {
		if (!newMessage.trim() || !selectedRoom) return;

		const newMsg: ChatMessage = {
			id: `m${messages.length + 1}`,
			roomId: selectedRoom.id,
			senderId: "p1", // Admin user
			senderName: "Admin User",
			message: newMessage.trim(),
			timestamp: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			isRead: false,
		};

		setMessages([...messages, newMsg]);
		setNewMessage("");

		// Update last message in rooms list
		const updatedRooms = chatRooms.map((room) => {
			if (room.id === selectedRoom.id) {
				return {
					...room,
					lastMessage: newMessage.trim(),
					lastMessageTime: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
				};
			}
			return room;
		});

		setChatRooms(updatedRooms);
		setFilteredRooms(
			filteredRooms.map((room) => {
				if (room.id === selectedRoom.id) {
					return {
						...room,
						lastMessage: newMessage.trim(),
						lastMessageTime: new Date().toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
					};
				}
				return room;
			}),
		);

		// Scroll to bottom of message list
		setTimeout(() => {
			messageListRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	const getRoleColor = (role: ChatParticipant["role"]) => {
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

	const renderChatRoomItem = ({ item }: { item: ChatRoom }) => (
		<TouchableOpacity
			style={[
				styles.roomItem,
				selectedRoom?.id === item.id && styles.activeRoomItem,
			]}
			onPress={() => setSelectedRoom(item)}
		>
			<View style={styles.roomItemContent}>
				{item.type === "private" ? (
					<View style={styles.userAvatar}>
						<Text style={styles.avatarText}>
							{item.name.charAt(0).toUpperCase()}
						</Text>
						{item.participants.find((p) => p.id !== "p1")?.isOnline && (
							<View style={styles.onlineIndicator} />
						)}
					</View>
				) : (
					<View style={styles.groupAvatar}>
						<Icon icon="ph:users-three" size={24} color="#FFFFFF" />
					</View>
				)}
				<View style={styles.roomDetails}>
					<View style={styles.roomHeader}>
						<Text
							style={[
								styles.roomName,
								selectedRoom?.id === item.id && styles.activeRoomName,
							]}
							numberOfLines={1}
						>
							{item.name}
						</Text>
						<Text style={styles.timeText}>{item.lastMessageTime}</Text>
					</View>
					<View style={styles.lastMessageRow}>
						<Text style={styles.lastMessage} numberOfLines={1}>
							{item.lastMessage || "No messages yet"}
						</Text>
						{item.unreadCount > 0 && (
							<View style={styles.unreadBadge}>
								<Text style={styles.unreadCount}>{item.unreadCount}</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderChatMessage = ({ item }: { item: ChatMessage }) => {
		const isOwnMessage = item.senderId === "p1"; // Admin user

		return (
			<View
				style={[
					styles.messageContainer,
					isOwnMessage
						? styles.ownMessageContainer
						: styles.otherMessageContainer,
				]}
			>
				{!isOwnMessage && (
					<View style={styles.messageSenderAvatar}>
						<Text style={styles.messageSenderAvatarText}>
							{item.senderName.charAt(0).toUpperCase()}
						</Text>
					</View>
				)}
				<View
					style={[
						styles.messageContent,
						isOwnMessage
							? styles.ownMessageContent
							: styles.otherMessageContent,
					]}
				>
					{!isOwnMessage && (
						<Text style={styles.messageSenderName}>{item.senderName}</Text>
					)}
					<Text style={styles.messageText}>{item.message}</Text>
					{item.attachments && item.attachments.length > 0 && (
						<View style={styles.attachmentContainer}>
							{item.attachments.map((attachment, index) => (
								<TouchableOpacity key={index} style={styles.attachment}>
									<Icon icon="ph:file-pdf" size={20} color="#4F46E5" />
									<Text style={styles.attachmentName}>{attachment.name}</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
					<Text style={styles.messageTime}>{item.timestamp}</Text>
				</View>
			</View>
		);
	};

	const renderChatRoomHeader = () => {
		if (!selectedRoom) return null;

		return (
			<View style={styles.chatRoomHeader}>
				{selectedRoom.type === "private" ? (
					<View style={styles.privateChatHeader}>
						<View style={styles.userAvatarLarge}>
							<Text style={styles.avatarTextLarge}>
								{selectedRoom.name.charAt(0).toUpperCase()}
							</Text>
							{selectedRoom.participants.find((p) => p.id !== "p1")
								?.isOnline && <View style={styles.onlineIndicatorLarge} />}
						</View>
						<View style={styles.roomHeaderInfo}>
							<Text style={styles.roomHeaderName}>{selectedRoom.name}</Text>
							<Text style={styles.roomHeaderStatus}>
								{selectedRoom.participants.find((p) => p.id !== "p1")?.isOnline
									? "Online"
									: `Last active ${
											selectedRoom.participants.find((p) => p.id !== "p1")
												?.lastActive || "recently"
										}`}
							</Text>
						</View>
					</View>
				) : (
					<View style={styles.groupChatHeader}>
						<View style={styles.groupAvatarLarge}>
							<Icon icon="ph:users-three" size={28} color="#FFFFFF" />
						</View>
						<View style={styles.roomHeaderInfo}>
							<Text style={styles.roomHeaderName}>{selectedRoom.name}</Text>
							<Text style={styles.roomHeaderStatus}>
								{selectedRoom.participants.length} participants •
								{selectedRoom.participants.filter((p) => p.isOnline).length}{" "}
								online
							</Text>
						</View>
					</View>
				)}
				<View style={styles.chatActions}>
					<TouchableOpacity style={styles.chatAction}>
						<Icon icon="ph:phone" size={20} color="#4F46E5" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.chatAction}>
						<Icon icon="ph:video-camera" size={20} color="#4F46E5" />
					</TouchableOpacity>
					<TouchableOpacity style={styles.chatAction}>
						<Icon icon="ph:info" size={20} color="#4F46E5" />
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<H1>Chat</H1>
				<Muted>Communicate with teachers, parents, and students</Muted>
			</View>

			<View style={styles.chatContainer}>
				<View style={styles.sidebar}>
					<View style={styles.searchContainer}>
						<Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
						<TextInput
							style={styles.searchInput}
							placeholder="Search conversations..."
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
					</View>
					<TouchableOpacity style={styles.newChatButton}>
						<Icon icon="ph:plus" size={20} color="#FFFFFF" />
						<Text style={styles.newChatButtonText}>New Chat</Text>
					</TouchableOpacity>
					{loading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="small" color="#4F46E5" />
						</View>
					) : (
						<FlatList
							data={filteredRooms}
							renderItem={renderChatRoomItem}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.roomsList}
							ListEmptyComponent={
								<View style={styles.emptyState}>
									<Icon icon="ph:chat-circle" size={36} color="#D1D5DB" />
									<P style={styles.emptyText}>No conversations found</P>
								</View>
							}
						/>
					)}
				</View>

				<Card style={styles.chatArea}>
					{selectedRoom ? (
						<>
							{renderChatRoomHeader()}
							<View style={styles.messagesContainer}>
								{loadingMessages ? (
									<View style={styles.loadingContainer}>
										<ActivityIndicator size="small" color="#4F46E5" />
									</View>
								) : (
									<FlatList
										ref={messageListRef}
										data={messages}
										renderItem={renderChatMessage}
										keyExtractor={(item) => item.id}
										contentContainerStyle={styles.messagesList}
										ListEmptyComponent={
											<View style={styles.emptyMessagesState}>
												<Icon icon="ph:chat-circle" size={48} color="#D1D5DB" />
												<P style={styles.emptyText}>No messages yet</P>
												<P style={styles.emptyChatHint}>
													Send a message to start the conversation
												</P>
											</View>
										}
									/>
								)}
							</View>
							<KeyboardAvoidingView
								behavior={Platform.OS === "ios" ? "padding" : "height"}
								keyboardVerticalOffset={100}
								style={styles.inputContainer}
							>
								<TouchableOpacity style={styles.attachButton}>
									<Icon icon="ph:paperclip" size={20} color="#6B7280" />
								</TouchableOpacity>
								<TextInput
									style={styles.messageInput}
									placeholder="Type a message..."
									value={newMessage}
									onChangeText={setNewMessage}
									multiline
								/>
								<TouchableOpacity
									style={[
										styles.sendButton,
										!newMessage.trim() && styles.sendButtonDisabled,
									]}
									disabled={!newMessage.trim()}
									onPress={handleSendMessage}
								>
									<Icon
										icon="ph:paper-plane-right"
										size={20}
										color={newMessage.trim() ? "#FFFFFF" : "#A1A1AA"}
									/>
								</TouchableOpacity>
							</KeyboardAvoidingView>
						</>
					) : (
						<View style={styles.noChatSelectedState}>
							<Icon icon="ph:chat-centered-text" size={64} color="#D1D5DB" />
							<H3 style={styles.noChatTitle}>Select a conversation</H3>
							<P style={styles.noChatText}>
								Choose a conversation from the sidebar or start a new chat
							</P>
						</View>
					)}
				</Card>
			</View>
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
	chatContainer: {
		flex: 1,
		flexDirection: "row",
		padding: 16,
		gap: 16,
	},
	sidebar: {
		width: 320,
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	searchContainer: {
		flexDirection: "row",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
		alignItems: "center",
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 14,
	},
	newChatButton: {
		flexDirection: "row",
		backgroundColor: "#4F46E5",
		margin: 12,
		padding: 10,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	newChatButtonText: {
		color: "#FFFFFF",
		fontWeight: "500",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	roomsList: {
		paddingVertical: 8,
	},
	roomItem: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	activeRoomItem: {
		backgroundColor: "#F3F4F6",
	},
	roomItemContent: {
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
		marginRight: 12,
	},
	avatarText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	onlineIndicator: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: "#10B981",
		borderWidth: 2,
		borderColor: "#FFFFFF",
		position: "absolute",
		bottom: 0,
		right: 0,
	},
	groupAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#6366F1",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	roomDetails: {
		flex: 1,
	},
	roomHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	roomName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#111827",
		flex: 1,
	},
	activeRoomName: {
		color: "#4F46E5",
	},
	timeText: {
		fontSize: 12,
		color: "#6B7280",
	},
	lastMessageRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	lastMessage: {
		fontSize: 13,
		color: "#6B7280",
		flex: 1,
		marginRight: 8,
	},
	unreadBadge: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: "#4F46E5",
		justifyContent: "center",
		alignItems: "center",
	},
	unreadCount: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	emptyText: {
		marginTop: 8,
		color: "#9CA3AF",
		textAlign: "center",
	},
	chatArea: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		display: "flex",
		flexDirection: "column",
		overflow: "hidden",
	},
	chatRoomHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	privateChatHeader: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	userAvatarLarge: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#4F46E5",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	avatarTextLarge: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	onlineIndicatorLarge: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: "#10B981",
		borderWidth: 2,
		borderColor: "#FFFFFF",
		position: "absolute",
		bottom: 0,
		right: 0,
	},
	groupChatHeader: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	groupAvatarLarge: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#6366F1",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	roomHeaderInfo: {
		flex: 1,
	},
	roomHeaderName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 2,
	},
	roomHeaderStatus: {
		fontSize: 13,
		color: "#6B7280",
	},
	chatActions: {
		flexDirection: "row",
		alignItems: "center",
	},
	chatAction: {
		padding: 8,
		marginLeft: 8,
	},
	messagesContainer: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
	messagesList: {
		padding: 16,
	},
	messageContainer: {
		flexDirection: "row",
		marginBottom: 16,
		maxWidth: "80%",
	},
	ownMessageContainer: {
		alignSelf: "flex-end",
		justifyContent: "flex-end",
	},
	otherMessageContainer: {
		alignSelf: "flex-start",
	},
	messageSenderAvatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#6366F1",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
		alignSelf: "flex-end",
	},
	messageSenderAvatarText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
	messageContent: {
		padding: 12,
		borderRadius: 16,
		maxWidth: "100%",
	},
	ownMessageContent: {
		backgroundColor: "#4F46E5",
		borderBottomRightRadius: 4,
	},
	otherMessageContent: {
		backgroundColor: "#FFFFFF",
		borderBottomLeftRadius: 4,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	messageSenderName: {
		fontSize: 13,
		fontWeight: "600",
		color: "#4F46E5",
		marginBottom: 4,
	},
	messageText: {
		fontSize: 14,
		lineHeight: 20,
	},
	attachmentContainer: {
		marginTop: 8,
	},
	attachment: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F3F4F6",
		padding: 8,
		borderRadius: 6,
		marginTop: 4,
	},
	attachmentName: {
		fontSize: 13,
		color: "#4B5563",
		marginLeft: 8,
	},
	messageTime: {
		fontSize: 11,
		color: "#9CA3AF",
		alignSelf: "flex-end",
		marginTop: 4,
	},
	emptyMessagesState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 48,
	},
	emptyChatHint: {
		color: "#9CA3AF",
		marginTop: 8,
		textAlign: "center",
	},
	inputContainer: {
		flexDirection: "row",
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: "#F3F4F6",
		alignItems: "center",
	},
	attachButton: {
		padding: 8,
	},
	messageInput: {
		flex: 1,
		backgroundColor: "#F3F4F6",
		borderRadius: 24,
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginHorizontal: 8,
		maxHeight: 120,
		fontSize: 14,
	},
	sendButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#4F46E5",
		justifyContent: "center",
		alignItems: "center",
	},
	sendButtonDisabled: {
		backgroundColor: "#E5E7EB",
	},
	noChatSelectedState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	noChatTitle: {
		marginTop: 16,
		color: "#111827",
	},
	noChatText: {
		color: "#6B7280",
		marginTop: 8,
		textAlign: "center",
	},
});
