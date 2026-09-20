import { ProjectCard } from "@/components/ui/ProjectCard";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Work");

export default function WorkPage() {
  return <Section className="page-intro"><p className="eyebrow">Selected work</p><Heading>Projects with<br />purpose.</Heading><div className="project-grid project-grid-page">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></Section>;
}
