export interface Project {
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
} 