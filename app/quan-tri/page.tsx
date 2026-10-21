import Link from "next/link";
import {requireAdmin} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
import {OperationsShell,ErrorState,EmptyState,SectionTitle,StatusPill} from "@/components/dashboard/OperationsShell";
import {projectStatus,ticketStatus,formatDate} from "@/lib/operations/models";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Bảng điều hành Athena"),robots:{index:false,follow:false}};
type Props={searchParams:Promise<{notice?:string}>};
export default async function AdminDashboard({searchParams}:Props){
 await requireAdmin();requireOperations();const db=await serverAuthClient(),{notice}=await searchParams;
 const [projects,tickets,documents]=await Promise.all([
  db!.from("athena_projects").select("id,name,status,created_at").order("created_at",{ascending:false}).limit(10),
  db!.from("athena_tickets").select("id,title,status,created_at").order("created_at",{ascending:false}).limit(10),
  db!.from("athena_documents").select("id").limit(1000)
 ]);
 const error=projects.error||tickets.error||documents.error;
 return <OperationsShell admin title="Bảng điều hành" subtitle="Quản lý dữ liệu dự án thực tế và yêu cầu hỗ trợ được phân quyền. Không có dữ liệu khách hàng minh họa." notice={notice}>
  {error?<ErrorState/>:<>
   <div className="ops-stat-grid"><div><span>DỰ ÁN</span><strong>{projects.data?.length||0}</strong><small>Hiển thị tối đa 10 dự án gần nhất</small></div>
   <div><span>YÊU CẦU MỚI / CHƯA ĐÓNG</span><strong>{tickets.data?.filter(t=>t.status!=="closed").length||0}</strong><small>Trong 10 yêu cầu gần nhất</small></div>
   <div><span>TÀI LIỆU</span><strong>{documents.data?.length||0}</strong><small>Tối đa 1.000 bản ghi</small></div></div>
   <SectionTitle index="01 / DỰ ÁN" title="Tiến độ gần đây."/>
   {projects.data?.length?<div className="ops-simple-list">{projects.data.map(p=><Link key={p.id} href={"/tai-khoan/du-an/"+p.id}>
    <div><strong>{p.name}</strong><small>{formatDate(p.created_at)}</small></div>
    <StatusPill value={p.status} label={projectStatus[p.status as keyof typeof projectStatus]||"Đang cập nhật"}/><span>↗</span></Link>)}</div>:<EmptyState title="Chưa có dự án." description="Hãy tạo không gian làm việc khách hàng được ủy quyền trước, sau đó tạo dự án tương ứng."/>}
   <div className="ops-bottom-link"><Link href="/quan-tri/du-an">Quản lý và tạo dự án ↗</Link></div>
   <SectionTitle index="02 / HỖ TRỢ" title="Yêu cầu gần đây."/>
   {tickets.data?.length?<div className="ops-simple-list">{tickets.data.map(t=><Link key={t.id} href={"/tai-khoan/ho-tro/"+t.id}>
    <div><strong>{t.title}</strong><small>{formatDate(t.created_at)}</small></div>
    <StatusPill value={t.status} label={ticketStatus[t.status as keyof typeof ticketStatus]||"Đang cập nhật"}/><span>↗</span></Link>)}</div>:<EmptyState title="Chưa có yêu cầu hỗ trợ." description="Các yêu cầu mới sẽ xuất hiện tại đây khi khách hàng được cấp quyền sử dụng hệ thống."/>}
   <div className="ops-bottom-link"><Link href="/quan-tri/ho-tro">Quản lý hỗ trợ ↗</Link></div>
  </>}
 </OperationsShell>;
}
