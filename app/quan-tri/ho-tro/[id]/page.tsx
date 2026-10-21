import {redirect} from "next/navigation";
import {notFound} from "next/navigation";
import {requireAdmin} from "@/lib/auth/authorization";
import {requireOperations} from "@/lib/operations/access";
import {uuidPattern} from "@/lib/operations/models";
type Props={params:Promise<{id:string}>};
export default async function AdminTicketLink({params}:Props){
 await requireAdmin();requireOperations();
 const {id}=await params;
 if(!uuidPattern.test(id))notFound();
 redirect("/tai-khoan/ho-tro/"+id);
}
