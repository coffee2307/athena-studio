"use client";
import Link from "next/link";
import {useEffect} from "react";
export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
 useEffect(()=>{if(error.digest)console.error("Athena page error",error.digest);},[error.digest]);
 return <section className="page-section not-found" role="alert">
  <div className="container">
   <p className="page-kicker">LỖI TẠM THỜI / ATHENA</p>
   <h2>Trang đang gặp<br/><em>một sự cố.</em></h2>
   <p style={{margin:"25px 0",color:"#666",maxWidth:550,lineHeight:1.8}}>Bạn có thể thử tải lại hoặc quay về trang chủ. Nếu sự cố tiếp diễn, vui lòng liên hệ Athena qua email.</p>
   <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
    <button className="pill-link pill-dark" onClick={reset}>Thử lại </button>
    <Link className="pill-link" href="/">Về trang chủ </Link>
   </div>
  </div>
 </section>;
}
