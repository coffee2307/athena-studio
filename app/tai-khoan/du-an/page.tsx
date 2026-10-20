import Link from "next/link";
import {requireUser} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {projectStatus,formatDate} from "@/lib/operations/models";
import {OperationsShell,StatusPill,EmptyState,ErrorState} from "@/components/dashboard/OperationsShell";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Dự án của bạn"),robots:{index:false,follow:false}};
export default async function ProjectDirectory(){
 await requireUser();requireOperations();
 const db=await serverAuthClient();
 const {data,error}=await db!.from("athena_projects")
  .select("id,name,summary,status,due_date,created_at").order("created_at",{ascending:false}).limit(100);
 return <OperationsShell title="Dự án của bạn" subtitle="Các dự án mà tài khoản của bạn được cấp quyền theo dõi. Thông tin được lấy từ hệ thống thực và giới hạn theo không gian làm việc.">
  {error?<ErrorState/>:!data?.length?<EmptyState title="Chưa có dự án nào." description="Khi Athena phân công một dự án cho không gian làm việc của bạn, tiến độ và các tài liệu được phép xem sẽ xuất hiện tại đây." action={<Link href="/lien-he" className="pill-link pill-dark">Liên hệ Athena ↗</Link>}/>:<div className="ops-project-grid">
   {data.map((p,i)=><Link href={"/tai-khoan/du-an/"+p.id} className="ops-project-card" key={p.id}>
    <div className="ops-project-head"><span>0{(i%9)+1} / DỰ ÁN</span><StatusPill value={p.status} label={projectStatus[p.status as keyof typeof projectStatus]||"Đang cập nhật"}/></div>
    <h2>{p.name}</h2><p>{p.summary||"Dự án đang được cập nhật nội dung."}</p>
    <div className="ops-project-bottom"><span>HẠN DỰ KIẾN · {formatDate(p.due_date)}</span><strong>Chi tiết ↗</strong></div>
   </Link>)}
  </div>}
 </OperationsShell>;
}
