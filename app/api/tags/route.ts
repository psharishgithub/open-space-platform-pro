import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const validStatuses = ['PUBLISHED', 'IN_REVIEW', 'DRAFT', 'COMPLETED', 'ONGOING'] as const;
type ProjectTagStatus = typeof validStatuses[number];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'CURATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, projectId, title, status, conference, date, competition } = body;

    
    if (!validStatuses.includes(status as ProjectTagStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }


    const isoDate = date ? new Date(date).toISOString() : null;

    const tag = await prisma.projectTag.create({
      data: {
        name,
        projectId,
        curatorId: user.id,
        title,
        status: status as ProjectTagStatus,
        conference,
        date: isoDate,
        competition,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
} 