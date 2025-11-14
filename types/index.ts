export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password (optional for backward compatibility)
  campus: string;
  batchYear: number; // e.g., 2023, 2024
  rollNumber: string; // e.g., "057"
  branch: string; // e.g., "CSE", "DSAI", "ECE"
  branchAcronym: string; // e.g., "bcs", "bds", "bec"
  strongSubjects: string[]; // Subjects they're good at
  weakSubjects: string[]; // Subjects they need help with
  profileComplete: boolean;
  createdAt: string;
  // Enhanced profile fields
  bio?: string;
  profilePicture?: string; // URL to profile picture
  studyGoals?: StudyGoal[];
  achievements?: Achievement[];
  totalStudyHours?: number;
  completedHives?: number;
}

export interface StudyGoal {
  id: string;
  title: string;
  description?: string;
  targetHours?: number;
  currentHours: number;
  targetDate?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Achievement {
  id: string;
  type: 'first_hive' | 'study_streak' | 'hours_milestone' | 'subject_master' | 'helper' | 'organizer';
  title: string;
  description: string;
  icon?: string;
  unlockedAt: string;
}

export interface StudyJamRequest {
  id: string;
  studyJamId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface StudyJam {
  id: string;
  title: string;
  description: string;
  subject: string;
  campus: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
  currentParticipants: number;
  createdBy: string;
  createdAt: string;
  participants: string[];
  requests: string[]; // User IDs who requested to join
  status: 'open' | 'full' | 'completed';
}

export interface StudyJamFormData {
  title: string;
  description: string;
  subject: string;
  campus: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
}

// Messaging types
export interface Message {
  id: string;
  chatId: string; // Group chat ID (studyJamId) or DM chat ID
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  readBy?: string[]; // User IDs who have read this message
}

export interface Chat {
  id: string;
  type: 'group' | 'direct';
  studyJamId?: string; // For group chats
  participants: string[]; // User IDs
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount?: { [userId: string]: number }; // Unread count per user
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string; // User who wrote the review
  revieweeId: string; // User being reviewed
  studyJamId?: string; // Optional: review in context of a study jam
  rating: number; // 1-5 stars
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'join_request' | 'join_approved' | 'review' | 'mention' | 'reminder';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

