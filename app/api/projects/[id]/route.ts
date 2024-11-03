import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Instead of force-dynamic, use specific revalidation
export const revalidate = process.env.VERCEL_ENV === 'preview' ? 10 : 3600;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id
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
            curator: true
          }
        }
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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