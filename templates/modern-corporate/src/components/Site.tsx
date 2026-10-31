"use client";
import Link from "next/link";
import {useState,useEffect} from "react";
import site from "../data/site.json";
import s from "./North.module.css";
type Section="home"|"work"|"services"|"about"|"contact"|"detail";
const services=[
 {name:"Chiến lược hệ thống",tag:"KHẢO SÁT",shortIssue:"Chưa rõ ưu tiên",problem:"Có nhiều việc cần làm nhưng chưa xác định được việc nào quan trọng nhất.",solution:"Làm rõ vấn đề, thống nhất tiêu chí và sắp xếp thứ tự triển khai.",deliver:"Sơ đồ hiện trạng, danh sách ưu tiên và tiêu chí đánh giá."},
 {name:"Vận hành số",tag:"THIẾT KẾ",shortIssue:"Công cụ rời rạc",problem:"Thông tin nằm ở nhiều công cụ, nhân sự phải nhập lại hoặc hỏi nhau để tiếp tục công việc.",solution:"Thiết kế luồng dữ liệu, giao diện và các điểm bàn giao giữa bộ phận.",deliver:"Sơ đồ quy trình, luồng dữ liệu và nguyên mẫu giao diện."},
 {name:"Lộ trình chuyển đổi",tag:"TRIỂN KHAI",shortIssue:"Khó đưa vào thực tế",problem:"Kế hoạch đã có nhưng chưa rõ ai thực hiện, làm lúc nào và kiểm tra kết quả ra sao.",solution:"Chia công việc thành các giai đoạn có người phụ trách và tiêu chí nghiệm thu.",deliver:"Lộ trình từng giai đoạn, phân công và kế hoạch kiểm thử."}
];
const steps=[{name:"01 / Thấu hiểu",head:"Định nghĩa đúng vấn đề.",detail:"Phỏng vấn người sử dụng, quan sát công việc hiện tại và xác định vấn đề cần giải quyết.",output:"Danh sách vấn đề và sơ đồ hiện trạng."},{name:"02 / Đồng bộ",head:"Thống nhất tiêu chí.",detail:"Thống nhất mục tiêu, trách nhiệm và tiêu chí thành công với các bên liên quan.",output:"Bản đồ ưu tiên và tiêu chí triển khai."},{name:"03 / Xây dựng",head:"Triển khai theo lớp.",detail:"Thử nghiệm một luồng làm việc trước khi mở rộng, đo hiệu quả và xử lý những điểm chưa phù hợp.",output:"Nguyên mẫu và biên bản kiểm thử."},{name:"04 / Cải tiến",head:"Đo lường và cải tiến.",detail:"Theo dõi phản hồi, ghi nhận vấn đề phát sinh và điều chỉnh dựa trên kết quả đo.",output:"Bảng theo dõi và kế hoạch cải tiến."}];
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){
 const [menu,setMenu]=useState(false);
 const [impactStep,setImpactStep]=useState(0);
 const [active,setActive]=useState(0);
 const [issue,setIssue]=useState("Tổ chức lại quy trình");
 const [detail,setDetail]=useState("");
 const go=(p:string)=>basePath+(p==="/"?"":p);
 const images=site.images.map(p=>assetBase+p);
 useEffect(()=>{setMenu(false)},[section]);
 useEffect(()=>{if(!menu)return;const fn=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false)};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn)},[menu]);
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>("[data-north-surface]");if(!root)return;
  const sections=root.querySelectorAll<HTMLElement>("[data-north-scene]");
  if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){sections.forEach(el=>el.dataset.northVisible="true");return;}
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){(entry.target as HTMLElement).dataset.northVisible="true";observer.unobserve(entry.target)}}},{threshold:.1,rootMargin:"0px 0px -25px 0px"});
  sections.forEach(el=>observer.observe(el));
  const diagram=root.querySelector<HTMLElement>("[data-north-ambient]");
  const ambientObserver=new IntersectionObserver(entries=>{for(const e of entries)(e.target as HTMLElement).dataset.northActive=(!document.hidden&&e.isIntersecting)?"true":"false"});
  if(diagram)ambientObserver.observe(diagram);
  const onVisible=()=>{if(!diagram)return;const r=diagram.getBoundingClientRect();diagram.dataset.northActive=(!document.hidden&&r.bottom>0&&r.top<innerHeight)?"true":"false"};
  document.addEventListener("visibilitychange",onVisible);
  return()=>{observer.disconnect();ambientObserver.disconnect();document.removeEventListener("visibilitychange",onVisible)};
 },[section]);
 const list:[string,string][]=[["Giải pháp","/services"],["Năng lực","/work"],["Phương pháp","/about"],["Liên hệ","/contact"]];
 return <div className={s.north} data-north-surface>
 <div className={s.utility}><span>TƯ VẤN CHIẾN LƯỢC / CẢI TIẾN VẬN HÀNH</span><span>WEBSITE MẪU — THÔNG TIN MINH HỌA</span></div>
 <header className={s.globalHead}><Link href={go("/")} className={s.insignia}><b>{site.brand.charAt(0).toUpperCase()}<span>·</span></b><span>{site.brand}<small>HỆ THỐNG TƯ VẤN</small></span></Link><nav className={s.topNav} aria-label="Điều hướng NORTH">{list.map(([name,url])=><Link href={go(url)} key={url}>{name}</Link>)}</nav><Link className={s.consult} href={go("/contact")}>Trao đổi dự án <span aria-hidden="true">→</span></Link><button className={s.trigger} aria-label={menu?"Đóng điều hướng":"Mở điều hướng"} aria-expanded={menu} onClick={()=>setMenu(v=>!v)}><i/><i/><i/></button></header>
 <div className={s.rail}><span>001—004</span><span>NORTH / SYSTEMS</span><span>THIẾT KẾ CHO SỰ RÕ RÀNG</span></div>
 <button className={s.scrim} data-open={menu} tabIndex={menu?0:-1} aria-hidden={!menu} onClick={()=>setMenu(false)} aria-label="Đóng menu"/>
 <aside className={s.panel} inert={!menu} aria-hidden={!menu}><div className={s.panelTop}>DANH MỤC / NORTH <button type="button" onClick={()=>setMenu(false)} aria-label="Đóng điều hướng"><span aria-hidden="true">×</span></button></div><div>{list.map(([title,url],i)=><Link key={url} onClick={()=>setMenu(false)} href={go(url)}><small>0{i+1}</small>{title}</Link>)}</div><p>Rõ quy trình. Chắc quyết định. Vững bước tiếp theo.</p></aside>
 <main className={s.content}>
 {section==="home"&&<>
  <section className={s.banner} id="north-diagnostic"><div className={s.bannerCopy}><span className={s.eyebrow}>CHIẾN LƯỢC / VẬN HÀNH / CÔNG NGHỆ</span><h1>Rõ ràng<br/>giữa <em>phức tạp.</em></h1><p>Nhìn rõ điểm nghẽn, chọn đúng giải pháp và xác định việc cần làm tiếp theo.</p><div className={s.heroActions}><a className={s.primary} href="#north-diagnostic-tool">Chọn vấn đề của bạn <span aria-hidden="true">→</span></a><Link className={s.heroSecondary} href={go("/work")}>Xem phạm vi dịch vụ</Link></div><div className={s.bannerMeta}><b>03</b><span>NHÓM VẤN ĐỀ THƯỜNG GẶP<br/>CHỌN ĐỂ XEM CÁCH XỬ LÝ</span></div></div><div className={s.diagram} id="north-diagnostic-tool" data-north-ambient data-focus={active} role="region" aria-label="Bảng chẩn đoán vận hành NORTH"><div className={s.diagnosticHead}><span className={s.gridCaption}>NORTH / BẢNG CHẨN ĐOÁN</span><span className={s.liveSignal}><i aria-hidden="true"/>TƯƠNG TÁC</span></div><h2 className={s.diagnosticTitle}>Bạn đang gặp vướng mắc nào?</h2><p className={s.diagnosticIntro}>Chọn một tình huống để xem hướng xử lý và hạng mục bàn giao tham khảo.</p><div className={s.systemOrbit} aria-hidden="true"><svg viewBox="0 0 470 210" preserveAspectRatio="xMidYMid meet"><path d="M30 96 L130 30 L238 104 L364 38 L443 112 M130 30 L210 182 L364 38 M238 104 L318 189 L443 112" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 10"/><circle cx="30" cy="96" r="8"/><circle cx="130" cy="30" r="7"/><circle cx="238" cy="104" r="11"/><circle cx="364" cy="38" r="7"/><circle cx="443" cy="112" r="8"/><circle cx="210" cy="182" r="6"/><circle cx="318" cy="189" r="6"/></svg><span>KHẢO SÁT <b>→</b> KẾT NỐI <b>→</b> TRIỂN KHAI</span></div><div className={s.diagramNodes} role="group" aria-label="Chọn vấn đề đang gặp">{services.map((x,i)=><button type="button" aria-controls="north-diagnostic-result" aria-label={"Chọn vấn đề: "+x.shortIssue} aria-pressed={active===i} onClick={()=>setActive(i)} key={x.tag}><small>0{i+1} / {x.tag}</small><strong>{x.shortIssue}</strong><span aria-hidden="true">↗</span></button>)}</div><div className={s.diagramContent} id="north-diagnostic-result" aria-live="polite" aria-atomic="true"><small>HƯỚNG XỬ LÝ / 0{active+1}</small><h3>{services[active].name}</h3><div className={s.beforeAfter}><div><span>VẤN ĐỀ</span><p>{services[active].problem}</p></div><div><span>HƯỚNG XỬ LÝ</span><p>{services[active].solution}</p></div></div><div className={s.diagnosticDeliver}><span>ĐẦU RA THAM KHẢO</span><p>{services[active].deliver}</p></div><Link href={go("/work/"+(active+1))}>Xem chi tiết dịch vụ <span aria-hidden="true">→</span></Link></div><div className={s.diagramFoot}>BẢN MINH HỌA QUY TRÌNH <span>KHÔNG PHẢI TƯ VẤN TỰ ĐỘNG</span></div></div></section>
  <section className={s.impact} data-north-scene>
    <div className={s.impactLead}>
      <small>01 / PHƯƠNG PHÁP LÀM VIỆC</small>
      <h2>Ít nút thắt.<br/>Rõ hướng đi.</h2>
      <p>Một quy trình không cần phức tạp để hiệu quả. Bắt đầu từ vấn đề thực tế, thống nhất cách làm, rồi kiểm chứng kết quả.</p>
      <div className={s.impactPrinciples} aria-label="Ba nguyên tắc làm việc">
        <div><span>01</span><strong>Hiểu việc đang vướng.</strong></div>
        <div><span>02</span><strong>Rõ ai chịu trách nhiệm.</strong></div>
        <div><span>03</span><strong>Thử nghiệm và đo kết quả.</strong></div>
      </div>
    </div>
    <div className={s.impactBody}>
      <div className={s.impactPanelTop}><span>NORTH / QUY TRÌNH BA BƯỚC</span><span>CHỌN ĐỂ XEM</span></div>
      <div className={s.impactJourney} role="group" aria-label="Khám phá ba bước vận hành">
        {[["01","Khảo sát"],["02","Kết nối"],["03","Triển khai"]].map(([n,label],i)=><button key={n} type="button" aria-controls="north-impact-result" aria-pressed={impactStep===i} onClick={()=>setImpactStep(i)}><span>{n}</span><strong>{label}</strong></button>)}
      </div>
      <div className={s.impactNarrative} id="north-impact-result" aria-live="polite" aria-atomic="true">
        <span>BƯỚC 0{impactStep+1} / 03</span>
        <h3>{["Xác định vấn đề","Thống nhất cách làm","Kiểm tra hiệu quả"][impactStep]}</h3>
        <p>{["Tìm hiểu công việc hiện tại, ghi rõ điểm nghẽn và thu thập thông tin cần kiểm tra.","Làm rõ vai trò từng bộ phận, các điểm bàn giao và thứ tự ưu tiên công việc.","Thử nghiệm phương án, theo dõi kết quả và điều chỉnh trước khi mở rộng."][impactStep]}</p>
        <div className={s.impactDeliverable}><small>ĐẦU RA CỦA BƯỚC NÀY</small><p>{["Sơ đồ hiện trạng và danh sách vấn đề cần xử lý.","Bản phân công, luồng công việc và tiêu chí hoàn thành.","Kết quả thử nghiệm cùng các điều chỉnh được đề xuất."][impactStep]}</p></div>
      </div>

    </div>
  </section>
    <section className={s.capabilities} data-north-scene><header><small>02 / NĂNG LỰC CỐT LÕI</small><h2>Ba năng lực.<br/>Một hệ thống.</h2></header><div>{services.map((x,i)=><Link href={go("/work/"+(i+1))} key={x.name}><small>0{i+1}</small><strong>{x.name}</strong><p>{x.problem}</p><span aria-hidden="true">↳</span></Link>)}</div></section>
  <section className={s.proof} data-north-scene><img src={images[1]} alt="Minh họa không gian và hệ thống vận hành"/><div><small>PHƯƠNG PHÁP CÓ THỂ ÁP DỤNG</small><h2>Quyết định phức tạp cần khung tư duy rõ ràng.</h2><p>Website minh họa phương pháp làm việc. Các năng lực trình bày ở đây là nội dung mẫu, không phải hồ sơ năng lực của khách hàng thật.</p><Link href={go("/about")}>Nguyên tắc làm việc →</Link></div></section>
 </>}
 {section==="work"&&<section className={s.directory}><div className={s.pageHead}><small>DANH MỤC NĂNG LỰC / 01—03</small><h1>Năng lực<br/>có hệ thống.</h1><p>Chọn một năng lực để xem vấn đề, phương pháp và đầu ra minh họa.</p></div><div className={s.directoryGrid}>{services.map((x,i)=><Link href={go("/work/"+(i+1))} key={x.name}><small>NORTH / 0{i+1}</small><img src={images[i%images.length]} alt={"Minh họa "+x.name}/><h2>{x.name}</h2><p>{x.problem}</p></Link>)}</div></section>}
 {section==="detail"&&<article className={s.case}><div className={s.caseTop}><Link href={go("/work")}>← DANH MỤC NĂNG LỰC</Link><small>TÀI LIỆU THAM KHẢO / {String(itemIndex).padStart(2,"0")}</small></div><h1>{services[(itemIndex-1)%services.length].name}</h1><div className={s.caseGrid}><div><span>VẤN ĐỀ</span><p>{services[(itemIndex-1)%services.length].problem}</p></div><div><span>CÁCH TIẾP CẬN</span><p>{services[(itemIndex-1)%services.length].solution}</p></div><div><span>KẾT QUẢ DỰ KIẾN</span><p>{services[(itemIndex-1)%services.length].deliver}</p></div></div><img className={s.caseImage} src={images[itemIndex%images.length]} alt="Minh họa phương pháp giải quyết"/><p>Đây là hồ sơ mô phỏng phạm vi dịch vụ, không phải case study của khách hàng hoặc dự án đã triển khai.</p></article>}
 {section==="services"&&<section className={s.solutions}><div className={s.pageHead}><small>QUY TRÌNH GIẢI PHÁP / KHÁM PHÁ TỪNG BƯỚC</small><h1>Từ câu hỏi<br/>đến hành động.</h1><p>Chọn một bước của quy trình để tìm hiểu cách tiếp cận.</p></div><div className={s.process}><div className={s.stepButtons}>{steps.map((step,i)=><button aria-pressed={active===i} key={step.name} onClick={()=>setActive(i)}><small>{step.name}</small><span>{step.head}</span></button>)}</div><article className={s.stepDetail}><small>QUY TRÌNH / BƯỚC {String(active+1).padStart(2,"0")}</small><h2>{steps[active].head}</h2><p>{steps[active].detail}</p><div className={s.stepOutput}><strong>KẾT QUẢ CỦA BƯỚC NÀY</strong><span>{steps[active].output}</span></div><div className={s.progressLine}><span style={{width:(active+1)*25+"%"}}/></div><button onClick={()=>setActive((active+1)%4)}>Tiếp bước tiếp theo →</button></article></div></section>}
 {section==="about"&&<section className={s.principles}><div className={s.pageHead}><small>PHƯƠNG PHÁP NORTH / NGUYÊN TẮC VẬN HÀNH</small><h1>Hệ thống tốt<br/>phải dễ hiểu.</h1><p>Thiết kế cho con người vận hành, không phải cho sơ đồ đẹp trên giấy.</p></div><div className={s.values}><div><b>01</b><h2>Nhìn toàn cảnh.</h2><p>Trước khi tối ưu một điểm, cần hiểu nó đóng vai trò gì trong toàn hệ thống.</p></div><div><b>02</b><h2>Rõ người, rõ việc.</h2><p>Quy trình tốt giúp mọi người nhìn rõ ai làm gì, vì sao và kết quả là gì.</p></div><div><b>03</b><h2>Sẵn sàng thay đổi.</h2><p>Mọi khung vận hành phải đủ rõ để sử dụng, đủ linh hoạt để cải tiến.</p></div></div><img src={images[3]} alt="Ảnh minh họa văn phòng và thiết kế hệ thống"/></section>}
 {section==="contact"&&<section className={s.inquiry}><div className={s.pageHead}><small>TRAO ĐỔI / BẮT ĐẦU TỪ ĐÂY</small><h1>Bắt đầu từ<br/>vấn đề thực.</h1><p>Hãy chọn vấn đề và mô tả nhu cầu. Trang sẽ tạo thư nháp để bạn chọn người nhận và tự gửi.</p></div><form onSubmit={e=>{e.preventDefault();window.location.href="mailto:?subject="+encodeURIComponent("NORTH / Yêu cầu tư vấn / "+issue)+"&body="+encodeURIComponent(detail+"\n\n— Nội dung được soạn từ website demo NORTH. Bạn tự chọn người nhận trước khi gửi.")}}><label htmlFor="north-issue">01 / Chọn vấn đề cần giải quyết</label><div className={s.selectShell}><select id="north-issue" value={issue} onChange={e=>setIssue(e.target.value)}><option>Tổ chức lại quy trình</option><option>Phát triển nền tảng số</option><option>Xây dựng chiến lược chuyển đổi</option></select><span className={s.selectChevron} aria-hidden="true">⌄</span></div><label htmlFor="north-detail">02 / Tóm tắt phạm vi</label><textarea required minLength={10} value={detail} onChange={e=>setDetail(e.target.value)} id="north-detail" placeholder="Mục tiêu, ràng buộc, bối cảnh và thời gian dự kiến…"/><button>Tạo thư trao đổi <span aria-hidden="true">→</span></button><p>Không gửi dữ liệu tới máy chủ demo.</p></form></section>}
 </main>
 <footer className={s.directoryFooter}><div className={s.footerIntro}><span>{site.brand} / HỆ THỐNG TƯ VẤN</span><h2>Định hình<br/>bước tiếp theo.</h2><Link href={go("/contact")}>Bắt đầu trao đổi →</Link></div><div className={s.footerLower}><div><b>{site.brand}.</b><p>Rõ ràng / Tiến bộ / Trách nhiệm</p></div><div><small>DANH MỤC</small>{list.map(([x,url])=><Link key={url} href={go(url)}>{x}</Link>)}</div><div><small>THÔNG TIN</small><p>Website ý tưởng minh họa trong thư viện Athena Studio; không phải thành tích thực tế của khách hàng.</p></div></div><small>© 2026 {site.brand} / BẢN MẪU</small></footer>
 </div>;
}
