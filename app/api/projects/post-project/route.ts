import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      githubUrl,
      demoUrl,
      techStack,
      imageUrl,
      problemStatement,
      status,
      projectType,
      keyFeatures,
      resources,
      users,
      ownerId,
    } = body;

    // Create project with resources
    const project = await prisma.project.create({
      data: {
        name,
        description,
        // Only include githubUrl if it's not empty
        ...(githubUrl ? { githubUrl } : {}),
        demoUrl,
        techStack,
        imageUrl,
        problemStatement,
        status,
        projectType,
        keyFeatures,
        resources: {
          create: resources.map((resource: {
            url: string
            title: string
            type: string
            description: string
          }) => ({
            url: resource.url,
            title: resource.title,
            type: resource.type,
            description: resource.description
          }))
        },
        users: {
          create: users.map((user: { githubUsername: string; role: string }) => ({
            role: user.role,
            user: {
              connect: {
                githubUsername: user.githubUsername,
              },
            },
          })),
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        resources: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 is the error code for unique constraint violations
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A project with this GitHub URL already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
