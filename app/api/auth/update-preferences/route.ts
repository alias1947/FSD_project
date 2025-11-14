import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { updateUser } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !user.profileComplete) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { strongSubjects, weakSubjects } = body;

    if (!Array.isArray(strongSubjects) || !Array.isArray(weakSubjects)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    updateUser(user.id, {
      strongSubjects,
      weakSubjects,
    });

    const updatedUser = { ...user, strongSubjects, weakSubjects };
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}

