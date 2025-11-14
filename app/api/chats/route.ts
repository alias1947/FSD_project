import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { 
  getUserChats, 
  getChatById,
  getChatByStudyJamId, 
  getDirectChat, 
  createChat, 
  getStudyJamById,
  getUserById 
} from '@/lib/data';
import { Chat } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const studyJamId = searchParams.get('studyJamId');
    const userId = searchParams.get('userId'); // For direct messages

    if (chatId) {
      // Get specific chat by ID
      const chat = getChatById(chatId);
      if (!chat || !chat.participants.includes(user.id)) {
        return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 403 });
      }
      return NextResponse.json(chat);
    } else if (studyJamId) {
      // Get or create group chat for study jam
      let chat = getChatByStudyJamId(studyJamId);
      const studyJam = getStudyJamById(studyJamId);
      
      if (!studyJam) {
        return NextResponse.json({ error: 'Study jam not found' }, { status: 404 });
      }

      // Verify user is a participant
      if (!studyJam.participants.includes(user.id) && studyJam.createdBy !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      if (!chat) {
        // Create group chat
        chat = {
          id: `group-${studyJamId}`,
          type: 'group',
          studyJamId,
          participants: [studyJam.createdBy, ...studyJam.participants],
          createdAt: new Date().toISOString(),
        };
        createChat(chat);
      }

      return NextResponse.json(chat);
    } else if (userId) {
      // Get or create direct chat
      if (userId === user.id) {
        return NextResponse.json({ error: 'Cannot create chat with yourself' }, { status: 400 });
      }

      const otherUser = getUserById(userId);
      if (!otherUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      let chat = getDirectChat(user.id, userId);
      
      if (!chat) {
        // Create direct chat
        chat = {
          id: `dm-${[user.id, userId].sort().join('-')}`,
          type: 'direct',
          participants: [user.id, userId],
          createdAt: new Date().toISOString(),
        };
        createChat(chat);
      }

      return NextResponse.json(chat);
    } else {
      // Get all user's chats
      const chats = getUserChats(user.id);
      return NextResponse.json(chats);
    }
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

