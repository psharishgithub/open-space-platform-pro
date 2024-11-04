import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log('Middleware executing for path:', request.nextUrl.pathname);
    
    // Skip middleware for api routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        console.log('Skipping middleware for API route');
        return NextResponse.next();
    }

    try {
        const token = await getToken({ 
            req: request,
            secret: process.env.AUTH_SECRET || ''
        });
        
        console.log('Token found:', !!token);
        
        // Get allowed emails from environment variable
        const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];
        console.log('Checking email access for:', token?.email);
        
        // Check if user is authenticated and allowed
        if (token) {
            if (!allowedEmails.includes(token.email as string)) {
                console.log('Access denied for email:', token.email);
                // Redirect to access denied page or home
                return NextResponse.redirect(new URL('/access-denied', request.url));
            }
            console.log('Access granted for email:', token.email);
            return NextResponse.next();
        }

        console.log('No token found, redirecting to login');
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL('/google-signin', request.url));
    } catch (error) {
        console.error('Middleware error:', error);
        // In case of error, allow the request to continue
        return NextResponse.next();
    }
}

// Update matcher to be more specific and exclude certain paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
        '/dashboard/:path*',
        '/profile/:path*',
        '/project/:path*',
    ]
};