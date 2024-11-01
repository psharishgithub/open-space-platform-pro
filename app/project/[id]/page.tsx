import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Github, 
  Globe, 
  MessageSquare,
  Users,
  Book,
  Code,
  ExternalLink,
  Award,
  FileText,
  Star,
  Image as ImageIcon
} from 'lucide-react';
 
interface ProjectData {
  id: string;
  name: string;
  description: string;
  problemStatement: string;
  status: string;
  projectType: string;
  githubUrl: string | null;
  demoUrl: string | null;
  techStack: string[];
  projectImages: {
    title: string;
    description: string;
    url: string;
  }[];
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
  keyFeatures: string[];
  academicHighlights: any[];
  resources: any[];
}

async function ProjectPage({ params }: { params: { id: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${params.id}`, {
    next: { revalidate: 3600 }, 
  });

  if (!response.ok) {

    throw new Error('Failed to fetch project data');
  }

  const rawProject = await response.json();
  const project: ProjectData = {
    ...rawProject,
    techStack: rawProject.techStack || [],
    projectImages: rawProject.projectImages || [],
    users: rawProject.users || [],
    keyFeatures: rawProject.keyFeatures || [],
    academicHighlights: rawProject.academicHighlights || [],
    resources: rawProject.resources || [],
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
              <CardDescription>The challenge we're addressing</CardDescription>
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
                        <img
                          src={image.url}
                          alt={image.title}
                          className="object-cover w-full h-full"
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
              <CardTitle>Academic Achievements</CardTitle>
              <CardDescription>Research and recognition</CardDescription>
            </CardHeader>
            <CardContent>
              {project.academicHighlights.length > 0 ? (
                <div className="space-y-6">
                  {project.academicHighlights.map((highlight, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{highlight.title}</h4>
                        <Badge>{highlight.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {highlight.conference || highlight.date || highlight.competition}
                      </p>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No academic achievements listed.
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
              {project.resources.length > 0 ? (
                <div className="grid gap-4">
                  {project.resources.map((resource) => {
                    const Icon = resource.icon;
                    return (
                      <Button
                        key={resource.type}
                        variant="outline"
                        className="justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {resource.type}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No resources available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Project Details - ${params.id}`,
  };
}

export default ProjectPage;