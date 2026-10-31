import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {SovereignDemoRoute} from "@/components/sovereign/SovereignDemoRoute";
import {getTemplate,templates} from "@/lib/templates";
type Props={params:Promise<{slug:string;item:string}>};
export function generateStaticParams(){return templates.flatMap(t=>[1,2,3].map(item=>({slug:t.slug,item:String(item)})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug,item}=await params;const t=getTemplate(slug);
 return {title:(t?.title??"Demo")+" — Nội dung "+item,robots:{index:false,follow:false}};
}
export default async function DemoDetailPage({params}:Props){
 const {slug,item}=await params;
 if(!getTemplate(slug)||!["1","2","3"].includes(item))notFound();
 return <SovereignDemoRoute slug={slug} section="detail" itemIndex={Number(item)}/>;
}
