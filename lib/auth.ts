import { User } from '@/types';
import { getUserByEmail, createUser, getUsers } from './data';
import { NextRequest } from 'next/server';

export function getUserIdFromRequest(request: NextRequest): string | null {
  const userId = request.cookies.get('userId')?.value;
  return userId || null;
}

export function getCurrentUserFromRequest(request: NextRequest): User | null {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return null;
  }

  const users = getUsers();
  return users.find(user => user.id === userId) || null;
}

export async function login(email: string): Promise<User | null> {
  let user = getUserByEmail(email);
  
  if (!user) {
    // Create new user if doesn't exist
    // Note: User will need to complete profile later with required fields
    user = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      campus: '',
      batchYear: new Date().getFullYear(), // Default to current year
      rollNumber: '', // Will be set during profile completion
      branch: '', // Will be set during profile completion
      branchAcronym: '', // Will be set during profile completion
      strongSubjects: [], // Will be set during profile completion
      weakSubjects: [], // Will be set during profile completion
      profileComplete: false, // User needs to complete profile
      createdAt: new Date().toISOString(),
    };
    createUser(user);
  }

  return user;
}

