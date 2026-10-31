import {notFound} from "next/navigation";
import {requireUser,verifiedRole} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
import {OperationsShell,StatusPill,EmptyState,ErrorState,SectionTitle} from "@/components/dashboard/OperationsShell";
import {ticketStatus,formatDate,uuidPattern} from "@/lib/operations/models";
import {addTicketMessage,changeTicketStatus} from "@/lib/operations/actions";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Trao đổi hỗ trợ"),robots:{index:false,follow:false}};
type Props={params:Promise<{id:string}>;searchParams:Promise<{notice?:string}>};
export default async function TicketDetail({params,searchParams}:Props){
 const user=await requireUser();requireOperations();
 const {id}=await params,{notice}=await searchParams;
 if(!uuidPattern.test(id))notFound();
 const db=await serverAuthClient();
 const {data:ticket,error}=await db!.from("athena_tickets")
  .select("id,title,description,status,created_at,project_id").eq("id",id).maybeSingle();
 if(error)return <OperationsShell title="Yêu cầu hỗ trợ" subtitle="Lỗi tải dữ liệu"><ErrorState/></OperationsShell>;
 if(!ticket)notFound();
 const isAdmin=await verifiedRole(user.id)==="admin";
 const messages=await db!.from("athena_ticket_messages")
  .select("id,author_id,body,created_at").eq("ticket_id",id).order("created_at");
 return <OperationsShell title={ticket.title} subtitle={ticket.description} admin={isAdmin} notice={notice}>
  <div className="ops-meta"><div><span>TRẠNG THÁI</span><StatusPill value={ticket.status} label={ticketStatus[ticket.status as keyof typeof ticketStatus]||"Chưa xác định"}/></div><div><span>NGÀY GỬI</span><strong>{formatDate(ticket.created_at)}</strong></div></div>
  <SectionTitle index="01 / HỘI THOẠI" title="Tin nhắn dự án."/>
  {messages.error?<ErrorState/>:messages.data?.length?<div className="ops-message-list">{messages.data.map(msg=><article key={msg.id} className={msg.author_id===user.id?"ops-message ops-message-self":"ops-message"}>
   <span>{msg.author_id===user.id?"BẠN":"THÀNH VIÊN DỰ ÁN"} · {formatDate(msg.created_at)}</span>
   <p>{msg.body}</p>
  </article>)}</div>:<EmptyState title="Chưa có phản hồi." description="Hội thoại chưa có tin nhắn tiếp theo."/>}
  {ticket.status!=="closed"&&<form className="ops-admin-form ops-form" action={addTicketMessage}>
   <input type="hidden" name="ticket_id" value={id}/><label>Viết phản hồi<textarea name="body" rows={5} required minLength={1} maxLength={4000} placeholder="Nội dung trao đổi"/></label>
   <button className="pill-link pill-dark" type="submit">Gửi phản hồi </button></form>}
  {isAdmin&&<div className="ops-admin-form"><h3>Cập nhật trạng thái yêu cầu</h3><form action={changeTicketStatus} className="ops-form">
   <input name="ticket_id" type="hidden" value={id}/><label>Trạng thái<select name="status" defaultValue={ticket.status}>{Object.entries(ticketStatus).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
   <button className="pill-link pill-dark" type="submit">Lưu trạng thái </button>
  </form></div>}
 </OperationsShell>;
}
