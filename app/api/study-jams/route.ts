import { NextRequest, NextResponse } from 'next/server';
import {
  getStudyJams,
  createStudyJam,
  updateStudyJam,
  deleteStudyJam,
  getStudyJamById,
  getUserByEmail,
  createUser
} from '@/lib/data';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { StudyJam } from '@/types';

/* -------------------- GET ALL STUDY JAMS -------------------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const campus = searchParams.get('campus');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');

    let jamsList = getStudyJams();

    // Filter by campus (case insensitive)
    if (campus) {
      jamsList = jamsList.filter(j =>
        j.campus.toLowerCase().includes(campus.toLowerCase())
      );
    }

    // Filter by subject
    if (subject) {
      jamsList = jamsList.filter(j =>
        j.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }

    // Filter by status (open/closed)
    if (status) {
      jamsList = jamsList.filter(j => j.status === status);
    }

    // Sort newest → oldest
    jamsList.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(jamsList);
  } catch (err) {
    return NextResponse.json(
      { error: 'Unable to fetch study jams' },
      { status: 500 }
    );
  }
}

/* -------------------- CREATE A STUDY JAM -------------------- */
export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(req);

    if (!user || !user.profileComplete) {
      return NextResponse.json(
        { error: 'Login and complete your profile before creating a study jam.' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const {
      title,
      description,
      subject,
      campus,
      location,
      date,
      time,
      maxParticipants
    } = data;

    // Check missing fields
    if (
      !title ||
      !description ||
      !subject ||
      !campus ||
      !location ||
      !date ||
      !time ||
      !maxParticipants
    ) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Weekly jam creation limit check (max 5/week)
    const allJams = getStudyJams();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const jamsCreatedRecently = allJams.filter(j => {
      if (j.createdBy !== user.id) return false;
      return new Date(j.createdAt) >= weekStart;
    });

    if (jamsCreatedRecently.length >= 5) {
      return NextResponse.json(
        {
          error:
            'Weekly limit reached (5 study jams). You can create more next week.'
        },
        { status: 400 }
      );
    }

    // Create new jam object
    const newJam: StudyJam = {
      id: String(Date.now()),
      title,
      description,
      subject,
      campus,
      location,
      date,
      time,
      maxParticipants: Number(maxParticipants),
      currentParticipants: 1,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      participants: [user.id],
      requests: [],
      status: 'open'
    };

    createStudyJam(newJam);

    return NextResponse.json(newJam, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Could not create study jam' },
      { status: 500 }
    );
  }
}
