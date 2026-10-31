import {notFound} from "next/navigation";
import {Site} from "../../../components/Site";
export function generateStaticParams(){return [1,2,3,4,5].map(item=>({item:String(item)}));}
export default async function ProductOrCaseDetail({params}:{params:Promise<{item:string}>}){const {item}=await params;if(!["1","2","3","4","5"].includes(item))notFound();return <Site section="detail" itemIndex={Number(item)}/>;}
