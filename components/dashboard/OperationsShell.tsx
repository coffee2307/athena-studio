import Link from "next/link";
import type {ReactNode} from "react";
import {messageFromNotice} from "@/lib/operations/models";

export function OperationsShell({children,admin=false,notice,title,subtitle}:{children:ReactNode;admin?:boolean;notice?:string;title:string;subtitle:string}){
 const nav=admin?[
  {href:"/admin",label:"Tổng quan"},
  {href:"/admin/projects",label:"Dự án"},
  {href:"/admin/support",label:"Hỗ trợ"},
  {href:"/account",label:"Hồ sơ"}
 ]:[
  {href:"/account",label:"Hồ sơ"},
  {href:"/account/projects",label:"Dự án"},
  {href:"/account/support",label:"Hỗ trợ"}
 ];
 return <section className="ops-app">
  <div className="container">
   <p className="small-index">ATHENA STUDIO / {admin?"ĐIỀU HÀNH":"KHÔNG GIAN KHÁCH HÀNG"}</p>
   <h1>{title}<em>.</em></h1>
   <p className="ops-intro">{subtitle}</p>
   <nav className="ops-tabs" aria-label="Điều hướng khu vực tài khoản">{nav.map(item=><Link href={item.href} key={item.href}>{item.label} <span aria-hidden="true"></span></Link>)}</nav>
   {messageFromNotice(notice)&&<p className="ops-notice" role="status">{messageFromNotice(notice)}</p>}
   {children}
  </div>
 </section>;
}
export function StatusPill({value,label}:{value:string;label:string}){
 return <span className={"ops-status ops-status-"+value.replace(/[^a-z_]/g,"")}>{label}</span>;
}
export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}){
 return <div className="ops-empty"><span aria-hidden="true" className="ops-empty-orbit"/><p className="small-index">CHƯA CÓ DỮ LIỆU</p><h2>{title}</h2><p>{description}</p>{action&&<div className="ops-empty-action">{action}</div>}</div>;
}
export function ErrorState(){
 return <div role="alert" className="ops-error"><strong>Chưa tải được dữ liệu.</strong><p>Vui lòng thử tải lại hoặc liên hệ Athena. Không có nội dung minh họa thay cho dữ liệu khách hàng thật.</p></div>;
}
export function SectionTitle({index,title,detail}:{index:string;title:string;detail?:string}){
 return <div className="ops-section-title"><p className="small-index">{index}</p><h2>{title}</h2>{detail&&<p>{detail}</p>}</div>;
}
