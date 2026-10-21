import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
export const metadata={title:"Chuyển đến hồ sơ — Athena Studio",robots:{index:false,follow:false}};
export default function AccountPreview(){redirect("/profile");}
