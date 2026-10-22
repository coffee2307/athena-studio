import {notFound} from "next/navigation";
import {WorldSite} from "@/components/templates/WorldSite";
import {getTemplate,templates} from "@/lib/templates";
import type {Metadata} from "next";

type Props={params:Promise<{slug:string}>;searchParams:Promise<{embed?:string}>};
export function generateStaticParams(){return templates.map(template=>({slug:template.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const item=getTemplate(slug);
 if(!item)return {title:"Không tìm thấy demo"};
 return {title:"Demo "+item.title+" — Athena Studio",description:item.description,robots:{index:false,follow:false}};
}
export default async function TemplateDemoPage({params,searchParams}:Props){
 const [{slug},{embed}]=await Promise.all([params,searchParams]);
 if(!getTemplate(slug))notFound();
 return <WorldSite slug={slug} section="home" embedded={embed==="1"}/>;
}
