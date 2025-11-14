import { NextRequest, NextResponse } from 'next/server';
import { getStudyJams, createStudyJam, updateStudyJam, deleteStudyJam, getStudyJamById, getUserByEmail, createUser } from '@/lib/data';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { StudyJam } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campus = searchParams.get('campus');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');

    let jams = getStudyJams();

    // Filter by campus
    if (campus) {
      jams = jams.filter(jam => jam.campus.toLowerCase().includes(campus.toLowerCase()));
    }

    // Filter by subject
    if (subject) {
      jams = jams.filter(jam => jam.subject.toLowerCase().includes(subject.toLowerCase()));
    }

    // Filter by status
    if (status) {
      jams = jams.filter(jam => jam.status === status);
    }

    // Sort by creation date (newest first)
    jams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(jams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch study jams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !user.profileComplete) {
      return NextResponse.json({ error: 'Please login and complete your profile first' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, subject, campus, location, date, time, maxParticipants } = body;

    if (!title || !description || !subject || !campus || !location || !date || !time || !maxParticipants) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check weekly limit (5 jams per week)
    const jams = getStudyJams();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const userJamsThisWeek = jams.filter(jam => {
      if (jam.createdBy !== user.id) return false;
      const jamDate = new Date(jam.createdAt);
      return jamDate >= oneWeekAgo;
    });

    if (userJamsThisWeek.length >= 5) {
      return NextResponse.json({ 
        error: 'You have reached the weekly limit of 5 study jams. Please wait until next week.' 
      }, { status: 400 });
    }

    const jam: StudyJam = {
      id: Date.now().toString(),
      title,
      description,
      subject,
      campus,
      location,
      date,
      time,
      maxParticipants: parseInt(maxParticipants),
      currentParticipants: 1,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      participants: [user.id],
      requests: [],
      status: 'open',
    };

    createStudyJam(jam);

    return NextResponse.json(jam, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create study jam' }, { status: 500 });
  }
}

