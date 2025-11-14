'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMessageCircle, FiArrowLeft, FiUsers } from 'react-icons/fi';
import { Chat, User, StudyJam } from '@/types';

export default function ChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatDetails, setChatDetails] = useState<{ [key: string]: { users: User[], studyJam?: StudyJam } }>({});

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      if (response.ok) {
        const chatsData = await response.json();
        setChats(chatsData);
        
        // Fetch details for each chat
        const details: { [key: string]: { users: User[], studyJam?: StudyJam } } = {};
        for (const chat of chatsData) {
          const users = await Promise.all(
            chat.participants.map(async (userId: string) => {
              const userResponse = await fetch(`/api/users/${userId}`);
              return userResponse.ok ? userResponse.json() : null;
            })
          );
          details[chat.id] = { users: users.filter(Boolean) };
          
          if (chat.studyJamId) {
            const jamResponse = await fetch(`/api/study-jams/${chat.studyJamId}`);
            if (jamResponse.ok) {
              details[chat.id].studyJam = await jamResponse.json();
            }
          }
        }
        setChatDetails(details);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getChatTitle = (chat: Chat) => {
    if (chat.type === 'group' && chatDetails[chat.id]?.studyJam) {
      return chatDetails[chat.id].studyJam?.title || 'Group Chat';
    }
    if (chat.type === 'direct' && chatDetails[chat.id]?.users) {
      const otherUser = chatDetails[chat.id].users.find(u => {
        const currentUserResponse = fetch('/api/auth/me');
        // For now, just return first other user
        return true;
      });
      return chatDetails[chat.id].users[0]?.name || 'Direct Message';
    }
    return chat.type === 'group' ? 'Group Chat' : 'Direct Message';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        </div>

        {chats.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <FiMessageCircle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No chats yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Join a study hive to start chatting with other members!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 p-4 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {chat.type === 'group' ? (
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <FiUsers className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {getChatTitle(chat).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {getChatTitle(chat)}
                      </h3>
                      {chat.lastMessageAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatTime(chat.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                        {chat.lastMessage.content}
                      </p>
                    )}
                    {chat.unreadCount && chat.unreadCount[chat.participants[0]] > 0 && (
                      <span className="inline-block mt-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {chat.unreadCount[chat.participants[0]]} new
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

