import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { getReviewsByUserId, createReview, getReviews } from '@/lib/data';
import { Review } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const reviews = getReviewsByUserId(userId);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { revieweeId, studyJamId, rating, comment } = body;

    if (!revieweeId || !rating || !comment) {
      return NextResponse.json({ error: 'revieweeId, rating, and comment are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const review: Review = {
      id: Date.now().toString(),
      reviewerId: user.id,
      revieweeId,
      studyJamId,
      rating,
      comment,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    createReview(review);
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

