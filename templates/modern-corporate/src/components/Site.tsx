"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import type {CSSProperties,PointerEvent as ReactPointerEvent} from "react";
import NorthSelector from "./NorthSelector";
import site from "../data/site.json";
import s from "./North.module.css";

type Section="home"|"work"|"services"|"about"|"contact"|"detail";
type Props={section?:Section;itemIndex?:number;basePath?:string;assetBase?:string};

const services=[
 {index:"01",name:"Chiến lược hệ thống",short:"Chưa rõ ưu tiên",label:"PRIORITY",question:"Điều gì thực sự cần giải quyết trước?",problem:"Có nhiều việc phải làm nhưng chưa xác định được vấn đề nào cần ưu tiên.",solution:"Phân tích hiện trạng, xác định những phụ thuộc quan trọng và thống nhất thứ tự hành động.",deliver:"Sơ đồ hiện trạng, danh sách ưu tiên và tiêu chí đánh giá.",note:"Từ nhiều hướng rẽ đến một thứ tự có căn cứ.",chapter:"TÌM ĐIỂM KHỞI ĐẦU",tagline:"Chọn đúng việc trước khi làm thêm việc.",accent:"orange"},
 {index:"02",name:"Vận hành số",short:"Công cụ rời rạc",label:"CONNECTION",question:"Thông tin đang mắc kẹt ở đâu?",problem:"Thông tin phân tán trong nhiều công cụ, nhân sự phải nhập lại hoặc hỏi nhau để tiếp tục công việc.",solution:"Làm rõ đường đi dữ liệu, các điểm bàn giao và trải nghiệm sử dụng công cụ.",deliver:"Bản đồ quy trình, luồng dữ liệu và nguyên mẫu giao diện.",note:"Kết nối công việc thay vì bổ sung thêm một ứng dụng.",chapter:"TẠO ĐƯỜNG KẾT NỐI",tagline:"Ít đứt gãy hơn. Ít thao tác thừa hơn.",accent:"blue"},
 {index:"03",name:"Lộ trình chuyển đổi",short:"Khó triển khai",label:"EXECUTION",question:"Ai sẽ đưa kế hoạch vào thực tế?",problem:"Kế hoạch đã có nhưng chưa rõ ai thực hiện, bắt đầu từ đâu và đánh giá kết quả ra sao.",solution:"Chia kế hoạch thành các giai đoạn có trách nhiệm, đầu ra và cơ chế kiểm chứng.",deliver:"Lộ trình theo giai đoạn, phân công và kế hoạch kiểm thử.",note:"Biến định hướng thành các bước có thể bàn giao.",chapter:"GIỮ NHỊP THỰC THI",tagline:"Không để kế hoạch dừng ở bản trình bày.",accent:"green"},
] as const;

const methods=[
 {n:"01",name:"Quan sát",kicker:"UNDERSTAND",title:"Thấy đúng vấn đề.",description:"Tìm hiểu công việc hiện tại và xác định nguyên nhân thay vì chỉ sửa phần dễ nhìn thấy.",deliver:"Sơ đồ hiện trạng và tập vấn đề cần kiểm chứng.",mark:"QUESTION"},
 {n:"02",name:"Sắp xếp",kicker:"ALIGN",title:"Tạo một hướng chung.",description:"Làm rõ người tham gia, đường đi thông tin và thứ tự các quyết định cần thống nhất.",deliver:"Bản ưu tiên, vai trò và quy trình đề xuất.",mark:"STRUCTURE"},
 {n:"03",name:"Kiểm chứng",kicker:"VALIDATE",title:"Đưa ra kết quả sử dụng được.",description:"Thử nghiệm theo phạm vi nhỏ, đánh giá kết quả rồi điều chỉnh trước khi mở rộng.",deliver:"Nguyên mẫu, phản hồi và tiêu chí nghiệm thu.",mark:"OUTCOME"}
] as const;

const steps=[
 {n:"01",title:"Đọc hiện trạng",lead:"Hiểu rõ hệ thống trước khi thay đổi.",description:"Quan sát những bước người dùng thực hiện, thông tin họ cần và nơi công việc bị gián đoạn.",output:"Bản đồ hiện trạng và danh sách điểm nghẽn."},
 {n:"02",title:"Định nghĩa vấn đề",lead:"Không giải bài toán chưa xác định.",description:"Thống nhất vấn đề ưu tiên, mức độ ảnh hưởng, trách nhiệm và những giả định cần kiểm chứng.",output:"Phạm vi vấn đề và thước đo thành công."},
 {n:"03",title:"Thiết kế luồng",lead:"Mọi bước đều có một lý do.",description:"Phác thảo luồng thông tin, điểm bàn giao giữa nhóm và các phương án có thể thử.",output:"Sơ đồ quy trình và nguyên mẫu điều hướng."},
 {n:"04",title:"Thử nghiệm & cải tiến",lead:"Để dữ liệu và người dùng trả lời.",description:"Đo mức phù hợp, thu thập phản hồi và điều chỉnh trên kết quả thực tế.",output:"Báo cáo thử nghiệm và đề xuất cải tiến."}
] as const;

const navigation=[
 {name:"Hướng tiếp cận",href:"/services",no:"01"},
 {name:"Năng lực",href:"/work",no:"02"},
 {name:"Tư duy NORTH",href:"/about",no:"03"},
 {name:"Liên hệ",href:"/contact",no:"04"},
] as const;

const points=[{x:"22%",y:"30%",id:"01"},{x:"73%",y:"24%",id:"02"},{x:"56%",y:"71%",id:"03"}] as const;

export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:Props){
 const [menu,setMenu]=useState(false);
 const [active,setActive]=useState(0);
 const [method,setMethod]=useState(0);
 const [step,setStep]=useState(0);
 const [issue,setIssue]=useState("Tổ chức lại quy trình");
 const [detail,setDetail]=useState("");
 const [clientName,setClientName]=useState("");
 const [email,setEmail]=useState("");
 const atlasRef=useRef<HTMLDivElement>(null);
 const go=(route:string)=>basePath+(route==="/"?"":route);
 const images=site.images.map(src=>assetBase+src);
 const current=services[active];
 const feature=services[Math.max(0,Math.min(2,itemIndex-1))];
 useEffect(()=>setMenu(false),[section]);
 useEffect(()=>{
  if(!menu)return;
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenu(false)};
  window.addEventListener("keydown",key);
  return()=>window.removeEventListener("keydown",key);
 },[menu]);
 const moveAtlas=(event:ReactPointerEvent<HTMLDivElement>)=>{
  if(event.pointerType!=="mouse"||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const node=atlasRef.current;if(!node)return;
  const bounds=node.getBoundingClientRect();
  const x=((event.clientX-bounds.left)/bounds.width-.5)*2;
  const y=((event.clientY-bounds.top)/bounds.height-.5)*2;
  node.style.setProperty("--north-shift-x",(x*9).toFixed(2)+"px");
  node.style.setProperty("--north-shift-y",(y*7).toFixed(2)+"px");
 };
 const resetAtlas=()=>{atlasRef.current?.style.removeProperty("--north-shift-x");atlasRef.current?.style.removeProperty("--north-shift-y")};
 const contact=(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  const subject="NORTH / Đề nghị trao đổi / "+issue;
  const body="Người liên hệ: "+clientName+"\nEmail liên hệ: "+email+"\nVấn đề: "+issue+"\n\nBối cảnh:\n"+detail+"\n\n— Bản nháp được tạo từ website demo NORTH. Người gửi tự chọn địa chỉ nhận trong ứng dụng email.";
  window.location.href="mailto:?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
 };
 return <div className={s.north} data-north-page={section}>
  <div className={s.utility}><span>NORTH / DECISION ARCHITECTURE</span><span>WEBSITE MẪU · NỘI DUNG MINH HỌA</span></div>
  <header className={s.globalHead}>
   <Link href={go("/")} className={s.insignia} aria-label="NORTH — về trang chủ"><span className={s.monogram}>N<span>.</span></span><span className={s.brandText}>NORTH<small>SYSTEMS & STRATEGY</small></span></Link>
   <nav className={s.topNav} aria-label="Điều hướng NORTH">{navigation.map(item=><Link key={item.href} href={go(item.href)} aria-current={section===(item.href.slice(1))?"page":undefined}>{item.name}</Link>)}</nav>
   <Link className={s.consult} href={go("/contact")}>Bắt đầu một cuộc trao đổi <span aria-hidden="true">→</span></Link>
   <button className={s.trigger} type="button" aria-label={menu?"Đóng điều hướng":"Mở điều hướng"} aria-expanded={menu} aria-controls="north-mobile-menu" onClick={()=>setMenu(v=>!v)}><span/><span/></button>
  </header>
  {menu&&<button className={s.scrim} type="button" onClick={()=>setMenu(false)} aria-label="Đóng menu NORTH"/>}
  <div className={s.mobileMenu} data-open={menu} id="north-mobile-menu" inert={!menu}>
   <div className={s.menuTop}><span>NORTH / DIRECTORY</span><button type="button" onClick={()=>setMenu(false)} aria-label="Đóng điều hướng">Đóng</button></div>
   {navigation.map(item=><Link key={item.href} onClick={()=>setMenu(false)} href={go(item.href)}><small>{item.no}</small>{item.name}<span aria-hidden="true">→</span></Link>)}
   <p>Rõ vấn đề. Đúng quyết định. Tiến bước có căn cứ.</p>
  </div>
  <main className={s.content} id="north-main">
  {section==="home"&&<>
   <section className={s.hero} aria-labelledby="north-hero-title">
    <div className={s.heroCopy}>
     <div className={s.heroIndex}><span>INDEPENDENT SYSTEM ADVISORY</span><span>FIELD NOTE / 001</span></div>
     <p className={s.eyebrow}><span className={s.blink} aria-hidden="true"/> Một cách nhìn khác về vận hành</p>
     <h1 id="north-hero-title">Bớt<br/><span>phức tạp.</span><br/><em>Rõ lối đi.</em></h1>
     <p className={s.heroLead}>Mỗi doanh nghiệp có một nút thắt riêng. NORTH giúp nhìn ra mối liên hệ, đặt đúng câu hỏi và chọn bước tiếp theo.</p>
     <div className={s.heroActions}><a className={s.primary} href="#north-map">Khám phá bản đồ vận hành <span aria-hidden="true">↓</span></a><Link className={s.secondary} href={go("/work")}>Xem phạm vi năng lực</Link></div>
     <div className={s.heroFoot}><span>THREE QUESTIONS.</span><span>ONE CLEAR DIRECTION.</span><span className={s.heroProgress}>01 — 03</span></div>
    </div>
    <div className={s.atlas} id="north-map" ref={atlasRef} onPointerMove={moveAtlas} onPointerLeave={resetAtlas} aria-label="Bản đồ vận hành có thể tương tác">
     <div className={s.atlasHead}><span>NORTH / LIVE SYSTEM MAP</span><span className={s.online}><i aria-hidden="true"/> TƯƠNG TÁC</span></div>
     <div className={s.atlasCanvas}>
      <div className={s.atlasRing} aria-hidden="true"/>
      <div className={s.atlasAxis} aria-hidden="true"><span>ANALYZE</span><span>DECIDE</span><span>ACT</span></div>
      <svg className={s.atlasLines} viewBox="0 0 620 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
       <path className={s.atlasGhost} d="M68 76 L156 126 L340 77 L470 109 L530 270 L350 342 L136 306 L68 76 M156 126 L350 342 M340 77 L136 306 M470 109 L136 306 M68 76 L530 270"/>
       <path className={s.atlasRoute} data-route={active} d={active===0?"M136 138 C199 194 200 265 300 238 C390 212 405 154 480 135":active===1?"M480 135 C437 155 386 258 300 238 C222 220 187 279 342 346":"M342 346 C296 275 241 230 136 138 C190 165 288 204 480 135"}/>
       <circle cx="300" cy="238" r="34" className={s.atlasCoreRing}/><circle cx="300" cy="238" r="10" className={s.atlasCore}/>
       <path d="M290 238 H310 M300 228 V248" stroke="#142b2e" strokeWidth="2"/>
      </svg>
      <div className={s.atlasCenter} aria-hidden="true"><span>NORTH</span><strong>SYS / 01</strong></div>
      {services.map((service,i)=><button type="button" key={service.index} className={s.atlasNode} data-active={i===active} style={{"--node-x":points[i].x,"--node-y":points[i].y} as CSSProperties} aria-pressed={i===active} aria-controls="north-atlas-output" onClick={()=>setActive(i)}><span>{service.index} / {service.label}</span><strong>{service.short}</strong><i aria-hidden="true"/></button>)}
      <div className={s.atlasCross} aria-hidden="true">N 01</div>
     </div>
     <div className={s.atlasResult} id="north-atlas-output" aria-live="polite"><div><span>ĐIỂM NGHẼN / {current.index}</span><h2>{current.question}</h2><p>{current.solution}</p></div><Link href={go("/work/"+(active+1))} aria-label={"Xem chi tiết "+current.name}>Xem hướng xử lý <span aria-hidden="true">→</span></Link></div>
     <div className={s.atlasBottom}><span>CHỌN MỘT ĐIỂM TRÊN BẢN ĐỒ</span><span>ĐÂY LÀ MÔ HÌNH MINH HỌA</span></div>
    </div>
   </section>

   <section className={s.statement}><span>001 / THE NORTH PRINCIPLE</span><p>Giải pháp tốt không khiến công việc phức tạp hơn. <em>Nó làm điều quan trọng trở nên rõ ràng.</em></p><span className={s.statementMark} aria-hidden="true">N.</span></section>

   <section className={s.methodSection} id="north-method">
    <div className={s.sectionTitle}><span className={s.sectionLabel}>02 / TỪ ĐIỂM NGHẼN ĐẾN QUYẾT ĐỊNH</span><h2>Đừng thêm<br/>một quy trình.<br/><em>Hãy gỡ một nút thắt.</em></h2><p>Ba chuyển động tạo thành một cách làm: quan sát hệ thống, sắp xếp ưu tiên và kiểm chứng hướng đi.</p></div>
    <div className={s.methodStage}>
     <div className={s.methodNav} role="group" aria-label="Ba bước của phương pháp NORTH">{methods.map((item,i)=><button key={item.n} type="button" aria-pressed={method===i} onClick={()=>setMethod(i)}><span>{item.n}</span><strong>{item.name}</strong><i aria-hidden="true"/></button>)}</div>
     <div className={s.methodVisual} data-method={method} aria-live="polite">
      <div className={s.methodGraphic} aria-hidden="true"><div className={s.graphLines}><span/><span/><span/><span/></div><div className={s.graphOrigin}>INPUT <b>?</b></div><div className={s.graphTarget}><span>OUTPUT</span><strong>{methods[method].mark}</strong></div><svg viewBox="0 0 320 180"><path d={method===0?"M40 25 C150 5 55 155 160 86 C234 38 250 170 298 130":method===1?"M40 35 L150 35 L150 91 L278 91 L278 135":"M40 135 L94 100 L164 115 L220 57 L290 44"} fill="none" stroke="#ec744b" strokeWidth="4" strokeLinecap="round"/></svg></div>
      <div className={s.methodText}><span>{methods[method].kicker} / 0{method+1}</span><h3>{methods[method].title}</h3><p>{methods[method].description}</p><div className={s.methodOutput}><small>ĐẦU RA THAM KHẢO</small><strong>{methods[method].deliver}</strong></div></div>
     </div>
    </div>
   </section>

   <section className={s.capabilitySection}>
    <div className={s.capabilityHead}><span>03 / THE CAPABILITY INDEX</span><h2>Ba hướng nhìn.<br/><em>Một hệ thống tốt hơn.</em></h2></div>
    <div className={s.capabilityList}>{services.map((item,i)=><Link key={item.name} href={go("/work/"+(i+1))} className={s.capabilityRow}><span className={s.capabilityNo}>{item.index} / 03</span><div><small>{item.chapter}</small><h3>{item.name}</h3><p>{item.tagline}</p></div><span className={s.capabilityArrow} aria-hidden="true">→</span></Link>)}</div>
    <div className={s.capabilityAside}><span>NORTH / SYSTEMS</span><strong>CLARITY<br/>IS AN<br/><em>ADVANTAGE.</em></strong></div>
   </section>

   <section className={s.editorialSection}>
    <div className={s.editorialPhoto}><img src={images[1]} alt="Ảnh minh họa không gian làm việc và hoạt động nhóm"/><span>VISUAL STUDY / NOT A CLIENT CASE</span></div>
    <div className={s.editorialCopy}><span>04 / A METHOD, NOT A MAGIC BUTTON</span><h2>Nhìn sâu hơn<br/>để tiến xa hơn.</h2><p>Không có công thức duy nhất cho mọi doanh nghiệp. NORTH trình bày một khung tư duy để đặt câu hỏi đúng, xem xét giới hạn và xây dựng cách vận hành phù hợp.</p><Link href={go("/about")}>Đọc triết lý NORTH <span aria-hidden="true">→</span></Link><small>Hình ảnh và nội dung minh họa, không phải hồ sơ triển khai thực tế.</small></div>
   </section>
   <NorthClosing go={go}/>
  </>}

  {section==="work"&&<>
   <section className={s.pageOpening}><span>INDEX / THREE SYSTEM QUESTIONS</span><h1>Không bán<br/><em>một đáp án.</em><br/>Bắt đầu bằng<br/>câu hỏi đúng.</h1><p>Ba nhóm vấn đề thường gặp trong tổ chức. Chọn một hướng để xem cách tiếp cận và đầu ra dự kiến.</p><div className={s.openingRule}><span>NORTH CAPABILITIES</span><span>01 — 03</span></div></section>
   <section className={s.workChapters}>{services.map((item,i)=><article key={item.index} className={s.workChapter} data-accent={item.accent}><div className={s.workChapterIndex}><span>{item.index} / 03</span><span>{item.label}</span></div><div className={s.workChapterBody}><div><small>{item.chapter}</small><h2>{item.name}</h2><p>{item.problem}</p><Link href={go("/work/"+(i+1))}>Khám phá hướng tiếp cận <span aria-hidden="true">→</span></Link></div><div className={s.workChapterVisual}><div className={s.workShape} aria-hidden="true"><span/><span/><span/></div><img src={images[(i+1)%images.length]} alt={"Ảnh minh họa cho "+item.name}/><span className={s.photoLabel}>NORTH / STUDY 0{i+1}</span></div></div></article>)}</section>
   <NorthClosing go={go}/>
  </>}

  {section==="detail"&&<>
   <section className={s.detailHero}><Link href={go("/work")} className={s.backLink}>← Tất cả năng lực</Link><div className={s.detailTop}><span>{feature.label} / NORTH</span><span>EXPLORATION {feature.index} / 03</span></div><h1>{feature.name}</h1><p>{feature.tagline}</p></section>
   <section className={s.detailBody}><div className={s.detailGraphic}><span>INPUT / NORTH SYSTEMS</span><div className={s.detailPath} aria-hidden="true"><i/><i/><i/><i/></div><strong>{feature.short}<span>→</span>{feature.name}</strong><small>EXPLORATORY MODEL — NOT A CLIENT CASE</small></div><div className={s.detailNarrative}><span>THE DECISION NOTE / {feature.index}</span><h2>Đi từ vấn đề<br/>đến hành động.</h2><div><small>01 / BỐI CẢNH</small><h3>Vấn đề cần nhìn rõ</h3><p>{feature.problem}</p></div><div><small>02 / CÁCH TIẾP CẬN</small><h3>Hướng xử lý</h3><p>{feature.solution}</p></div><div><small>03 / ĐẦU RA</small><h3>Kết quả dự kiến</h3><p>{feature.deliver}</p></div></div></section>
   <section className={s.detailNext}><span>THỰC HIỆN THEO BƯỚC</span><h2>Muốn biết hướng tiếp cận này phù hợp với tình huống của bạn?</h2><Link href={go("/contact")}>Mô tả vấn đề với NORTH <span aria-hidden="true">→</span></Link></section>
  </>}

  {section==="services"&&<>
   <section className={s.pageOpening}><span>THE NORTH OPERATING METHOD</span><h1>Không đoán.<br/><em>Không vội.</em><br/>Có phương pháp.</h1><p>Bốn chặng giúp biến câu hỏi ban đầu thành một hướng giải quyết rõ ràng và có thể kiểm chứng.</p><div className={s.openingRule}><span>THE DECISION PIPELINE</span><span>01 — 04</span></div></section>
   <section className={s.pipeline}><div className={s.pipelineLeft}><span>01 / THE FIELD METHOD</span><h2>Bạn đang ở<br/><em>đâu trong hệ thống?</em></h2><p>Chọn một giai đoạn để xem câu hỏi cần trả lời và kết quả dự kiến trước khi bước tiếp.</p><div className={s.pipelineSteps} role="group" aria-label="Các giai đoạn phương pháp NORTH">{steps.map((item,i)=><button type="button" key={item.n} aria-pressed={i===step} aria-controls="north-pipeline-result" onClick={()=>setStep(i)}><span>{item.n}</span><strong>{item.title}</strong><i aria-hidden="true"/></button>)}</div></div><div className={s.pipelineRight} id="north-pipeline-result" aria-live="polite"><span>PROJECT BLUEPRINT / {steps[step].n}</span><div className={s.pipelineDrawing} aria-hidden="true"><div className={s.pipelineTrace}><i/><i/><i/><i/></div><strong>{steps[step].n}</strong></div><small>CHẶNG {steps[step].n} / 04</small><h3>{steps[step].lead}</h3><p>{steps[step].description}</p><div className={s.pipelineDeliver}><span>ĐẦU RA CÓ THỂ KIỂM TRA</span><strong>{steps[step].output}</strong></div><button className={s.nextStage} type="button" onClick={()=>setStep(v=>(v+1)%steps.length)}>Xem bước tiếp theo <span aria-hidden="true">→</span></button></div></section>
   <section className={s.methodTakeaway}><span>THE NORTH RULE</span><p>Đừng bắt đầu từ công cụ.<br/><em>Hãy bắt đầu từ công việc cần cải thiện.</em></p></section><NorthClosing go={go}/>
  </>}

  {section==="about"&&<>
   <section className={s.aboutIntro}><span>NORTH / THE PRINCIPLES</span><div className={s.aboutIntroGrid}><h1>Rõ ràng<br/>không phải<br/><em>điều xa xỉ.</em></h1><div><p>Hệ thống tốt khiến mọi người hiểu điều gì cần làm, ai chịu trách nhiệm và tại sao một quyết định được đưa ra.</p><span className={s.aboutCompass} aria-hidden="true"><i>N</i><b>↓</b></span></div></div></section>
   <section className={s.aboutValues}><div className={s.aboutValuesHead}><span>THE OPERATING MANIFESTO</span><h2>Ba nguyên tắc.<br/><em>Một cách tư duy.</em></h2></div>{[{n:"01",title:"Nhìn toàn cảnh.",text:"Trước khi tối ưu một điểm, phải hiểu nó tác động thế nào đến những phần còn lại của hệ thống.",symbol:"01"},{n:"02",title:"Rõ người, rõ việc.",text:"Một quyết định tốt cần đi cùng trách nhiệm, dữ liệu đầu vào và điều kiện xác nhận kết quả.",symbol:"↔"},{n:"03",title:"Thiết kế để thay đổi.",text:"Quy trình cần đủ đơn giản để được sử dụng và đủ linh hoạt để tiếp tục cải tiến.",symbol:"↺"}].map(item=><article className={s.valueRow} key={item.n}><span>{item.n} / PRINCIPLE</span><h3>{item.title}</h3><p>{item.text}</p><span className={s.valueSymbol} aria-hidden="true">{item.symbol}</span></article>)}</section>
   <section className={s.aboutVisual}><div><span>INSIDE NORTH / SYSTEM THINKING</span><h2>Make sense<br/>of complexity.</h2><p>Thiết kế vận hành là thiết kế cách con người đưa ra quyết định. Không chỉ là những đường nối đẹp mắt.</p></div><div className={s.aboutGraphic} aria-hidden="true"><span/><span/><span/><b>N.</b></div></section><NorthClosing go={go}/>
  </>}

  {section==="contact"&&<>
   <section className={s.contactIntro}><span>START WITH A QUESTION</span><h1>Mọi thay đổi<br/>bắt đầu từ<br/><em>một vấn đề.</em></h1><p>Chia sẻ bối cảnh và mục tiêu. Bản mẫu này sẽ giúp bạn soạn nội dung để gửi bằng ứng dụng email của mình.</p></section>
   <section className={s.contactBody}><div className={s.contactAside}><span>NORTH / INPUT FORM</span><h2>Tell us<br/>what&apos;s<br/><em>stuck.</em></h2><div className={s.contactOrb} aria-hidden="true"><span>N</span><i/><i/></div><p>Không cần mô tả giải pháp trước. Chỉ cần bắt đầu với điều chưa hoạt động như mong đợi.</p><small>ĐÂY LÀ WEBSITE DEMO. KHÔNG LƯU DỮ LIỆU TRÊN MÁY CHỦ.</small></div>
   <form className={s.contactForm} onSubmit={contact}><div className={s.formHeading}><span>FIELD REPORT / 001</span><strong>Đề nghị trao đổi</strong></div><div className={s.contactRow}><div><label htmlFor="north-name">01 / Tên liên hệ</label><input id="north-name" autoComplete="name" required value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Tên của bạn"/></div><div><label htmlFor="north-email">02 / Email phản hồi</label><input id="north-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="ten@doanhnghiep.vn"/></div></div><label htmlFor="north-issue">03 / Vấn đề bạn quan tâm</label><NorthSelector id="north-issue" className={s.selectShell} value={issue} onChange={setIssue} options={["Tổ chức lại quy trình","Phát triển nền tảng số","Xây dựng chiến lược chuyển đổi"]}/><label htmlFor="north-detail">04 / Mô tả bối cảnh</label><textarea id="north-detail" required minLength={10} value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Điều gì đang gây gián đoạn? Bạn muốn thay đổi điều gì? Có những ràng buộc nào về thời gian hay nguồn lực?"/><div className={s.contactSubmit}><p>Nội dung chỉ được đưa vào bản nháp email. Bạn tự xác nhận người nhận và nhấn gửi trong ứng dụng email.</p><button type="submit">Tạo bản nháp trao đổi <span aria-hidden="true">→</span></button></div></form>
   </section>
  </>}
  </main>
  <footer className={s.footer}><div className={s.footerTop}><div><span>NORTH / DECISION ARCHITECTURE</span><strong>NORTH<span>.</span></strong><p>Rõ vấn đề. Đúng quyết định.<br/>Bước tiếp theo có căn cứ.</p></div><nav aria-label="Liên kết chân trang NORTH">{navigation.map(item=><Link key={item.href} href={go(item.href)}>{item.name}</Link>)}</nav></div><div className={s.footerBottom}><span>DEMONSTRATION WEBSITE / ATHENA STUDIO</span><span>KHÔNG ĐẠI DIỆN DOANH NGHIỆP THẬT</span><Link href={go("/")}>Về đầu trang ↑</Link></div></footer>
 </div>;
}

function NorthClosing({go}:{go:(path:string)=>string}){
 return <section className={s.closing}><div><span>THE NEXT MOVE / NORTH</span><h2>Chưa cần một đáp án.<br/><em>Hãy bắt đầu bằng câu hỏi.</em></h2></div><Link href={go("/contact")}>Mô tả vấn đề của bạn <span aria-hidden="true">→</span></Link><span className={s.closingN} aria-hidden="true">N.</span></section>;
}
