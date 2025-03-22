import { decryptAccessToken, getSession } from '@/app/auth/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.auth) {
      return NextResponse.json({ isAuthenticated: false });
    }
    
    const decodedToken = await decryptAccessToken(session.auth);
    const expiresAt = decodedToken.exp * 1000; // Convert to milliseconds
    
    return NextResponse.json({
      isAuthenticated: true,
      expiresAt,
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}