import Link from "next/link";
import {Icon} from "@/components/ui/Icon";
import {ProjectArtwork} from "./ProjectArtwork";
import type {Project} from "@/types/project";
export function ProjectCard({project,index}:{project:Project;index:number}){
 return <article className="case-card">
  <Link href={`/du-an/${project.slug}`} aria-label={`Xem nghiên cứu dự án ${project.title}`} className="case-card-link">
   <ProjectArtwork project={project} compact/>
   <div className="case-card-info">
    <div><p className="case-index">{String(index+1).padStart(2,"0")} / {project.kind==="research"?"NGHIÊN CỨU CÔNG NGHỆ":"THIẾT KẾ & SẢN PHẨM"}</p><h3>{project.title}</h3><p className="case-card-summary">{project.summary}</p></div>
    <span className="case-arrow"><Icon name="arrow-up-right" size={23}/></span>
   </div>
  </Link>
 </article>;
}
