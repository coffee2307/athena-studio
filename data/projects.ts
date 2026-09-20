import type { Project } from "@/types/project";

export const projects: Project[] = [
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
