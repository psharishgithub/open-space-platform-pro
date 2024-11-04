import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({ 
        req: request,
        secret: process.env.AUTH_SECRET || ''
    });
    
    // Get allowed emails from environment variable
    const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];
    
    // Check if user is authenticated and allowed
    if (token) {
        if (!allowedEmails.includes(token.email as string)) {
            // Redirect to access denied page or home
            return NextResponse.redirect(new URL('/access-denied', request.url));
        }
        return NextResponse.next();
    }

    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/google-signin', request.url));
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/project/:path*',
        // Add other protected routes here
    ]
};