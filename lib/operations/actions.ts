"use server";
import {randomUUID} from "node:crypto";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {requireUser,requireAdmin} from "@/lib/auth/authorization";
import {requireOperations} from "./access";
import {serverAuthClient} from "@/lib/auth/server";
import {allowedState,safeDate,safeText,safeUuid,projectStatus,milestoneStatus,ticketStatus} from "./models";

function finish(path:string,result:"created"|"updated"|"sent"|"uploaded"|"read"|"invalid"|"error"):never{
 redirect(path+(path.includes("?")?"&":"?")+"notice="+result);
}
export async function createProject(form:FormData){
 requireOperations();const user=await requireAdmin(),client=await serverAuthClient();
 const workspace=safeUuid(form.get("workspace_id")),name=safeText(form.get("name"),3,150);
 const summary=safeText(form.get("summary")||"",0,3000);
 const due=safeDate(form.get("due_date"));
 if(!client||!workspace||!name||summary===null||!due&&form.get("due_date"))finish("/quan-tri","invalid");
 const {error}=await client.from("athena_projects").insert({workspace_id:workspace,name,summary,due_date:due,created_by:user.id});
 if(error)finish("/quan-tri","error");
 revalidatePath("/quan-tri");finish("/quan-tri","created");
}
export async function changeProjectStatus(form:FormData){
 requireOperations();await requireAdmin();const client=await serverAuthClient();
 const id=safeUuid(form.get("id")),status=allowedState(form.get("status"),projectStatus);
 if(!client||!id||!status)finish("/quan-tri","invalid");
 const {data,error}=await client.from("athena_projects").update({status}).eq("id",id).select("id").maybeSingle();
 if(error||!data)finish("/quan-tri","error");
 revalidatePath("/quan-tri");revalidatePath("/tai-khoan/du-an/"+id);
 finish("/tai-khoan/du-an/"+id,"updated");
}
export async function createMilestone(form:FormData){
 requireOperations();await requireAdmin();const client=await serverAuthClient();
 const id=safeUuid(form.get("project_id")),title=safeText(form.get("title"),3,150);
 const description=safeText(form.get("description")||"",0,1500);
 const due=safeDate(form.get("due_date"));
 if(!client||!id||!title||description===null||!due&&form.get("due_date"))finish("/quan-tri","invalid");
 const {error}=await client.from("athena_milestones").insert({project_id:id,title,description,due_date:due});
 if(error)finish("/tai-khoan/du-an/"+id,"error");
 revalidatePath("/tai-khoan/du-an/"+id);finish("/tai-khoan/du-an/"+id,"created");
}
export async function changeMilestoneStatus(form:FormData){
 requireOperations();await requireAdmin();const client=await serverAuthClient();
 const id=safeUuid(form.get("id")),project=safeUuid(form.get("project_id"));
 const status=allowedState(form.get("status"),milestoneStatus);
 if(!client||!id||!project||!status)finish("/quan-tri","invalid");
 const {data,error}=await client.from("athena_milestones").update({status}).eq("id",id).eq("project_id",project).select("id").maybeSingle();
 if(error||!data)finish("/tai-khoan/du-an/"+project,"error");
 revalidatePath("/tai-khoan/du-an/"+project);finish("/tai-khoan/du-an/"+project,"updated");
}
export async function createTicket(form:FormData){
 requireOperations();const user=await requireUser(),client=await serverAuthClient();
 const project=safeUuid(form.get("project_id")),title=safeText(form.get("title"),5,160);
 const description=safeText(form.get("description"),15,4000);
 if(!client||!project||!title||!description)finish("/tai-khoan/ho-tro","invalid");
 const {data,error}=await client.from("athena_tickets").insert({project_id:project,author_id:user.id,title,description}).select("id").maybeSingle();
 if(error||!data)finish("/tai-khoan/ho-tro","error");
 revalidatePath("/tai-khoan/ho-tro");
 redirect("/tai-khoan/ho-tro/"+data.id+"?notice=created");
}
export async function addTicketMessage(form:FormData){
 requireOperations();const user=await requireUser(),client=await serverAuthClient();
 const ticket=safeUuid(form.get("ticket_id")),body=safeText(form.get("body"),1,4000);
 if(!client||!ticket||!body)finish("/tai-khoan/ho-tro","invalid");
 const {error}=await client.from("athena_ticket_messages").insert({ticket_id:ticket,author_id:user.id,body});
 if(error)finish("/tai-khoan/ho-tro/"+ticket,"error");
 revalidatePath("/tai-khoan/ho-tro/"+ticket);finish("/tai-khoan/ho-tro/"+ticket,"sent");
}
export async function changeTicketStatus(form:FormData){
 requireOperations();await requireAdmin();const client=await serverAuthClient();
 const ticket=safeUuid(form.get("ticket_id")),status=allowedState(form.get("status"),ticketStatus);
 if(!client||!ticket||!status)finish("/quan-tri/ho-tro","invalid");
 const {data,error}=await client.from("athena_tickets").update({status}).eq("id",ticket).select("id").maybeSingle();
 if(error||!data)finish("/tai-khoan/ho-tro/"+ticket,"error");
 revalidatePath("/quan-tri/ho-tro");revalidatePath("/tai-khoan/ho-tro/"+ticket);
 finish("/tai-khoan/ho-tro/"+ticket,"updated");
}
export async function readNotification(form:FormData){
 requireOperations();const user=await requireUser(),client=await serverAuthClient();
 const notification=safeUuid(form.get("id"));
 if(!client||!notification)finish("/tai-khoan","invalid");
 const {data,error}=await client.from("athena_notifications").update({is_read:true}).eq("id",notification).eq("recipient_id",user.id).select("id").maybeSingle();
 if(error||!data)finish("/tai-khoan","error");
 revalidatePath("/tai-khoan");finish("/tai-khoan","read");
}
export async function uploadDocument(form:FormData){
 requireOperations();const user=await requireAdmin(),client=await serverAuthClient();
 const project=safeUuid(form.get("project_id"));
 const candidate=form.get("file");
 if(!client||!project||!(candidate instanceof File)||candidate.size<1||candidate.size>8388608)
  finish("/quan-tri","invalid");
 const allowed=["application/pdf","image/png","image/jpeg","image/webp"];
 if(!allowed.includes(candidate.type))finish("/tai-khoan/du-an/"+project,"invalid");
 const fileName=candidate.name.replace(/[\\/\u0000-\u001f]/g,"_").trim().slice(0,180);
 if(!fileName)finish("/tai-khoan/du-an/"+project,"invalid");
 const storageName=project+"/"+randomUUID()+"-"+fileName;
 // Save metadata first: the Storage SELECT policy requires an authorized project
 // AND a database metadata record; do not use service_role keys in client/browser.
 const {data:doc,error}=await client.from("athena_documents").insert({
  project_id:project,file_name:fileName,object_path:storageName,
  content_type:candidate.type,size_bytes:candidate.size,uploaded_by:user.id
 }).select("id").maybeSingle();
 if(error||!doc)finish("/tai-khoan/du-an/"+project,"error");
 let uploaded=false;
 try{
  const {error:storageError}=await client.storage.from("athena-project-files")
   .upload(storageName,await candidate.arrayBuffer(),{contentType:candidate.type,upsert:false});
  uploaded=!storageError;
 }catch{uploaded=false;}
 if(!uploaded){
  const {data:cleaned,error:cleanupError}=await client.rpc("athena_discard_failed_document",{p_document_id:doc.id});
  if(cleanupError||cleaned!==true)console.error("Athena failed upload may need private operator reconciliation");
  finish("/tai-khoan/du-an/"+project,"error");
 }
 revalidatePath("/tai-khoan/du-an/"+project);finish("/tai-khoan/du-an/"+project,"uploaded");
}
