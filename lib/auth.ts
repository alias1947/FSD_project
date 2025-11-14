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
    user = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      campus: '',
      createdAt: new Date().toISOString(),
    };
    createUser(user);
  }

  return user;
}

