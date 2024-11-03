import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Github, 
  Globe, 
  MessageSquare,
  Users,
  ExternalLink,
  Award,
  FileText,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image'

interface ProjectData {
  id: string;
  name: string;
  description: string;
  problemStatement: string;
  githubUrl: string;
  demoUrl: string | null;
  techStack: string[];
  imageUrl: string | null;
  status: string;
  projectType: string;
  keyFeatures: string[];
  createdAt: string;
  updatedAt: string;
  users: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      githubUsername: string;
      githubProfileUrl: string;
      githubAvatarUrl: string;
      bio: string | null;
    };
  }[];
  projectImages: {
    id: string;
    title: string;
    description: string;
    url: string;
    createdAt: string;
    updatedAt: string;
  }[];
  tags: {
    id: string;
    name: string;
    title: string | null;
    status: string | null;
    conference: string | null;
    date: string | null;
    competition: string | null;
    curator: {
      id: string;
      name: string;
    };
    createdAt: string;
  }[];
}


interface RawProjectTag {
  id: string;
  name: string;
  title: string | null;
  status: string | null;
  conference: string | null;
  date: string | null;
  competition: string | null;
  curator: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6">
          <CardTitle className="text-xl text-red-500 mb-2">Error</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

async function ProjectPage({ params }: { params: { id: string } }) {
  try {

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('API base URL is not configured');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${params.id}`, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch project data:', errorText);
      
      if (response.status === 404) {
        return <ErrorDisplay message="Project not found" />;
      }
      
      return <ErrorDisplay message="Failed to load project data. Please try again later." />;
    }

    const rawProject = await response.json();

    // Validate required fields

   

    const project: ProjectData = {
      ...rawProject,
      tags: Array.isArray(rawProject.tags) 
        ? rawProject.tags.map((tag: RawProjectTag) => ({
            ...tag,
            curator: tag.curator || { id: '', name: '' }
          })) 
        : [],
      users: Array.isArray(rawProject.users) ? rawProject.users : [],
      projectImages: Array.isArray(rawProject.projectImages) ? rawProject.projectImages : [],
      techStack: Array.isArray(rawProject.techStack) ? rawProject.techStack : [],
      keyFeatures: Array.isArray(rawProject.keyFeatures) ? rawProject.keyFeatures : [],
    };


    const getProjectTypeBadge = (type: string) => {
      switch (type.toUpperCase()) {
        case 'BLOCKCHAIN':
          return 'default';
        case 'AI':
          return 'secondary';
        default:
          return 'outline';
      }
    };

    return (
      <div className="container mx-auto max-w-4xl p-6 space-y-6">

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
                  <Badge variant="secondary">{project.status}</Badge>
                  <Badge variant={getProjectTypeBadge(project.projectType)}>
                    {project.projectType}
                  </Badge>
                </div>
                <CardDescription className="mt-2 text-lg">
                  {project.description}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {project.techStack.length > 0 ? (
                  project.techStack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No technologies listed</span>
                )}
              </div>

              <div className="flex gap-4">
                {project.demoUrl && (
                  <Button variant="default" className="gap-2" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      View Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Problem Statement</CardTitle>
                <CardDescription>The challenge we&apos;re addressing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {project.problemStatement}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>Main capabilities and functionalities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {project.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Images</CardTitle>
                <CardDescription>Visual overview of key interfaces and features</CardDescription>
              </CardHeader>
              <CardContent>
                {project.projectImages.length > 0 ? (
                  <div className="grid gap-6">
                    {project.projectImages.map((image, index) => (
                      <div key={index} className="space-y-3">
                        <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                          <Image
                            src={image.url}
                            alt={image.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{image.title}</h4>
                          <p className="text-sm text-muted-foreground">{image.description}</p>
                        </div>
                        {index < project.projectImages.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No images available for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Meet the people behind the project</CardDescription>
              </CardHeader>
              <CardContent>
                {project.users.length > 0 ? (
                  <div className="grid gap-6">
                    {project.users.map((member) => (
                      <div key={member.user.id} className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user.githubAvatarUrl} alt={member.user.name} />
                          <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{member.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                          </div>
                          {member.user.bio && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {member.user.bio}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {member.user.githubProfileUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={member.user.githubProfileUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`mailto:${member.user.email}`}>
                              <MessageSquare className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No team members listed for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Project Tags</CardTitle>
                <CardDescription>Academic achievements and recognition</CardDescription>
              </CardHeader>
              <CardContent>
                

                {project.tags && project.tags.length > 0 ? (
                  <div className="space-y-6">
                    {project.tags.map((tag, index) => (
                      <div key={tag.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {tag.title || tag.name || 'Untitled Tag'}
                          </h4>
                          {tag.status && (
                            <Badge variant="secondary">
                              {tag.status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {tag.conference && (
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              <span>Conference: {tag.conference}</span>
                            </div>
                          )}
                          {tag.date && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Date: {new Date(tag.date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {tag.competition && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              <span>Competition: {tag.competition}</span>
                            </div>
                          )}
                          {tag.curator && (
                            <div className="flex items-center gap-2 mt-2">
                              <Users className="h-4 w-4" />
                              <span className="text-xs">Added by {tag.curator.name}</span>
                            </div>
                          )}
                        </div>
                        {index < project.tags.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No project tags available.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Project Resources</CardTitle>
                <CardDescription>Access project materials and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {project.imageUrl && (
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-4 w-4" />
                      <a 
                        href={project.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-2"
                      >
                        Main Project Image
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                  {(!project.imageUrl) && (
                    <div className="text-center py-4 text-muted-foreground">
                      No resources available.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );

  } catch (error) {
    console.error('Error in ProjectPage:', error);
    return (
      <ErrorDisplay 
        message={
          error instanceof Error 
            ? error.message 
            : "An unexpected error occurred while loading the project"
        }
      />
    );
  }
}

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Project Details - ${params.id}`,
  };
}

export default ProjectPage;
