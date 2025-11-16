import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUser, createUser } from '@/lib/data';
import { User } from '@/types';
import { hashPassword } from '@/lib/password';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const {
      email,
      password,
      batchYear,
      rollNumber,
      branch,
      branchAcronym,
      strongSubjects,
      weakSubjects
    } = payload;

    // Basic input checks
    if (!email || !batchYear || !rollNumber || !branch || !branchAcronym) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!Array.isArray(strongSubjects) || strongSubjects.length < 1) {
      return NextResponse.json(
        { error: 'Provide at least one strong subject' },
        { status: 400 }
      );
    }

    if (!Array.isArray(weakSubjects) || weakSubjects.length < 1) {
      return NextResponse.json(
        { error: 'Provide at least one weak subject' },
        { status: 400 }
      );
    }

    // Password hashing
    const hashed = hashPassword(password);

    // Determine campus based on email domain
    const domain = email.split('@')[1] ?? '';
    const campus =
      domain.includes('iiitdwd') ? 'IIIT Dharwad' : 'IIIT Dharwad'; // Default remains

    // Check for existing user record
    let existingUser = getUserByEmail(email);

    // If user exists → update the record
    if (existingUser) {
      updateUser(existingUser.id, {
        email,
        password: hashed,
        batchYear: Number(batchYear),
        rollNumber,
        branch,
        branchAcronym,
        strongSubjects,
        weakSubjects,
        campus,
        profileComplete: true,
        name: existingUser.name ?? email.split('@')[0],
      });

      existingUser = getUserByEmail(email); // reload updated user
    } else {
      // Create a fresh user entry
      const freshUser: User = {
        id: `${Date.now()}`,
        name: email.split('@')[0],
        email,
        password: hashed,
        campus,
        batchYear: Number(batchYear),
        rollNumber,
        branch,
        branchAcronym,
        strongSubjects,
        weakSubjects,
        profileComplete: true,
        createdAt: new Date().toISOString(),
      };

      createUser(freshUser);
      existingUser = freshUser;
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Could not save user data' },
        { status: 500 }
      );
    }

    // Prepare response with cookie
    const res = NextResponse.json({
      user: existingUser,
      message: 'Profile saved successfully',
    });

    res.cookies.set('userId', existingUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error('Profile creation error:', err);
    return NextResponse.json(
      { error: 'Unexpected error while creating profile' },
      { status: 500 }
    );
  }
}
