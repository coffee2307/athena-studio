import { notFound } from "next/navigation";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { getProjectBySlug, projects } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";

interface ProjectPageProps { params: Promise<{ slug: string }>; }

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return project ? createMetadata(project.title, project.description) : createMetadata("Work");
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <><Section className="project-hero"><p className="eyebrow">{project.category} / {project.year}</p><Heading level={1}>{project.title}</Heading><Text size="large" className="project-lede">{project.introduction}</Text><div className="project-image-placeholder"><span className="mono-label">Project image placeholder</span></div></Section><Section className="project-story"><div className="story-row"><p className="eyebrow">The challenge</p><Text size="large">{project.challenge}</Text></div><div className="story-row"><p className="eyebrow">The approach</p><Text size="large">{project.approach}</Text></div><div className="story-row"><p className="eyebrow">The result</p><Text size="large">{project.result}</Text></div></Section></>;
}
