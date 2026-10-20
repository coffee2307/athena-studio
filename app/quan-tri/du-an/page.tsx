import Link from "next/link";
import {requireAdmin} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
import {OperationsShell,EmptyState,ErrorState,SectionTitle,StatusPill} from "@/components/dashboard/OperationsShell";
import {createProject} from "@/lib/operations/actions";
import {projectStatus} from "@/lib/operations/models";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Quản lý dự án"),robots:{index:false,follow:false}};
type Props={searchParams:Promise<{notice?:string}>};
export default async function AdminProjects({searchParams}:Props){
 await requireAdmin();requireOperations();const db=await serverAuthClient(),{notice}=await searchParams;
 const [workspaces,projects]=await Promise.all([
  db!.from("athena_workspaces").select("id,name,kind").eq("kind","client").order("name"),
  db!.from("athena_projects").select("id,name,status").order("created_at",{ascending:false})
 ]);
 return <OperationsShell admin title="Quản lý dự án" subtitle="Tạo dự án cho workspace khách hàng đã được xác minh. Chỉ tài khoản quản trị studio có quyền thay đổi dữ liệu." notice={notice}>
  {workspaces.error||projects.error?<ErrorState/>:<>
   <SectionTitle index="01 / DỰ ÁN" title="Danh sách dự án."/>
   {projects.data?.length?<div className="ops-simple-list">{projects.data.map(p=><Link key={p.id} href={"/tai-khoan/du-an/"+p.id}>
    <strong>{p.name}</strong><StatusPill value={p.status} label={projectStatus[p.status as keyof typeof projectStatus]||"Chưa xác định"}/><span>↗</span></Link>)}</div>:<EmptyState title="Chưa có dự án." description="Danh sách sẽ được cập nhật khi admin tạo dự án thật."/>}
   <SectionTitle index="02 / TẠO DỰ ÁN" title="Khởi tạo dự án."/>
   {workspaces.data?.length?<form action={createProject} className="ops-admin-form ops-form">
    <label>Workspace khách hàng<select required name="workspace_id" defaultValue=""><option value="" disabled>Chọn workspace đã xác minh</option>
     {workspaces.data.map(w=><option value={w.id} key={w.id}>{w.name}</option>)}</select></label>
    <label>Tên dự án<input name="name" required minLength={3} maxLength={150} placeholder="Tên dự án khách hàng"/></label>
    <label>Mô tả<textarea name="summary" maxLength={3000} rows={4} placeholder="Mục tiêu, phạm vi công việc và các mốc quan trọng"/></label>
    <label>Ngày dự kiến<input type="date" name="due_date"/></label>
    <button className="pill-link pill-dark" type="submit">Tạo dự án ↗</button>
   </form>:<EmptyState title="Chưa có workspace khách hàng." description="Để ngăn gán nhầm dữ liệu, workspace và thành viên phải được cấp quyền qua quy trình quản trị đã xác minh. Chưa hỗ trợ tự tạo workspace công khai."/>}
  </>}
 </OperationsShell>;
}
