"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Icon} from "@/components/ui/Icon";
import {consultationEmail} from "@/lib/contact-channels";

type Props={className:string;label:string;contactLabel?:string;iconSize?:number};
export function ConsultationCTA({className,label,contactLabel="Soạn email tư vấn",iconSize=18}:Props){
 const isContact=usePathname()==="/lien-he";
 const content=<>{isContact?contactLabel:label} <Icon name="arrow-up-right" size={iconSize}/></>;
 return isContact
  ? <a href={consultationEmail} className={className}>{content}</a>
  : <Link href="/lien-he" className={className}>{content}</Link>;
}
