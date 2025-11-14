import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getMessagesByChatId, createMessage, getChatById, updateChat, getUserById } from '@/lib/data';
import { Message, Chat } from '@/types';
import { createNotification } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }

    // Verify user is part of the chat
    const chat = getChatById(chatId);
    if (!chat || !chat.participants.includes(user.id)) {
      return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 403 });
    }

    const messages = getMessagesByChatId(chatId);
    
    // Mark messages as read for this user
    messages.forEach(msg => {
      if (!msg.readBy) msg.readBy = [];
      if (!msg.readBy.includes(user.id) && msg.senderId !== user.id) {
        msg.readBy.push(user.id);
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { chatId, content, type, fileUrl, fileName, fileSize } = body;

    if (!chatId || !content) {
      return NextResponse.json({ error: 'chatId and content are required' }, { status: 400 });
    }

    // Verify user is part of the chat
    const chat = getChatById(chatId);
    if (!chat || !chat.participants.includes(user.id)) {
      return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 403 });
    }

    const message: Message = {
      id: Date.now().toString(),
      chatId,
      senderId: user.id,
      content,
      type: type || 'text',
      fileUrl,
      fileName,
      fileSize,
      createdAt: new Date().toISOString(),
      readBy: [user.id], // Sender has read their own message
    };

    createMessage(message);

    // Update chat's last message
    updateChat(chatId, {
      lastMessage: message,
      lastMessageAt: message.createdAt,
    });

    // Create notifications for other participants
    chat.participants.forEach(participantId => {
      if (participantId !== user.id) {
        const participant = getUserById(participantId);
        if (participant) {
          createNotification({
            id: Date.now().toString() + participantId,
            userId: participantId,
            type: 'message',
            title: `New message from ${user.name}`,
            message: content.length > 50 ? content.substring(0, 50) + '...' : content,
            link: `/chat/${chatId}`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

