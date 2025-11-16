import { NextRequest, NextResponse } from 'next/server';
import { getStudyJamById, updateStudyJam, createNotification, getUserById } from '@/lib/data';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jam = getStudyJamById(params.id);
    if (!jam) {
      return NextResponse.json({ error: 'Study jam not found' }, { status: 404 });
    }

    if (jam.participants.includes(user.id)) {
      return NextResponse.json({ error: 'Already joined' }, { status: 400 });
    }

    if (jam.currentParticipants >= jam.maxParticipants) {
      return NextResponse.json({ error: 'Study jam is full' }, { status: 400 });
    }

    const updatedParticipants = [...jam.participants, user.id];
    const newCurrentParticipants = jam.currentParticipants + 1;
    const newStatus = newCurrentParticipants >= jam.maxParticipants ? 'full' : 'open';

    updateStudyJam(params.id, {
      participants: updatedParticipants,
      currentParticipants: newCurrentParticipants,
      status: newStatus,
    });

    // Create reminder notification for the user
    const jamDate = new Date(jam.date + 'T' + jam.time);
    const now = new Date();
    const hoursUntil = (jamDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Only create reminder if the study jam is in the future
    if (hoursUntil > 0) {
      const reminderDate = new Date(jamDate);
      reminderDate.setHours(reminderDate.getHours() - 24); // Remind 24 hours before
      
      // Create reminder notification
      if (reminderDate > now) {
        createNotification({
          id: `reminder-${params.id}-${user.id}-${Date.now()}`,
          userId: user.id,
          type: 'reminder',
          title: `Study Jam Reminder: ${jam.title}`,
          message: `Your study session "${jam.title}" is coming up on ${jamDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${jam.time}`,
          link: `/?highlight=${params.id}`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const updatedJam = getStudyJamById(params.id);
    return NextResponse.json(updatedJam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join study jam' }, { status: 500 });
  }
}

