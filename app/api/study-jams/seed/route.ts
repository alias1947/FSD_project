import { NextRequest, NextResponse } from 'next/server';
import { getStudyJams, createStudyJam, getUsers, createUser } from '@/lib/data';
import { StudyJam, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Check if data already exists
    const existingJams = getStudyJams();
    if (existingJams.length > 0) {
      return NextResponse.json({ message: 'Sample data already exists' }, { status: 400 });
    }

    // Create sample users
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'alice',
        email: 'alice@university.edu',
        campus: 'Main Campus',
        major: 'Computer Science',
        year: 'Junior',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'bob',
        email: 'bob@university.edu',
        campus: 'Main Campus',
        major: 'Mathematics',
        year: 'Sophomore',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'charlie',
        email: 'charlie@university.edu',
        campus: 'North Campus',
        major: 'Physics',
        year: 'Senior',
        createdAt: new Date().toISOString(),
      },
    ];

    // Create users
    sampleUsers.forEach(user => {
      const existingUsers = getUsers();
      if (!existingUsers.find(u => u.email === user.email)) {
        createUser(user);
      }
    });

    // Create sample study jams
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const sampleJams: StudyJam[] = [
      {
        id: Date.now().toString(),
        title: 'Calculus II Study Session',
        description: 'Reviewing integrals and differential equations for the upcoming exam. Bring your notes and questions!',
        subject: 'Mathematics',
        campus: 'Main Campus',
        location: 'Library Room 201',
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        maxParticipants: 6,
        currentParticipants: 2,
        createdBy: '1',
        createdAt: new Date().toISOString(),
        participants: ['1', '2'],
        status: 'open',
      },
      {
        id: (Date.now() + 1).toString(),
        title: 'Data Structures & Algorithms',
        description: 'Working through problem sets together. Focus on trees and graphs this week.',
        subject: 'Computer Science',
        campus: 'Main Campus',
        location: 'Computer Lab 305',
        date: dayAfter.toISOString().split('T')[0],
        time: '16:00',
        maxParticipants: 5,
        currentParticipants: 3,
        createdBy: '1',
        createdAt: new Date().toISOString(),
        participants: ['1', '2', '3'],
        status: 'open',
      },
      {
        id: (Date.now() + 2).toString(),
        title: 'Physics Lab Review',
        description: 'Going over lab reports and preparing for the practical exam. All physics students welcome!',
        subject: 'Physics',
        campus: 'North Campus',
        location: 'Science Building Room 102',
        date: nextWeek.toISOString().split('T')[0],
        time: '10:00',
        maxParticipants: 8,
        currentParticipants: 4,
        createdBy: '3',
        createdAt: new Date().toISOString(),
        participants: ['3'],
        status: 'open',
      },
      {
        id: (Date.now() + 3).toString(),
        title: 'Linear Algebra Group Study',
        description: 'Solving practice problems from chapters 5-7. Bring your textbook!',
        subject: 'Mathematics',
        campus: 'Main Campus',
        location: 'Math Building Room 150',
        date: tomorrow.toISOString().split('T')[0],
        time: '18:00',
        maxParticipants: 4,
        currentParticipants: 4,
        createdBy: '2',
        createdAt: new Date().toISOString(),
        participants: ['2'],
        status: 'full',
      },
    ];

    // Create study jams
    sampleJams.forEach(jam => {
      createStudyJam(jam);
    });

    return NextResponse.json({ 
      message: 'Sample data created successfully',
      jams: sampleJams.length,
      users: sampleUsers.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}

