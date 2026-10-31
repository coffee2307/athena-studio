import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {SovereignDemoRoute} from "@/components/sovereign/SovereignDemoRoute";
import {getTemplate,templates} from "@/lib/templates";
type Props={params:Promise<{slug:string;item:string}>};
export function generateStaticParams(){return templates.flatMap(t=>Array.from({length:["creative-studio","commerce-standard"].includes(t.slug)?5:3},(_,i)=>({slug:t.slug,item:String(i+1)})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug,item}=await params;const t=getTemplate(slug);
 return {title:(t?.title??"Demo")+" — Nội dung "+item,robots:{index:false,follow:false}};
}
export default async function DemoDetailPage({params}:Props){
 const {slug,item}=await params;
 const max=["creative-studio","commerce-standard"].includes(slug)?5:3;
 if(!getTemplate(slug)||!Number.isInteger(Number(item))||Number(item)<1||Number(item)>max)notFound();
 return <SovereignDemoRoute slug={slug} section="detail" itemIndex={Number(item)}/>;
}
