"use client";
import Link from "next/link";
import {useEffect,useState,type FormEvent} from "react";
import site from "../data/site.json";
import s from "./workspace-sovereign.module.css";

type Section="home"|"work"|"services"|"about"|"contact"|"detail";
type Props={section?:Section;itemIndex?:number;basePath?:string;assetBase?:string};
type Stage="todo"|"doing"|"done";
type Task={id:number;title:string;team:string;stage:Stage};
type View="board"|"progress"|"people";
type Filter="all"|"todo"|"doing"|"done";
const seed:Task[]=[
 {id:1,title:"Xác định hướng thiết kế",team:"Thiết kế",stage:"done"},
 {id:2,title:"Hoàn thiện giao diện",team:"Thiết kế",stage:"doing"},
 {id:3,title:"Kiểm thử trên mobile",team:"Phát triển",stage:"doing"},
 {id:4,title:"Duyệt nội dung",team:"Nội dung",stage:"todo"},
 {id:5,title:"Tổng hợp phản hồi",team:"Vận hành",stage:"todo"}
];
const columns:[Stage,string,string][]=[["todo","Sắp thực hiện","Chưa bắt đầu"],["doing","Đang triển khai","Đang làm"],["done","Hoàn tất","Đã xong"]];
const features=[
 {number:"01",title:"Một chỗ cho mọi đầu việc.",label:"TỔ CHỨC / WORK BOARD",description:"Sắp xếp những việc cần làm, theo dõi ai phụ trách và đưa đầu việc sang giai đoạn tiếp theo mà không mất ngữ cảnh.",result:"Nhìn rõ việc cần làm và việc đã hoàn tất.",topic:"Dự án rõ ràng",icon:"▦"},
 {number:"02",title:"Tiến độ không còn mơ hồ.",label:"QUAN SÁT / LIVE PROGRESS",description:"Biến trạng thái công việc thành bức tranh tiến độ dễ hiểu. Thanh tiến độ trong bản demo cập nhật từ chính các đầu việc đang thao tác.",result:"Tiến độ được tính trực tiếp, không phải số liệu giả.",topic:"Kết quả nhìn thấy",icon:"◔"},
 {number:"03",title:"Mọi người cùng một nhịp.",label:"CỘNG TÁC / SHARED CONTEXT",description:"Lọc công việc theo vai trò, giữ thông tin ở đúng nơi và giúp các bộ phận có chung một cái nhìn về những gì đang diễn ra.",result:"Trách nhiệm rõ hơn, ít phụ thuộc vào các chuỗi tin nhắn.",topic:"Phối hợp dễ dàng",icon:"⌘"}
];
const nav:[string,string][]=[["Sản phẩm","/work"],["Dùng thử","/services"],["Về LUMA","/about"]];
function Workspace({compact=false}:{compact?:boolean}){
 const [tasks,setTasks]=useState<Task[]>(seed);
 const [view,setView]=useState<View>("board");
 const [filter,setFilter]=useState<Filter>("all");
 const [team,setTeam]=useState("Tất cả");
 const [newTitle,setNewTitle]=useState("");
 const [adding,setAdding]=useState(false);
 const [feedback,setFeedback]=useState("");
 const done=tasks.filter(t=>t.stage==="done").length;
 const progress=Math.round(done/tasks.length*100);
 const shown=tasks.filter(t=>(filter==="all"||t.stage===filter)&&(team==="Tất cả"||t.team===team));
 const teams=["Tất cả",...Array.from(new Set(tasks.map(t=>t.team)))];
 function advance(id:number){
  setTasks(prev=>prev.map(t=>t.id!==id?t:{...t,stage:t.stage==="todo"?"doing":t.stage==="doing"?"done":"todo"}));
  setFeedback("Trạng thái công việc đã thay đổi trong bản demo.");
 }
 function add(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const title=newTitle.trim();
  if(title.length<3)return;
  setTasks(prev=>[...prev,{id:Math.max(0,...prev.map(t=>t.id))+1,title:title.slice(0,80),team:"Cá nhân",stage:"todo"}]);
  setNewTitle("");setAdding(false);setFilter("all");setTeam("Tất cả");setView("board");
  setFeedback("Đã tạo công việc mô phỏng. Dữ liệu chỉ tồn tại trong phiên trang này.");
 }
 function reset(){setTasks(seed);setFilter("all");setTeam("Tất cả");setView("board");setAdding(false);setFeedback("Đã khôi phục dữ liệu mẫu.");}
 return <div className={s.workspace} data-dna04-artifact="saas-product-appPanel" data-luma-workspace>
  <div className={s.workSidebar}>
   <div className={s.workMark}><span>L</span><strong>luma<small>WORKSPACE</small></strong></div>
   <span className={s.sidebarLabel}>BẢNG ĐIỀU KHIỂN</span>
   <div className={s.workNav} role="tablist" aria-label="Chế độ xem workspace">
    <button type="button" role="tab" aria-selected={view==="board"} onClick={()=>setView("board")}><span aria-hidden="true">▦</span> Bảng việc</button>
    <button type="button" role="tab" aria-selected={view==="progress"} onClick={()=>setView("progress")}><span aria-hidden="true">◔</span> Tiến độ</button>
    <button type="button" role="tab" aria-selected={view==="people"} onClick={()=>setView("people")}><span aria-hidden="true">☷</span> Nhóm</button>
   </div>
   <div className={s.workSidebarBottom}><span className={s.livePill}><i/> DEMO TƯƠNG TÁC</span><span>Dữ liệu không lưu lên máy chủ</span></div>
  </div>
  <div className={s.workMain}>
   <div className={s.workTopbar}><span><i className={s.breadcrumbCircle}/> Không gian mẫu <b>/</b> Dự án Atlas</span><button type="button" onClick={reset} className={s.resetButton}>Đặt lại ↻</button></div>
   <div className={s.workTitle}><div><span className={s.workEyebrow}>WORKSPACE / DỮ LIỆU MẪU</span><h3>{view==="board"?"Công việc đang diễn ra":view==="progress"?"Bức tranh tiến độ":"Nhịp làm việc của nhóm"}</h3><p>{view==="board"?"Chọn, lọc hoặc chuyển trạng thái một đầu việc.":view==="progress"?"Các số liệu dưới đây được tính từ công việc bạn thao tác.":"Xem công việc theo vai trò để giữ mọi người cùng ngữ cảnh."}</p></div><div className={s.workspaceAvatar} aria-label="Dự án mô phỏng">LA</div></div>
   {view==="board"&&<div className={s.flowNavigator} data-luma-flow role="group" aria-label="Sơ đồ luồng công việc">{columns.map(([key,label],i)=><button type="button" key={key} className={s.flowNode} aria-pressed={filter===key} aria-label={label+": "+tasks.filter(t=>t.stage===key).length+" công việc. Nhấn để lọc."} onClick={()=>setFilter(current=>current===key?"all":key)}><span className={s.flowStep}>0{i+1} <span aria-hidden="true">→</span></span><strong>{tasks.filter(t=>t.stage===key).length}</strong><span className={s.flowName}>{label}</span></button>)}</div>}
   {view==="board"&&<div className={s.workContent} role="tabpanel" aria-label="Bảng việc">
    <div className={s.boardToolbar}><div className={s.filterRow} role="group" aria-label="Lọc trạng thái">{([["all","Tất cả"],["todo","Sắp làm"],["doing","Đang làm"],["done","Hoàn tất"]] as [Filter,string][]).map(([key,title])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>setFilter(key)}>{title}</button>)}</div><label className={s.teamFilter}><span>Vai trò</span><select aria-label="Lọc công việc theo vai trò" value={team} onChange={e=>setTeam(e.target.value)}>{teams.map(t=><option key={t}>{t}</option>)}</select></label><button type="button" className={s.addButton} onClick={()=>setAdding(v=>!v)} aria-expanded={adding}>{adding?"Đóng":"＋ Thêm việc"}</button></div>
    {adding&&<form className={s.newTaskForm} onSubmit={add}><label htmlFor="luma-new-task">Công việc mới</label><div><input id="luma-new-task" autoFocus value={newTitle} maxLength={80} minLength={3} onChange={e=>setNewTitle(e.target.value)} placeholder="Ví dụ: Kiểm tra trang chủ" required/><button type="submit" disabled={newTitle.trim().length<3}>Thêm vào bảng</button></div></form>}
    <div className={s.boardColumns}>{columns.filter(([key])=>filter==="all"||filter===key).map(([key,label,desc])=><section key={key} className={s.boardColumn}><div className={s.columnHeader}><div><i className={s["status_"+key]}/><strong>{label}</strong></div><span>{shown.filter(t=>t.stage===key).length}</span></div><small className={s.columnCaption}>{desc}</small><div className={s.taskList}>{shown.filter(t=>t.stage===key).map(t=><article key={t.id} className={s.taskCard}><small>{t.team.toUpperCase()}</small><h4>{t.title}</h4><div><span>AT-{String(t.id).padStart(2,"0")}</span><button type="button" aria-label={"Chuyển trạng thái: "+t.title} onClick={()=>advance(t.id)}>{t.stage==="done"?"Làm lại ↺":t.stage==="todo"?"Bắt đầu →":"Hoàn tất ✓"}</button></div></article>)}{!shown.some(t=>t.stage===key)&&<p className={s.emptyList}>Không có công việc ở trạng thái này.</p>}</div></section>)}</div>
   </div>}
   {view==="progress"&&<div className={s.progressPanel} role="tabpanel" aria-label="Theo dõi tiến độ"><div className={s.progressHero}><span>TIẾN ĐỘ HIỆN TẠI</span><strong>{progress}<small>%</small></strong><div className={s.progressTrack} role="progressbar" aria-label="Tỷ lệ công việc hoàn thành" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{width:progress+"%"}}/></div><p>{done} / {tasks.length} đầu việc đã hoàn tất trong mô phỏng.</p></div><div className={s.progressBreakdown}>{columns.map(([key,label])=><div key={key}><span>{label}</span><strong>{tasks.filter(t=>t.stage===key).length}</strong></div>)}</div><button type="button" onClick={()=>setView("board")} className={s.backToBoard}>QUAY LẠI BẢNG VIỆC →</button></div>}
   {view==="people"&&<div className={s.peoplePanel} role="tabpanel" aria-label="Nhóm và vai trò"><div className={s.peopleIntro}><span>NHÓM MÔ PHỎNG</span><h4>Mỗi vai trò, một mảnh ghép.</h4><p>Các vai trò bên dưới là dữ liệu minh họa, không phải nhân viên hoặc tài khoản người dùng thật.</p></div><div className={s.peopleGrid}>{teams.filter(t=>t!=="Tất cả").map((role,i)=><button key={role} type="button" onClick={()=>{setView("board");setTeam(role);setFilter("all")}}><b>{role.slice(0,1)}</b><span>{role}<small>{tasks.filter(t=>t.team===role).length} công việc · Xem danh sách →</small></span></button>)}</div></div>}
   <div className={s.workBottom}><span role="status" aria-live="polite">{feedback||"Bản tương tác demo · Không gửi dữ liệu đến máy chủ."}</span><span>{tasks.length} ĐẦU VIỆC / PHIÊN NÀY</span></div>
  </div>
 </div>;
}
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:Props){
 const [menu,setMenu]=useState(false);
 const [inquiry,setInquiry]=useState("");
 const [sender,setSender]=useState("");
 const [notice,setNotice]=useState("");
 const go=(path:string)=>basePath+(path==="/"?"":path);
 const feature=features[Math.max(0,Math.min(itemIndex-1,features.length-1))];
 useEffect(()=>setMenu(false),[section]);
 /* Accessible, one-shot viewport reveals: never animate the live task board. */
 useEffect(()=>{
  const root=document.getElementById("saas-product-top");
  if(!root||typeof IntersectionObserver==="undefined"||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const selectors="main > section, main > article, main > section > .reveal-block, footer";
  const targets=Array.from(root.querySelectorAll<HTMLElement>(selectors));
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){(entry.target as HTMLElement).dataset.scrollVisible="true";observer.unobserve(entry.target);}
   });
  },{threshold:0.08,rootMargin:"0px 0px -35px 0px"});
  targets.forEach(target=>{
   if(target.getBoundingClientRect().top<window.innerHeight*0.9){target.dataset.scrollVisible="true";return;}
   target.dataset.scrollReveal="true";observer.observe(target);
  });
  return()=>observer.disconnect();
 },[section]);

 useEffect(()=>{if(!menu)return;const esc=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false)};window.addEventListener("keydown",esc);return()=>window.removeEventListener("keydown",esc)},[menu]);
 const draft=(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(inquiry.trim().length<10)return;
  const body="Tên: "+sender.trim()+"\n\n"+inquiry.trim()+"\n\n(Đây là email được soạn từ bản demo LUMA Workspace.)";
  window.location.href="mailto:?subject="+encodeURIComponent("LUMA Workspace / Trao đổi sản phẩm")+"&body="+encodeURIComponent(body);
  setNotice("Ứng dụng email có thể đã mở bản nháp. Bạn cần tự chọn người nhận và gửi.");
 };
 const copy=async()=>{try{await navigator.clipboard.writeText("LUMA Workspace\n"+inquiry);setNotice("Đã sao chép nội dung. Không có dữ liệu nào được gửi đi.");}catch{setNotice("Không thể sao chép tự động. Hãy chọn và sao chép nội dung trong ô nhập.");}};
 return <div className={s.root} id="saas-product-top">
  <header className={s.header}>
   <Link className={s.brand} href={go("/")} aria-label={site.brand+" — trang chủ"}><span className={s.brandGlyph}>L<span/></span><span>{site.brand.split(" ")[0].toLowerCase()}<small>WORKSPACE</small></span></Link>
   <nav className={s.desktopNav} aria-label="Điều hướng chính">{nav.map(([title,route])=><Link key={route} href={go(route)}>{title}</Link>)}</nav>
   <Link className={s.headerAction} href={go("/services")}>DÙNG THỬ DEMO <span aria-hidden="true">→</span></Link>
   <button className={s.menuButton} type="button" aria-label={menu?"Đóng điều hướng":"Mở điều hướng"} aria-expanded={menu} aria-controls="luma-navigation" onClick={()=>setMenu(v=>!v)}><span/><span/><span/></button>
  </header>
  <div className={s.mobileMenu} id="luma-navigation" data-open={menu} inert={!menu}>{[["Trang chủ","/"],...nav,["Liên hệ","/contact"]].map(([title,route])=><Link key={route} href={go(route)} onClick={()=>setMenu(false)}>{title}<span aria-hidden="true">→</span></Link>)}<p>Giao diện SaaS mô phỏng của Athena Studio. Không có tài khoản hoặc dữ liệu thực.</p></div>
  <main>
   {section==="home"&&<>
    <section className={s.hero} data-dna04-artifact="saas-product-productBoard">
     <div className={s.heroCopy}><span className={s.heroEyebrow}><i/> KHÔNG GIAN LÀM VIỆC MỚI</span><h1>Ít hỗn độn.<br/><em>Nhiều tiến bộ.</em></h1><p>LUMA kết nối công việc, trạng thái và những người cùng thực hiện — trong một không gian dễ hiểu, dễ thao tác.</p><div className={s.heroActions}><Link className={s.primary} href={go("/services")}>TRẢI NGHIỆM WORKSPACE <span aria-hidden="true">→</span></Link><Link className={s.textLink} href={go("/work")}>KHÁM PHÁ SẢN PHẨM →</Link></div><div className={s.heroProof}><span><i/> THAO TÁC ĐƯỢC</span><span>KHÔNG CẦN TÀI KHOẢN</span><span>CHỈ DỮ LIỆU MẪU</span></div></div>
     <div className={s.heroWorkspace}><div className={s.heroGlow} aria-hidden="true"/><Workspace compact/></div>
    </section>
    <section className={s.statement}><span>01 / CÁCH LÀM VIỆC</span><div><h2>KHI MỌI THỨ<br/><em>CÓ VỊ TRÍ CỦA NÓ.</em></h2><p>Từ ý tưởng chưa bắt đầu đến công việc đã hoàn thành — mọi thứ có một nơi để theo dõi, thay vì biến mất trong hàng chục đoạn chat.</p></div></section>
    <section className={s.featureEditorial}><div className={s.featureHead}><span className={s.sectionLabel}>ĐƯỢC THIẾT KẾ CHO MỌI NGÀY LÀM VIỆC</span><h2>BA ĐIỀU QUAN TRỌNG.<br/><em>KHÔNG CẦN PHỨC TẠP.</em></h2></div><div className={s.featureGrid}>{features.map(f=><Link key={f.number} className={s.featureTile} href={go("/work/"+Number(f.number))} data-dna04-artifact={"saas-product-feature-"+f.number}><span className={s.featureNumber}>{f.number} / 03</span><span className={s.featureIcon} aria-hidden="true">{f.icon}</span><h3>{f.title}</h3><p>{f.description}</p><span className={s.featureMore}>TÌM HIỂU CHI TIẾT <b aria-hidden="true">→</b></span></Link>)}</div></section>
    <section className={s.bottomPitch}><span className={s.sectionLabel}>HÃY TỰ THỬ</span><h2>MỘT THAO TÁC NHỎ.<br/>MỘT CÁCH LÀM VIỆC <em>KHÁC.</em></h2><p>Bản workspace phía trên không phải ảnh chụp. Bạn có thể thêm đầu việc, chuyển trạng thái, lọc và quan sát tiến độ thay đổi ngay lập tức.</p><Link href={go("/services")} className={s.primary}>MỞ KHÔNG GIAN DEMO <span aria-hidden="true">→</span></Link></section>
   </>}
   {section==="services"&&<section className={s.tourPage}><div className={s.pageHeading}><span className={s.sectionLabel}>LUMA / INTERACTIVE DEMO</span><h1>CHẠM VÀO<br/><em>CÁCH LÀM VIỆC MỚI.</em></h1><p>Đây là một mô phỏng tương tác, không phải tài khoản sản phẩm thật. Hãy thêm việc, thay đổi trạng thái và xem tiến độ tính lại trực tiếp.</p></div><div className={s.fullWorkspace}><Workspace/></div><div className={s.demoDisclosure}><span>THỬ — HỌC — ĐẶT LẠI</span><p>Tất cả thao tác diễn ra trong bộ nhớ của trang. Reload sẽ khôi phục dữ liệu mẫu. Không có API lưu trữ, đăng nhập hoặc dữ liệu khách hàng.</p></div></section>}
   {section==="work"&&<section className={s.workPage}><div className={s.pageHeading}><span className={s.sectionLabel}>KHÁM PHÁ / NỀN TẢNG</span><h1>SẢN PHẨM<br/><em>BẮT ĐẦU TỪ VIỆC THẬT.</em></h1><p>Không phải một danh sách chức năng dài. Ba bước này tạo thành một luồng làm việc có thể hiểu và thử ngay.</p></div><div className={s.workflowList}>{features.map((f,i)=><Link key={f.number} href={go("/work/"+(i+1))} className={s.workflowRow} data-dna04-artifact={"saas-product-workflow-"+i}><span className={s.workflowIndex}>/ {f.number}</span><div><small>{f.label}</small><h2>{f.title}</h2><p>{f.description}</p></div><span className={s.workflowArrow} aria-hidden="true">→</span></Link>)}</div><div className={s.workPageCta}><h2>TẠI SAO CHỈ XEM KHI BẠN CÓ THỂ THỬ?</h2><Link href={go("/services")} className={s.primary}>MỞ BẢNG VIỆC →</Link></div></section>}
   {section==="detail"&&<article className={s.detailPage}><Link className={s.back} href={go("/work")}>← KHÁM PHÁ NỀN TẢNG</Link><div className={s.detailHero}><span className={s.sectionLabel}>{feature.number} / {feature.label}</span><h1>{feature.title}</h1><p>{feature.description}</p></div><div className={s.detailProof}><span>{feature.icon}</span><div><small>ĐIỀU BẠN NHẬN ĐƯỢC / TRONG DEMO</small><h2>{feature.result}</h2><p>Đây là trải nghiệm giả lập được thiết kế để trình diễn cách một sản phẩm SaaS có thể tổ chức thông tin. Không phải dữ liệu hoạt động của doanh nghiệp thật.</p><Link href={go("/services")} className={s.primary}>THỬ TRỰC TIẾP →</Link></div></div><div className={s.detailBottom}><Link href={go("/work/"+(itemIndex%3+1))}>KHÁM PHÁ TIẾP <span aria-hidden="true">→</span></Link><Link href={go("/contact")}>TRAO ĐỔI VỀ SẢN PHẨM →</Link></div></article>}
   {section==="about"&&<section className={s.aboutPage}><span className={s.sectionLabel}>LUMA / TRIẾT LÝ THIẾT KẾ</span><div className={s.aboutHero}><h1>PHẦN MỀM<br/>NÊN LÀM CÔNG VIỆC<br/><em>NHẸ HƠN.</em></h1><div className={s.aboutSquare} aria-hidden="true"><span>L</span></div></div><div className={s.aboutColumns}><div><span>ĐIỀU CHÚNG TÔI TIN</span><h2>Sự rõ ràng là một tính năng.</h2></div><div><p>LUMA Workspace là thương hiệu khái niệm trong thư viện Athena Studio. Mục đích của bản demo là thể hiện một luồng sản phẩm số có cấu trúc, phản hồi và tương tác thực tế.</p><p>Các đầu việc, vai trò và chỉ số là dữ liệu mẫu nội bộ ở phía trình duyệt. Trang không cung cấp dịch vụ SaaS đang vận hành, không có tài khoản, thanh toán hay lưu trữ người dùng.</p><Link href={go("/services")} className={s.primary}>THỬ GIAO DIỆN →</Link></div></div></section>}
   {section==="contact"&&<section className={s.contactPage}><div className={s.contactCopy}><span className={s.sectionLabel}>LUMA / TRAO ĐỔI</span><h1>TỪ Ý TƯỞNG<br/><em>ĐẾN SẢN PHẨM.</em></h1><p>Bạn muốn trao đổi về một sản phẩm tương tự? Hãy tạo bản nháp email. Bản demo không gửi hoặc lưu dữ liệu.</p><div className={s.contactPattern} aria-hidden="true"><span>→</span><span>◌</span><span>▦</span></div></div><form className={s.contactForm} onSubmit={draft}><label htmlFor="luma-name">TÊN CỦA BẠN</label><input id="luma-name" value={sender} required maxLength={90} onChange={e=>setSender(e.target.value)} placeholder="Tên của bạn"/><label htmlFor="luma-message">BẠN ĐANG CẦN GÌ?</label><textarea id="luma-message" required minLength={10} maxLength={3000} value={inquiry} onChange={e=>setInquiry(e.target.value)} placeholder="Mô tả công việc hoặc sản phẩm bạn muốn trao đổi..."/><button type="submit" className={s.primary}>TẠO BẢN NHÁP EMAIL <span aria-hidden="true">→</span></button><button type="button" className={s.copyButton} disabled={!inquiry.trim()} onClick={copy}>SAO CHÉP NỘI DUNG</button><p role="status" aria-live="polite">{notice||"Không có địa chỉ email nhận mặc định. Bạn cần tự chọn người nhận và gửi trong ứng dụng email."}</p></form></section>}
  </main>
  <footer className={s.footer}><div className={s.footerTop}><Link className={s.brand} href={go("/")}><span className={s.brandGlyph}>L<span/></span><span>{site.brand.split(" ")[0].toLowerCase()}<small>WORKSPACE</small></span></Link><p>Không gian làm việc rõ ràng hơn.<br/>Một concept sản phẩm của Athena Studio.</p><nav aria-label="Điều hướng chân trang">{[["Trang chủ","/"],...nav,["Liên hệ","/contact"]].map(([title,route])=><Link key={route} href={go(route)}>{title}</Link>)}</nav></div><div className={s.footerBottom}><span>© 2026 LUMA WORKSPACE — DEMO</span><span>KHÔNG THU THẬP DỮ LIỆU NGƯỜI DÙNG</span><Link href={go("/")}>LÊN ĐẦU TRANG ↑</Link></div></footer>
 </div>;
}
