import { NextRequest, NextResponse } from 'next/server';
import { getStudyJamById, updateStudyJam } from '@/lib/data';
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

    const updatedJam = getStudyJamById(params.id);
    return NextResponse.json(updatedJam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join study jam' }, { status: 500 });
  }
}

