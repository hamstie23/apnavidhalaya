import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { H1, H2, H3, Muted, P } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/context/supabase-provider";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  isFromMe: boolean;
  isRead: boolean;
}

export default function ChatScreen() {
  const { session } = useAuth();
  const userEmail = session?.user?.email || "student@example.com";
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Mrs. Garcia",
      role: "Science Teacher",
      avatar: "G",
      lastMessage: "Don't forget about the lab report due next week!",
      lastMessageTime: "10:30 AM",
      unread: 2,
      isOnline: true
    },
    {
      id: "2",
      name: "Mr. Johnson",
      role: "Mathematics Teacher",
      avatar: "J",
      lastMessage: "Let me know if you need help with the homework problems.",
      lastMessageTime: "Yesterday",
      unread: 0,
      isOnline: false
    },
    {
      id: "3",
      name: "Principal Williams",
      role: "School Principal",
      avatar: "W",
      lastMessage: "The parent-teacher meeting is scheduled for next Friday.",
      lastMessageTime: "Sep 15",
      unread: 0,
      isOnline: true
    },
    {
      id: "4",
      name: "Ms. Thompson",
      role: "Art Teacher",
      avatar: "T",
      lastMessage: "Your art project looks promising! Keep up the good work.",
      lastMessageTime: "Sep 12",
      unread: 0,
      isOnline: false
    },
    {
      id: "5",
      name: "Mr. Davis",
      role: "Physical Education",
      avatar: "D",
      lastMessage: "Remember to bring your sports kit for tomorrow's class.",
      lastMessageTime: "Sep 10",
      unread: 0,
      isOnline: true
    }
  ]);
  
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I had a question about the upcoming science project.",
      time: "10:15 AM",
      isFromMe: true,
      isRead: true
    },
    {
      id: "2",
      text: "Of course! What would you like to know?",
      time: "10:20 AM",
      isFromMe: false,
      isRead: true
    },
    {
      id: "3",
      text: "Is it okay if I focus my project on renewable energy sources?",
      time: "10:25 AM",
      isFromMe: true,
      isRead: true
    },
    {
      id: "4",
      text: "That's a great topic! Make sure to include practical applications too.",
      time: "10:28 AM",
      isFromMe: false,
      isRead: true
    },
    {
      id: "5",
      text: "Don't forget about the lab report due next week!",
      time: "10:30 AM",
      isFromMe: false,
      isRead: false
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  
  const handleContactSelect = (contact: Contact) => {
    setActiveContact(contact);
    // Mark messages as read
    if (contact.unread > 0) {
      setContacts(prev => 
        prev.map(c => 
          c.id === contact.id ? { ...c, unread: 0 } : c
        )
      );
      
      setMessages(prev => 
        prev.map(message => 
          !message.isFromMe ? { ...message, isRead: true } : message
        )
      );
    }
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      isRead: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };
  
  const formatInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <H1>Messages</H1>
        <Muted>Chat with teachers and staff</Muted>
      </View>
      
      <View style={styles.chatContainer}>
        <View style={styles.contactsPanel}>
          <View style={styles.searchContainer}>
            <Icon icon="ph:magnifying-glass" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
            />
          </View>
          
          <ScrollView style={styles.contactsList}>
            {contacts.map(contact => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  activeContact?.id === contact.id && styles.activeContactItem
                ]}
                onPress={() => handleContactSelect(contact)}
              >
                <View style={[
                  styles.avatar,
                  activeContact?.id === contact.id ? styles.activeAvatar : {}
                ]}>
                  <P style={[
                    styles.avatarText,
                    activeContact?.id === contact.id && styles.activeAvatarText
                  ]}>{formatInitials(contact.name)}</P>
                  {contact.isOnline && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                
                <View style={styles.contactInfo}>
                  <View style={styles.contactHeader}>
                    <H3 style={[
                      styles.contactName,
                      activeContact?.id === contact.id && styles.activeContactText
                    ]}>{contact.name}</H3>
                    <P style={styles.contactTime}>{contact.lastMessageTime}</P>
                  </View>
                  
                  <View style={styles.contactSubheader}>
                    <Muted style={[
                      styles.contactRole,
                      activeContact?.id === contact.id && styles.activeContactText
                    ]}>{contact.role}</Muted>
                    
                    {contact.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <P style={styles.unreadText}>{contact.unread}</P>
                      </View>
                    )}
                  </View>
                  
                  <P numberOfLines={1} style={[
                    styles.contactLastMessage,
                    activeContact?.id === contact.id && styles.activeContactText
                  ]}>
                    {contact.lastMessage}
                  </P>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.chatPanel}>
          {activeContact ? (
            <>
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderUser}>
                  <View style={styles.chatAvatar}>
                    <P style={styles.chatAvatarText}>{formatInitials(activeContact.name)}</P>
                    {activeContact.isOnline && (
                      <View style={styles.chatOnlineIndicator} />
                    )}
                  </View>
                  
                  <View>
                    <H3 style={styles.chatName}>{activeContact.name}</H3>
                    <Muted style={styles.chatStatus}>
                      {activeContact.isOnline ? "Online" : "Offline"}
                    </Muted>
                  </View>
                </View>
                
                <View style={styles.chatActions}>
                  <TouchableOpacity style={styles.chatAction}>
                    <Icon icon="ph:video-camera" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.chatAction}>
                    <Icon icon="ph:phone" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {messages.map(message => (
                  <View 
                    key={message.id} 
                    style={[
                      styles.messageWrapper,
                      message.isFromMe ? styles.myMessageWrapper : styles.theirMessageWrapper
                    ]}
                  >
                    <View 
                      style={[
                        styles.messageBubble,
                        message.isFromMe ? styles.myMessageBubble : styles.theirMessageBubble
                      ]}
                    >
                      <P style={[
                        styles.messageText,
                        message.isFromMe ? styles.myMessageText : styles.theirMessageText
                      ]}>{message.text}</P>
                    </View>
                    
                    <View style={styles.messageInfo}>
                      <P style={styles.messageTime}>{message.time}</P>
                      {message.isFromMe && (
                        <Icon 
                          icon={message.isRead ? "ph:check-circle" : "ph:check"} 
                          size={14} 
                          color={message.isRead ? "#10B981" : "#9CA3AF"} 
                        />
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.messageInputContainer}
              >
                <View style={styles.messageInputWrapper}>
                  <TextInput
                    style={styles.messageInput}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                  />
                  
                  <TouchableOpacity style={styles.messageActions}>
                    <Icon icon="ph:paperclip" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    newMessage.trim() === "" ? styles.sendButtonDisabled : {}
                  ]}
                  onPress={handleSendMessage}
                  disabled={newMessage.trim() === ""}
                >
                  <Icon 
                    icon="ph:paper-plane-right" 
                    size={20} 
                    color={newMessage.trim() === "" ? "#9CA3AF" : "#FFFFFF"} 
                  />
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </>
          ) : (
            <View style={styles.noChatSelected}>
              <Icon icon="ph:chat-centered-text" size={64} color="#D1D5DB" />
              <H2 style={styles.noChatTitle}>No conversation selected</H2>
              <Muted style={styles.noChatSubtitle}>
                Select a contact from the left to start chatting
              </Muted>
            </View>
          )}
        </View>
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chatContainer: {
    flex: 1,
    flexDirection: "row",
  },
  contactsPanel: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activeContactItem: {
    backgroundColor: "#4F46E5",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    position: "relative",
  },
  activeAvatar: {
    backgroundColor: "#FFFFFF",
  },
  avatarText: {
    fontWeight: "600",
    color: "#4B5563",
  },
  activeAvatarText: {
    color: "#4F46E5",
  },
  onlineIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    bottom: 0,
    right: 0,
  },
  contactInfo: {
    flex: 1,
    justifyContent: "center",
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  contactName: {
    fontSize: 16,
    color: "#1F2937",
  },
  contactTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  contactSubheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  contactRole: {
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: "#4F46E5",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  contactLastMessage: {
    fontSize: 13,
    color: "#6B7280",
  },
  activeContactText: {
    color: "#FFFFFF",
  },
  chatPanel: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  noChatSelected: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  noChatTitle: {
    marginTop: 16,
    color: "#4B5563",
  },
  noChatSubtitle: {
    marginTop: 8,
    textAlign: "center",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chatHeaderUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    position: "relative",
  },
  chatAvatarText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chatOnlineIndicator: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    bottom: 0,
    right: 0,
  },
  chatName: {
    fontSize: 16,
    color: "#1F2937",
  },
  chatStatus: {
    fontSize: 12,
  },
  chatActions: {
    flexDirection: "row",
  },
  chatAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  myMessageWrapper: {
    alignSelf: "flex-end",
  },
  theirMessageWrapper: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: "#4F46E5",
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  theirMessageText: {
    color: "#1F2937",
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 4,
  },
  messageInputContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  messageInputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    maxHeight: 80,
    fontSize: 14,
  },
  messageActions: {
    padding: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
}); 