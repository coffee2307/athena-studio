import Link from "next/link";
import {requireUser} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
import {OperationsShell,StatusPill,EmptyState,ErrorState,SectionTitle} from "@/components/dashboard/OperationsShell";
import {ticketStatus,formatDate} from "@/lib/operations/models";
import {createTicket} from "@/lib/operations/actions";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Yêu cầu hỗ trợ"),robots:{index:false,follow:false}};
type Props={searchParams:Promise<{notice?:string}>};
export default async function TicketDirectory({searchParams}:Props){
 await requireUser();requireOperations();const db=await serverAuthClient(),{notice}=await searchParams;
 const [tickets,projects]=await Promise.all([
  db!.from("athena_tickets").select("id,title,status,created_at,project_id").order("created_at",{ascending:false}).limit(100),
  db!.from("athena_projects").select("id,name").order("name")
 ]);
 return <OperationsShell title="Hỗ trợ dự án" subtitle="Gửi yêu cầu và theo dõi trao đổi được lưu trong hệ thống, chỉ dành cho những dự án bạn được phép truy cập." notice={notice}>
  {tickets.error||projects.error?<ErrorState/>:<>
   <SectionTitle index="01 / YÊU CẦU" title="Lịch sử hỗ trợ."/>
   {tickets.data?.length?<div className="ops-simple-list">{tickets.data.map(t=><Link href={"/tai-khoan/ho-tro/"+t.id} key={t.id}>
    <div><strong>{t.title}</strong><small>{formatDate(t.created_at)}</small></div><StatusPill value={t.status} label={ticketStatus[t.status as keyof typeof ticketStatus]||"Chưa xác định"}/><span>↗</span></Link>)}</div>:<EmptyState title="Chưa có yêu cầu." description="Bạn chưa tạo yêu cầu hỗ trợ nào trong các dự án được phân quyền."/>}
   <SectionTitle index="02 / YÊU CẦU MỚI" title="Cần Athena hỗ trợ?"/>
   {projects.data?.length?<form className="ops-admin-form ops-form" action={createTicket}>
    <label>Dự án<select name="project_id" required defaultValue=""><option value="" disabled>Chọn dự án được phân quyền</option>{projects.data.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label>Chủ đề<input name="title" minLength={5} maxLength={160} required placeholder="Bạn cần hỗ trợ vấn đề nào?"/></label>
    <label>Mô tả<textarea name="description" minLength={15} maxLength={4000} required rows={5} placeholder="Mô tả chi tiết và cách Athena có thể hỗ trợ"/></label>
    <p>Không gửi mật khẩu, khóa API hoặc dữ liệu nhạy cảm qua biểu mẫu hỗ trợ.</p>
    <button className="pill-link pill-dark" type="submit">Tạo yêu cầu ↗</button>
   </form>:<EmptyState title="Chưa được phân công dự án." description="Bạn cần có một dự án được Athena cấp quyền trước khi gửi yêu cầu hỗ trợ trong hệ thống." action={<Link href="/lien-he" className="underlined-link">Liên hệ qua email ↗</Link>}/>}
  </>}
 </OperationsShell>;
}
