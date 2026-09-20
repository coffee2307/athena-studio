import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "pham",
    title: "PHAM",
    category: "E-commerce / Brand Experience",
    year: 2026,
    description: "A considered commerce experience for a new generation of everyday objects.",
    cover: "/projects/pham/cover-placeholder.svg",
    featured: true,
    introduction: "PHAM is a study in making everyday objects feel meaningful, tactile, and easy to choose.",
    challenge: "Build a digital home for a growing product collection without losing the clarity and warmth of the brand.",
    approach: "We created a quiet visual system, a clear product architecture, and a commerce flow that keeps the objects at the center.",
    result: "A flexible foundation for launch, storytelling, and a thoughtful relationship with customers.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
