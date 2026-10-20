import Link from "next/link";
import {requireAdmin} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
import {OperationsShell,ErrorState,EmptyState,SectionTitle,StatusPill} from "@/components/dashboard/OperationsShell";
import {ticketStatus,formatDate} from "@/lib/operations/models";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Quản lý yêu cầu hỗ trợ"),robots:{index:false,follow:false}};
type Props={searchParams:Promise<{notice?:string}>};
export default async function AdminTickets({searchParams}:Props){
 await requireAdmin();requireOperations();const db=await serverAuthClient(),{notice}=await searchParams;
 const {data,error}=await db!.from("athena_tickets")
  .select("id,title,status,created_at").order("created_at",{ascending:false}).limit(100);
 return <OperationsShell admin title="Hỗ trợ khách hàng" subtitle="Các yêu cầu thuộc dự án đang được Athena quản lý, với quyền truy cập theo workspace và audit log." notice={notice}>
  <SectionTitle index="01 / YÊU CẦU GẦN ĐÂY" title="Danh sách hỗ trợ."/>
  {error?<ErrorState/>:data?.length?<div className="ops-simple-list">{data.map(t=><Link href={"/tai-khoan/ho-tro/"+t.id} key={t.id}>
   <div><strong>{t.title}</strong><small>{formatDate(t.created_at)}</small></div>
   <StatusPill value={t.status} label={ticketStatus[t.status as keyof typeof ticketStatus]||"Đang cập nhật"}/><span>↗</span></Link>)}</div>:<EmptyState title="Chưa có yêu cầu." description="Hệ thống chưa tiếp nhận yêu cầu hỗ trợ từ các dự án được phân quyền."/>}
 </OperationsShell>;
}
