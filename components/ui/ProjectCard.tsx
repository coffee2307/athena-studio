import type {Project} from "@/types/project";
import {ProjectCard as CanonicalCard} from "@/components/portfolio/ProjectCard";
export function ProjectCard({project}:{project:Project}){return <CanonicalCard project={project} index={0}/>;}
