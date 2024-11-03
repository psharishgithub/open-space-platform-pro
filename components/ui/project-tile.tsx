import Link from 'next/link';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface ProjectUser {
  user: {
    name: string;
    githubAvatarUrl: string | null;
    githubUsername: string;
  };
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
  users: ProjectUser[];
  language?: string;
  pullRequests?: number;
  stars?: number;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  // Ensure we have a valid project ID for the link
  const projectLink = project?.id ? `/project/${project.id}` : '/projects';

  return (
    <Link href={projectLink}>
      <Card 
        className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full"
        onClick={onClick}
      >
        <CardContent className="p-6">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="mb-4 w-full h-48 relative overflow-hidden rounded-lg">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Project Title and Tech Stack */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {project.description || 'No description available'}
              </p>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Project Stats */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                {project.users?.[0]?.user?.githubAvatarUrl && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={project.users[0].user.githubAvatarUrl}
                      alt={project.users[0].user.name}
                    />
                    <AvatarFallback>
                      {project.users[0].user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-sm text-muted-foreground">
                  {project.users?.[0]?.user?.name || 'Anonymous'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
