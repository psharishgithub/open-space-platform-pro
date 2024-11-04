import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        
        // Get allowed emails from environment variable
        const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];
        
        // Check if the email is in the allowed list
        if (allowedEmails.includes(email)) {
            return NextResponse.json({ allowed: true }, { status: 200 });
        }
        
        return NextResponse.json(
            { error: 'Email not allowed' },
            { status: 403 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 