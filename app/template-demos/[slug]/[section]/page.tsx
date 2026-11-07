import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {SovereignDemoRoute} from "@/components/sovereign/SovereignDemoRoute";
import type {SovereignSection} from "@/data/sovereign-site-registry";
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
 return <SovereignDemoRoute slug={slug} section={section as SovereignSection}/>;
}
