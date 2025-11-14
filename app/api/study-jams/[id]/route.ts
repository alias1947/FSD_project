import { NextRequest, NextResponse } from 'next/server';
import { getStudyJamById, updateStudyJam, deleteStudyJam } from '@/lib/data';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jam = getStudyJamById(params.id);
    if (!jam) {
      return NextResponse.json({ error: 'Study jam not found' }, { status: 404 });
    }
    return NextResponse.json(jam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch study jam' }, { status: 500 });
  }
}

export async function PUT(
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

    if (jam.createdBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    updateStudyJam(params.id, body);

    const updatedJam = getStudyJamById(params.id);
    return NextResponse.json(updatedJam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update study jam' }, { status: 500 });
  }
}

export async function DELETE(
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

    if (jam.createdBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    deleteStudyJam(params.id);
    return NextResponse.json({ message: 'Study jam deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete study jam' }, { status: 500 });
  }
}

