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

    if (!jam.participants.includes(user.id)) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 400 });
    }

    // Creator cannot leave their own study jam
    if (jam.createdBy === user.id) {
      return NextResponse.json({ error: 'Creator cannot leave' }, { status: 400 });
    }

    const updatedParticipants = jam.participants.filter(id => id !== user.id);
    const newCurrentParticipants = jam.currentParticipants - 1;
    const newStatus = 'open';

    updateStudyJam(params.id, {
      participants: updatedParticipants,
      currentParticipants: newCurrentParticipants,
      status: newStatus,
    });

    const updatedJam = getStudyJamById(params.id);
    return NextResponse.json(updatedJam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to leave study jam' }, { status: 500 });
  }
}

