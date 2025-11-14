import { StudyJam, User, Message, Chat, Review, Notification } from '@/types';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const studyJamsFile = path.join(dataDir, 'study-jams.json');
const usersFile = path.join(dataDir, 'users.json');
const messagesFile = path.join(dataDir, 'messages.json');
const chatsFile = path.join(dataDir, 'chats.json');
const reviewsFile = path.join(dataDir, 'reviews.json');
const notificationsFile = path.join(dataDir, 'notifications.json');

// Ensure data directory and files exist
function ensureDataFiles() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(studyJamsFile)) {
      fs.writeFileSync(studyJamsFile, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(messagesFile)) {
      fs.writeFileSync(messagesFile, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(chatsFile)) {
      fs.writeFileSync(chatsFile, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(reviewsFile)) {
      fs.writeFileSync(reviewsFile, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(notificationsFile)) {
      fs.writeFileSync(notificationsFile, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Initialize on first import
ensureDataFiles();

export function getStudyJams(): StudyJam[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(studyJamsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading study jams:', error);
    return [];
  }
}

export function saveStudyJams(jams: StudyJam[]): void {
  try {
    ensureDataFiles();
    fs.writeFileSync(studyJamsFile, JSON.stringify(jams, null, 2));
  } catch (error) {
    console.error('Error saving study jams:', error);
    throw error;
  }
}

export function getUsers(): User[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

export function saveUsers(users: User[]): void {
  try {
    ensureDataFiles();
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function createUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
}

export function getStudyJamById(id: string): StudyJam | undefined {
  const jams = getStudyJams();
  return jams.find(jam => jam.id === id);
}

export function createStudyJam(jam: StudyJam): void {
  const jams = getStudyJams();
  jams.push(jam);
  saveStudyJams(jams);
}

export function updateStudyJam(id: string, updates: Partial<StudyJam>): void {
  const jams = getStudyJams();
  const index = jams.findIndex(jam => jam.id === id);
  if (index !== -1) {
    jams[index] = { ...jams[index], ...updates };
    saveStudyJams(jams);
  }
}

export function deleteStudyJam(id: string): void {
  const jams = getStudyJams();
  const filtered = jams.filter(jam => jam.id !== id);
  saveStudyJams(filtered);
}

// Messages
export function getMessages(): Message[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(messagesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
}

export function saveMessages(messages: Message[]): void {
  try {
    ensureDataFiles();
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
    throw error;
  }
}

export function getMessagesByChatId(chatId: string): Message[] {
  const messages = getMessages();
  return messages.filter(msg => msg.chatId === chatId).sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function createMessage(message: Message): void {
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
}

// Chats
export function getChats(): Chat[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(chatsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chats:', error);
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  try {
    ensureDataFiles();
    fs.writeFileSync(chatsFile, JSON.stringify(chats, null, 2));
  } catch (error) {
    console.error('Error saving chats:', error);
    throw error;
  }
}

export function getChatById(id: string): Chat | undefined {
  const chats = getChats();
  return chats.find(chat => chat.id === id);
}

export function getChatByStudyJamId(studyJamId: string): Chat | undefined {
  const chats = getChats();
  return chats.find(chat => chat.type === 'group' && chat.studyJamId === studyJamId);
}

export function getDirectChat(userId1: string, userId2: string): Chat | undefined {
  const chats = getChats();
  return chats.find(chat => 
    chat.type === 'direct' && 
    chat.participants.includes(userId1) && 
    chat.participants.includes(userId2) &&
    chat.participants.length === 2
  );
}

export function getUserChats(userId: string): Chat[] {
  const chats = getChats();
  return chats.filter(chat => chat.participants.includes(userId));
}

export function createChat(chat: Chat): void {
  const chats = getChats();
  chats.push(chat);
  saveChats(chats);
}

export function updateChat(id: string, updates: Partial<Chat>): void {
  const chats = getChats();
  const index = chats.findIndex(chat => chat.id === id);
  if (index !== -1) {
    chats[index] = { ...chats[index], ...updates };
    saveChats(chats);
  }
}

// Reviews
export function getReviews(): Review[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(reviewsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

export function saveReviews(reviews: Review[]): void {
  try {
    ensureDataFiles();
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('Error saving reviews:', error);
    throw error;
  }
}

export function getReviewsByUserId(userId: string): Review[] {
  const reviews = getReviews();
  return reviews.filter(review => review.revieweeId === userId);
}

export function createReview(review: Review): void {
  const reviews = getReviews();
  reviews.push(review);
  saveReviews(reviews);
}

export function updateReview(id: string, updates: Partial<Review>): void {
  const reviews = getReviews();
  const index = reviews.findIndex(review => review.id === id);
  if (index !== -1) {
    reviews[index] = { ...reviews[index], ...updates };
    saveReviews(reviews);
  }
}

// Notifications
export function getNotifications(): Notification[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(notificationsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
}

export function saveNotifications(notifications: Notification[]): void {
  try {
    ensureDataFiles();
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2));
  } catch (error) {
    console.error('Error saving notifications:', error);
    throw error;
  }
}

export function getNotificationsByUserId(userId: string): Notification[] {
  const notifications = getNotifications();
  return notifications.filter(notif => notif.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUnreadNotificationsCount(userId: string): number {
  const notifications = getNotifications();
  return notifications.filter(notif => notif.userId === userId && !notif.read).length;
}

export function createNotification(notification: Notification): void {
  const notifications = getNotifications();
  notifications.push(notification);
  saveNotifications(notifications);
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const index = notifications.findIndex(notif => notif.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getNotifications();
  notifications.forEach(notif => {
    if (notif.userId === userId && !notif.read) {
      notif.read = true;
    }
  });
  saveNotifications(notifications);
}

