import Link from "next/link";
import {notFound} from "next/navigation";
import {requireUser,verifiedRole} from "@/lib/auth/authorization";
import {serverAuthClient} from "@/lib/auth/server";
import {createMetadata} from "@/lib/metadata";
import {requireOperations} from "@/lib/operations/access";
import {OperationsShell,StatusPill,EmptyState,SectionTitle,ErrorState} from "@/components/dashboard/OperationsShell";
import {projectStatus,milestoneStatus,ticketStatus,formatDate,messageFromNotice,uuidPattern} from "@/lib/operations/models";
import {changeProjectStatus,changeMilestoneStatus,createMilestone,uploadDocument} from "@/lib/operations/actions";
export const dynamic="force-dynamic";
export const metadata={...createMetadata("Tiến độ dự án"),robots:{index:false,follow:false}};
type Props={params:Promise<{id:string}>;searchParams:Promise<{notice?:string}>};
export default async function ProjectDetail({params,searchParams}:Props){
 const user=await requireUser();requireOperations();
 const {id}=await params,{notice}=await searchParams;
 if(!uuidPattern.test(id))notFound();
 const db=await serverAuthClient();
 const {data:project,error:projectError}=await db!.from("athena_projects")
  .select("id,name,summary,status,start_date,due_date,created_at").eq("id",id).maybeSingle();
 if(projectError)return <OperationsShell title="Dự án" subtitle="Không thể tải dữ liệu."><ErrorState/></OperationsShell>;
 if(!project)notFound();
 const role=await verifiedRole(user.id),isAdmin=role==="admin";
 const [milestones,tickets,documents,audit]=await Promise.all([
  db!.from("athena_milestones").select("id,title,description,status,due_date").eq("project_id",id).order("position"),
  db!.from("athena_tickets").select("id,title,status,created_at").eq("project_id",id).order("created_at",{ascending:false}),
  db!.from("athena_documents").select("id,file_name,size_bytes,created_at").eq("project_id",id).order("created_at",{ascending:false}),
  db!.from("athena_audit_events").select("id,event_type,old_value,new_value,created_at").eq("project_id",id).order("created_at",{ascending:false}).limit(40)
 ]);
 const failed=milestones.error||tickets.error||documents.error||audit.error;
 return <OperationsShell title={project.name} subtitle={project.summary||"Theo dõi tiến độ được cập nhật bởi Athena."} admin={isAdmin} notice={notice}>
  <div className="ops-meta"><div><span>TRẠNG THÁI</span><StatusPill value={project.status} label={projectStatus[project.status as keyof typeof projectStatus]||"Chưa xác định"}/></div>
   <div><span>BẮT ĐẦU</span><strong>{formatDate(project.start_date)}</strong></div><div><span>DỰ KIẾN</span><strong>{formatDate(project.due_date)}</strong></div></div>
  {failed?<ErrorState/>:<>
   <SectionTitle index="01 / TIẾN ĐỘ" title="Các cột mốc." detail="Trạng thái được xác nhận và cập nhật bởi Athena, không phải dự báo tự động."/>
   {milestones.data?.length?<div className="ops-milestone-list">{milestones.data.map((m,i)=><article className="ops-milestone" key={m.id}>
    <span className="ops-milestone-number">{String(i+1).padStart(2,"0")}</span>
    <div><h3>{m.title}</h3><p>{m.description||"Chưa có mô tả chi tiết."}</p><small>Hạn dự kiến · {formatDate(m.due_date)}</small></div>
    <div><StatusPill value={m.status} label={milestoneStatus[m.status as keyof typeof milestoneStatus]||"Chưa xác định"}/>
     {isAdmin&&<form action={changeMilestoneStatus} className="ops-inline-form"><input type="hidden" name="id" value={m.id}/><input type="hidden" name="project_id" value={id}/>
      <label>Đổi trạng thái<select name="status" defaultValue={m.status}>{Object.entries(milestoneStatus).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
      <button type="submit">Lưu ↗</button></form>}</div>
   </article>)}</div>:<EmptyState title="Chưa có cột mốc." description="Các cột mốc sẽ được cập nhật khi Athena hoàn tất kế hoạch triển khai."/>}
   {isAdmin&&<div className="ops-admin-form"><h3>Thêm cột mốc</h3><form action={createMilestone} className="ops-form">
    <input name="project_id" value={id} type="hidden"/><label>Tiêu đề<input name="title" minLength={3} maxLength={150} required placeholder="Ví dụ: Nghiên cứu và thiết kế"/></label>
    <label>Ngày dự kiến<input name="due_date" type="date"/></label><label>Mô tả<textarea name="description" maxLength={1500} rows={3}/></label>
    <button type="submit" className="pill-link pill-dark">Thêm cột mốc ↗</button></form></div>}
   <SectionTitle index="02 / HỖ TRỢ" title="Trao đổi dự án."/>
   {tickets.data?.length?<div className="ops-simple-list">{tickets.data.map(t=><Link href={"/account/support/"+t.id} key={t.id}>
     <div><strong>{t.title}</strong><small>{formatDate(t.created_at)}</small></div><StatusPill value={t.status} label={ticketStatus[t.status as keyof typeof ticketStatus]||"Chưa xác định"}/><span>↗</span></Link>)}</div>:<EmptyState title="Chưa có yêu cầu hỗ trợ." description="Bạn có thể gửi yêu cầu khi cần trao đổi hoặc yêu cầu điều chỉnh." action={<Link href="/account/support" className="underlined-link">Gửi yêu cầu ↗</Link>}/>}
   <SectionTitle index="03 / TÀI LIỆU" title="Tệp riêng tư." detail="Mọi tài liệu chỉ được tải xuống qua liên kết tạm thời sau khi hệ thống xác nhận quyền dự án."/>
   {documents.data?.length?<div className="ops-simple-list">{documents.data.map(doc=><a href={"/api/operations/documents/"+doc.id} key={doc.id}>
     <div><strong>{doc.file_name}</strong><small>{(doc.size_bytes/1024).toFixed(0)} KB · {formatDate(doc.created_at)}</small></div><span>Tải tài liệu ↗</span></a>)}</div>:<EmptyState title="Chưa có tài liệu." description="Athena chưa tải tài liệu được cấp phép chia sẻ cho dự án này."/>}
   {isAdmin&&<div className="ops-admin-form"><h3>Tải tài liệu riêng tư</h3><p>Tối đa 8 MB, chỉ PDF, PNG, JPG hoặc WebP. Tệp không công khai và cần đăng nhập để yêu cầu liên kết tải xuống.</p>
    <form action={uploadDocument} className="ops-form"><input type="hidden" name="project_id" value={id}/>
    <label>Chọn tệp<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" required/></label><button className="pill-link pill-dark" type="submit">Tải lên ↗</button></form></div>}
   <SectionTitle index="04 / LỊCH SỬ" title="Dấu vết hoạt động." detail="Các sự kiện chính được ghi nhận tự động khi dự án thay đổi, không thể chỉnh sửa từ giao diện khách hàng."/>
   {audit.data?.length?<div className="ops-simple-list">{audit.data.map(event=><div className="ops-audit-row" key={event.id}>
    <span>{formatDate(event.created_at)}</span><strong>{({project_created:"Tạo dự án",project_status:"Cập nhật trạng thái dự án",milestone_created:"Tạo cột mốc",milestone_status:"Cập nhật cột mốc",ticket_created:"Tạo yêu cầu",ticket_status:"Cập nhật hỗ trợ",ticket_message:"Tin nhắn mới",document_registered:"Đăng ký tài liệu"} as Record<string,string>)[event.event_type]||"Hoạt động dự án"}</strong>
    <span>{event.old_value&&event.new_value?event.old_value+" → "+event.new_value:"Đã ghi nhận"}</span>
   </div>)}</div>:<EmptyState title="Chưa có nhật ký." description="Lịch sử sẽ được tạo khi các hoạt động dự án được ghi nhận trong hệ thống."/>}
   {isAdmin&&<div className="ops-admin-form"><h3>Quản lý trạng thái dự án</h3><form action={changeProjectStatus} className="ops-form">
    <input type="hidden" name="id" value={id}/><label>Trạng thái<select name="status" defaultValue={project.status}>{Object.entries(projectStatus).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
    <button className="pill-link pill-dark" type="submit">Cập nhật dự án ↗</button></form></div>}
  </>}
  <div className="ops-bottom-link"><Link href="/account/projects">← Tất cả dự án</Link></div>
  {messageFromNotice(notice)&&<span className="sr-only">{messageFromNotice(notice)}</span>}
 </OperationsShell>;
}
