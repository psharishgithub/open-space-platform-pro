import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, GitPullRequest, Star } from "lucide-react";
import Link from 'next/link';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    githubUrl: string;
    techStack: string[];
    imageUrl: string | null;
    users: Array<{
      user: {
        name: string;
        githubAvatarUrl: string | null;
        githubUsername: string; 
      };
      role: string;
    }>;
    language: string;
    pullRequests: number;
    stars: number;
  };
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const shortenDescription = (desc: string | null, maxLength: number = 100) => {
    if (!desc) return '';
    return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
  };

  return (
    <Card 
      className="relative group flex flex-col h-full w-full max-w-sm overflow-hidden cursor-pointer" 
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex flex-col h-full bg-black/40 backdrop-blur-sm border border-white/5">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-white/60">
                <span>{project.language}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-500" />
                  <span>{project.stars}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <GitPullRequest size={12} />
                  <span>{project.pullRequests}</span>
                </div>
              </div>
            </div>
            <Link 
              href={project.githubUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow space-y-4">
          <p className="text-sm text-white/60 leading-relaxed">
            {shortenDescription(project.description)}
          </p>
          
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-white/5 hover:bg-white/10 text-white/80 border-0"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {project.users.slice(0, 3).map((projectUser, index) => (
              <div 
                key={index} 
                className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded-sm"
              >
                @{projectUser.user.githubUsername}
              </div>
            ))}
            {project.users.length > 3 && (
              <div className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded-sm">
                +{project.users.length - 3}
              </div>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
