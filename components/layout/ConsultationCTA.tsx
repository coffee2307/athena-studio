"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "@/components/ui/Icon";
import {showContactDialog} from "@/lib/contact-channels";

type Props={className:string;label:string;contactLabel?:string;iconSize?:number};
export function ConsultationCTA({className,label,contactLabel="Soạn email tư vấn",iconSize=18}:Props){
 const isContact=usePathname()==="/contact";
 const content=<>{isContact?contactLabel:label} <Icon name="arrow-right" size={iconSize}/></>;
 return isContact
  ? <button type="button" onClick={()=>showContactDialog("email")} className={className}>{content}</button>
  : <Link href="/start" className={className}>{content}</Link>;
}
