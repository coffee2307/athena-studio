import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {WorldSite,type WorldSection} from "@/components/templates/WorldSite";
import {getTemplate,templates} from "@/lib/templates";
const sections=["work","services","about","contact"] as const;
type Props={params:Promise<{slug:string;section:string}>};
export function generateStaticParams(){return templates.flatMap(t=>sections.map(section=>({slug:t.slug,section})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug,section}=await params;const item=getTemplate(slug);
 return {title:(sections.find(s=>s===section)??"Website")+" — "+(item?.title??"Demo"),robots:{index:false,follow:false}};
}
export default async function DemoSectionPage({params}:Props){
 const {slug,section}=await params;
 if(!getTemplate(slug)||!sections.some(s=>s===section))notFound();
 return <WorldSite slug={slug} section={section as WorldSection}/>;
}
