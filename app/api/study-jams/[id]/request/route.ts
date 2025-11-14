import { NextRequest, NextResponse } from 'next/server';
import { getStudyJamById, updateStudyJam } from '@/lib/data';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !user.profileComplete) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jam = getStudyJamById(params.id);
    if (!jam) {
      return NextResponse.json({ error: 'Study jam not found' }, { status: 404 });
    }

    if (jam.participants.includes(user.id)) {
      return NextResponse.json({ error: 'Already a participant' }, { status: 400 });
    }

    if (jam.requests && jam.requests.includes(user.id)) {
      return NextResponse.json({ error: 'Request already sent' }, { status: 400 });
    }

    const updatedRequests = [...(jam.requests || []), user.id];
    updateStudyJam(params.id, {
      requests: updatedRequests,
    });

    const updatedJam = getStudyJamById(params.id);
    return NextResponse.json(updatedJam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}

