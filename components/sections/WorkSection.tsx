import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export function WorkSection() {
  const featuredProjects = projects.filter((project) => project.featured);
  return <Section id="work" className="section-work"><div className="section-header"><div><p className="eyebrow">Selected work</p><Heading>Built for the long view.</Heading></div><Button href="/work" variant="outline">All work</Button></div><div className="project-grid">{featuredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></Section>;
}
