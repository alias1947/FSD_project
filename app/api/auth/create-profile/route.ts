import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUser, createUser } from '@/lib/data';
import { User } from '@/types';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, batchYear, rollNumber, branch, branchAcronym, strongSubjects, weakSubjects } = body;

    // Validate required fields
    if (!email || !batchYear || !rollNumber || !branch || !branchAcronym) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password is required and must be at least 6 characters long' }, { status: 400 });
    }

    if (!strongSubjects || !Array.isArray(strongSubjects) || strongSubjects.length === 0) {
      return NextResponse.json({ error: 'At least one strong subject is required' }, { status: 400 });
    }

    if (!weakSubjects || !Array.isArray(weakSubjects) || weakSubjects.length === 0) {
      return NextResponse.json({ error: 'At least one weak subject is required' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Check if user exists
    let user = getUserByEmail(email);

    // Extract campus from email domain (e.g., iiitdwd.ac.in -> IIIT Dharwad)
    const domain = email.split('@')[1] || '';
    let campus = 'IIIT Dharwad'; // Default campus
    if (domain.includes('iiitdwd')) {
      campus = 'IIIT Dharwad';
    }

    if (user) {
      // Update existing user (preserve existing name if set)
      updateUser(user.id, {
        email,
        password: hashedPassword,
        batchYear: parseInt(batchYear),
        rollNumber,
        branch,
        branchAcronym,
        strongSubjects,
        weakSubjects,
        campus,
        profileComplete: true,
        name: user.name || email.split('@')[0], // Preserve existing name or use roll number
      });
      
      // Get updated user
      user = getUserByEmail(email);
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        campus,
        batchYear: parseInt(batchYear),
        rollNumber,
        branch,
        branchAcronym,
        strongSubjects,
        weakSubjects,
        profileComplete: true,
        createdAt: new Date().toISOString(),
      };
      
      createUser(newUser);
      user = newUser;
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 });
    }

    // Set user ID cookie
    const response = NextResponse.json({ 
      user,
      message: 'Profile created successfully' 
    });
    
    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
