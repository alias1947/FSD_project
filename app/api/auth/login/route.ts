import { NextRequest, NextResponse } from 'next/server';
import { parseCollegeEmail } from '@/lib/emailParser';
import { getUserByEmail } from '@/lib/data';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Parse email to validate format
    const parsed = parseCollegeEmail(email);
    if (!parsed.isValid) {
      return NextResponse.json({ 
        error: 'Invalid college email format. Please use format: YYbranchROLL@domain (e.g., 23bcs057@iiitdwd.ac.in)' 
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = getUserByEmail(email);
    
    // For sign in, user must exist and have a complete profile
    if (!existingUser) {
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 401 });
    }

    if (!existingUser.profileComplete) {
      return NextResponse.json({ error: 'Profile incomplete. Please complete your profile setup first.' }, { status: 401 });
    }

    // Verify password if user has one
    if (existingUser.password) {
      if (!verifyPassword(password, existingUser.password)) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    } else {
      // Legacy user without password - return error asking them to reset password
      return NextResponse.json({ error: 'Password not set. Please contact support or sign up again.' }, { status: 401 });
    }
    
    // Profile complete and password verified, login successful
    const response = NextResponse.json({ 
      user: existingUser, 
      needsSetup: false 
    });
    response.cookies.set('userId', existingUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

