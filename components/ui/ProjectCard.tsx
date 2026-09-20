import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return <article className="project-card"><Link href={`/work/${project.slug}`} className="project-card-link"><div className="project-card-media"><span className="mono-label">{project.title}</span><span className="project-card-arrow" aria-hidden="true">↗</span></div><div className="project-card-meta"><h3 className="heading-3">{project.title}</h3><p className="small">{project.category}</p><p className="mono-label">{project.year}</p></div></Link></article>;
}
