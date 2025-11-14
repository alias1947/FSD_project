import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getUserById, updateUser } from '@/lib/data';
import { StudyGoal } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullUser = getUserById(user.id);
    return NextResponse.json(fullUser?.studyGoals || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, targetHours, targetDate } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const fullUser = getUserById(user.id);
    const goals = fullUser?.studyGoals || [];

    const newGoal: StudyGoal = {
      id: Date.now().toString(),
      title,
      description,
      targetHours,
      currentHours: 0,
      targetDate,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    goals.push(newGoal);
    updateUser(user.id, { studyGoals: goals });

    return NextResponse.json(newGoal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { goalId, updates } = body;

    const fullUser = getUserById(user.id);
    const goals = fullUser?.studyGoals || [];
    const goalIndex = goals.findIndex((g: StudyGoal) => g.id === goalId);

    if (goalIndex === -1) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    goals[goalIndex] = { ...goals[goalIndex], ...updates };
    updateUser(user.id, { studyGoals: goals });

    return NextResponse.json(goals[goalIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

