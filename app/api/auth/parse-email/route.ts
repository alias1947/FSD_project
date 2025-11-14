import { NextRequest, NextResponse } from 'next/server';
import { parseCollegeEmail } from '@/lib/emailParser';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const parsed = parseCollegeEmail(email);
    
    if (!parsed.isValid) {
      return NextResponse.json({ 
        error: 'Invalid college email format. Please use format: YYbranchROLL@domain (e.g., 23bcs057@iiitdwd.ac.in)' 
      }, { status: 400 });
    }

    return NextResponse.json({
      email,
      batchYear: parsed.batchYear,
      rollNumber: parsed.rollNumber,
      branch: parsed.branch,
      branchAcronym: parsed.branchAcronym,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse email' }, { status: 500 });
  }
}

