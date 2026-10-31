import {notFound} from "next/navigation";
import {Site} from "../../components/Site";
const sections=["work","services","about","contact"] as const;
export function generateStaticParams(){return sections.map(section=>({section}));}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!sections.includes(section as typeof sections[number]))notFound();return <Site section={section as "work"|"services"|"about"|"contact"}/>;}
