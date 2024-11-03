import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check if it's a preview deployment
  const isPreview = process.env.VERCEL_ENV === 'preview'

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        projectImages: true,
        tags: {
          include: {
            curator: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Add cache-control headers for preview deployments
    const headers = {
      'Access-Control-Allow-Origin': '*',
      ...(isPreview && {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    }

    return NextResponse.json(project, { headers });
  } catch (error) {
    console.error('Error fetching project:', error);
    return new NextResponse('Internal Server Error', { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}