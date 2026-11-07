"use client";

import Link from "next/link";
import {useState} from "react";
import NorthSelector from "./NorthSelector";
import site from "../data/site.json";
import s from "./North.module.css";

type Section="home"|"work"|"services"|"about"|"contact"|"detail";
type Props={section?:Section;itemIndex?:number;basePath?:string;assetBase?:string};

const topics=[
 {
  number:"01",
  title:"Chưa rõ việc nào cần ưu tiên",
  short:"Ưu tiên công việc",
  name:"Xác định ưu tiên",
  problem:"Có nhiều việc cần làm nhưng chưa biết nên bắt đầu từ đâu.",
  approach:"Xác định vấn đề ảnh hưởng lớn nhất, những việc phụ thuộc nhau và thứ tự xử lý.",
  result:"Danh sách ưu tiên, lý do lựa chọn và cách đo kết quả.",
  question:"Nên bắt đầu từ đâu?",
 },
 {
  number:"02",
  title:"Quy trình và công cụ rời rạc",
  short:"Kết nối quy trình",
  name:"Kết nối quy trình",
  problem:"Thông tin nằm ở nhiều nơi, mọi người phải hỏi nhau hoặc nhập dữ liệu nhiều lần.",
  approach:"Làm rõ đường đi của thông tin và những bước cần phối hợp giữa các bộ phận.",
  result:"Sơ đồ quy trình đề xuất và nguyên mẫu của những bước cần cải thiện.",
  question:"Làm sao để công việc liền mạch hơn?",
 },
 {
  number:"03",
  title:"Có kế hoạch nhưng khó triển khai",
  short:"Triển khai thay đổi",
  name:"Lập kế hoạch triển khai",
  problem:"Định hướng đã có nhưng chưa rõ ai làm, làm khi nào và dựa vào đâu để đánh giá.",
  approach:"Chia kế hoạch thành những việc nhỏ, có người phụ trách và cách kiểm tra tiến độ.",
  result:"Lộ trình thực hiện và tiêu chí nghiệm thu cho từng giai đoạn.",
  question:"Làm gì để kế hoạch đi vào thực tế?",
 },
] as const;

const process=[
 {
  number:"01",
  title:"Hiểu vấn đề",
  description:"Tìm hiểu tình hình hiện tại và xác định điểm đang cản trở công việc.",
  result:"Vấn đề ưu tiên và bối cảnh cụ thể.",
 },
 {
  number:"02",
  title:"Đề xuất hướng giải quyết",
  description:"So sánh những phương án phù hợp với nguồn lực, người sử dụng và mục tiêu.",
  result:"Phương án, phạm vi và kế hoạch thực hiện.",
 },
 {
  number:"03",
  title:"Kiểm tra hiệu quả",
  description:"Thử nghiệm, ghi nhận phản hồi và điều chỉnh trước khi mở rộng.",
  result:"Kết quả kiểm thử và các bước tiếp theo.",
 },
] as const;

const principles=[
 {number:"01",name:"Dễ hiểu trước tiên",description:"Một hệ thống tốt giúp mọi người biết phải làm gì mà không cần học thêm thuật ngữ phức tạp."},
 {number:"02",name:"Có lý do cho mỗi quyết định",description:"Mỗi thay đổi phải giải quyết một vấn đề cụ thể, thay vì chỉ làm giao diện hoặc quy trình trông hiện đại hơn."},
 {number:"03",name:"Có thể kiểm chứng",description:"Một kế hoạch cần đi kèm đầu ra, trách nhiệm và cách đánh giá kết quả."},
] as const;

const navigation=[
 {text:"Giải pháp",href:"/work"},
 {text:"Quy trình",href:"/services"},
 {text:"Về chúng tôi",href:"/about"},
 {text:"Liên hệ",href:"/contact"},
] as const;

export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:Props){
 const [menu,setMenu]=useState(false);
 const [selected,setSelected]=useState(0);
 const [issue,setIssue]=useState("Ưu tiên công việc");
 const [clientName,setClientName]=useState("");
 const [email,setEmail]=useState("");
 const [detail,setDetail]=useState("");

 const go=(route:string)=>basePath+(route==="/"?"":route);
 const current=topics[selected];
 const selectedDetail=topics[Math.max(0,Math.min(topics.length-1,itemIndex-1))];
 const images=site.images.map(path=>assetBase+path);

 const createEmail=(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  const subject=site.brand+" / Yêu cầu tư vấn / "+issue;
  const body="Tên: "+clientName+"\nEmail: "+email+"\nVấn đề: "+issue+"\n\nBối cảnh:\n"+detail+
   "\n\nĐây là bản nháp từ website mẫu NORTH. Vui lòng tự chọn địa chỉ người nhận và kiểm tra nội dung trước khi gửi.";
  window.location.href="mailto:?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
 };

 return <div className={s.north} data-north-page={section} onKeyDownCapture={event=>{if(event.key==="Escape")setMenu(false)}}>
  <div className={s.utility}><span>{site.brand.toLocaleUpperCase("vi")} / TƯ VẤN HỆ THỐNG</span><span>WEBSITE DEMO · NỘI DUNG MINH HỌA</span></div>
  <header className={s.globalHead}>
   <Link href={go("/")} className={s.insignia} aria-label={site.brand+" — trang chủ"}>
    <span className={s.monogram}>{site.brand.slice(0,1).toLocaleUpperCase("vi")}<span>.</span></span>
    <span className={s.brandText}>{site.brand}<small>SYSTEMS & STRATEGY</small></span>
   </Link>
   <nav className={s.topNav} aria-label="Điều hướng chính">
    {navigation.map(item=><Link href={go(item.href)} key={item.href} aria-current={section===item.href.slice(1)||(section==="detail"&&item.href==="/work")?"page":undefined}>{item.text}</Link>)}
   </nav>
   <Link href={go("/contact")} className={s.consult}>Trao đổi nhu cầu <span aria-hidden="true">→</span></Link>
   <button type="button" className={s.trigger} onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="north-mobile-menu" aria-label={menu?"Đóng menu":"Mở menu"}>
    <span/><span/>
   </button>
  </header>
  {menu&&<button type="button" className={s.scrim} onClick={()=>setMenu(false)} aria-label="Đóng menu"/>}
  <div className={s.mobileMenu} id="north-mobile-menu" data-open={menu} inert={!menu}>
   <div className={s.mobileMenuHeading}>Điều hướng <button type="button" onClick={()=>setMenu(false)} aria-label="Đóng điều hướng"><span aria-hidden="true">×</span></button></div>
   {navigation.map(item=><Link href={go(item.href)} key={item.href} onClick={()=>setMenu(false)}>{item.text}<span aria-hidden="true">→</span></Link>)}
  </div>

  <main className={s.content} id="north-main">
   {section==="home"&&<>
    <section className={s.hero}>
     <div className={s.heroCopy}>
      <p className={s.eyebrow}>CỐ VẤN HỆ THỐNG & VẬN HÀNH</p>
      <h1>Bớt phức tạp.<br/><em>Rõ việc cần làm.</em></h1>
      <p className={s.heroLead}>Từ những quy trình rời rạc đến một hướng làm việc rõ ràng. NORTH giúp xác định vấn đề, chọn ưu tiên và lên kế hoạch cải thiện.</p>
      <div className={s.heroActions}>
       <Link className={s.primary} href={go("/work")}>Xem các giải pháp <span aria-hidden="true">→</span></Link>
       <Link className={s.secondary} href={go("/contact")}>Mô tả vấn đề</Link>
      </div>
      <p className={s.heroNote}>Chọn một vấn đề để xem hướng giải quyết phù hợp.</p>
     </div>
     <div className={s.decisionPanel}>
      <div className={s.panelHeader}><span>01 / XÁC ĐỊNH NHU CẦU</span><span>CHỌN MỘT VẤN ĐỀ</span></div>
      <h2>Điều gì đang khiến công việc khó hơn?</h2>
      <div className={s.problemChoices} role="group" aria-label="Chọn vấn đề cần cải thiện">
       {topics.map((item,i)=><button key={item.number} type="button" className={s.problemChoice} aria-pressed={selected===i} aria-controls="north-decision-result" onClick={()=>setSelected(i)}>
        <span>{item.number}</span><strong>{item.title}</strong><span className={s.choiceMarker} aria-hidden="true">{selected===i?"●":"○"}</span>
       </button>)}
      </div>
      <div className={s.decisionResult} id="north-decision-result" aria-live="polite">
       <small>HƯỚNG GIẢI QUYẾT THAM KHẢO</small>
       <h3>{current.name}</h3>
       <p>{current.approach}</p>
       <Link href={go("/work/"+(selected+1))}>Tìm hiểu chi tiết <span aria-hidden="true">→</span></Link>
      </div>
     </div>
    </section>

    <section className={s.howSection}>
     <div className={s.sectionIntro}>
      <span className={s.sectionEyebrow}>02 / CÁCH LÀM VIỆC</span>
      <h2>Ba bước.<br/><em>Dễ theo dõi.</em></h2>
      <p>Không thêm một hệ thống phức tạp khác. Mỗi bước đều có nội dung và kết quả cụ thể.</p>
      <Link href={go("/services")}>Xem đầy đủ quy trình <span aria-hidden="true">→</span></Link>
     </div>
     <ol className={s.stepsPreview}>
      {process.map(item=><li key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}
     </ol>
    </section>
    <NorthClosing go={go} brand={site.brand}/>
   </>}

   {section==="work"&&<>
    <section className={s.pageIntro}>
     <span className={s.sectionEyebrow}>NORTH / NĂNG LỰC</span>
     <h1>Ba vấn đề thường gặp.<br/><em>Ba hướng giải quyết.</em></h1>
     <p>Mỗi vấn đề cần một cách tiếp cận phù hợp. Chọn chủ đề gần nhất với tình huống của bạn để xem chi tiết.</p>
    </section>
    <section className={s.workList} aria-label="Các lĩnh vực hỗ trợ">
     {topics.map((item,i)=><article key={item.number} className={s.workItem}>
      <div className={s.workNumber}>{item.number} / 03</div>
      <div className={s.workContent}>
       <h2>{item.name}</h2><p>{item.problem}</p>
       <Link href={go("/work/"+(i+1))}>Xem hướng giải quyết <span aria-hidden="true">→</span></Link>
      </div>
      <div className={s.workVisual}>
       <img src={images[(i+1)%images.length]} alt={"Ảnh minh họa cho "+item.name} loading="lazy"/>
       <span>HÌNH ẢNH MINH HỌA</span>
      </div>
     </article>)}
    </section>
    <NorthClosing go={go} brand={site.brand}/>
   </>}

   {section==="detail"&&<>
    <section className={s.detailIntro}>
     <Link href={go("/work")} className={s.backLink}>← Quay lại danh sách giải pháp</Link>
     <span className={s.sectionEyebrow}>GIẢI PHÁP {selectedDetail.number} / 03</span>
     <h1>{selectedDetail.name}</h1>
     <p>{selectedDetail.question}</p>
    </section>
    <section className={s.detailContent}>
     <div className={s.detailMain}>
      <h2>Cách {site.brand} tiếp cận</h2>
      <div className={s.detailItem}><span>01 / VẤN ĐỀ</span><h3>Điều cần cải thiện</h3><p>{selectedDetail.problem}</p></div>
      <div className={s.detailItem}><span>02 / HƯỚNG GIẢI QUYẾT</span><h3>Những việc nên làm</h3><p>{selectedDetail.approach}</p></div>
      <div className={s.detailItem}><span>03 / KẾT QUẢ DỰ KIẾN</span><h3>Đầu ra cần xác nhận</h3><p>{selectedDetail.result}</p></div>
     </div>
     <aside className={s.detailAside}>
      <span>GỢI Ý BẮT ĐẦU</span><h2>{selectedDetail.title}</h2>
      <p>Đây là tình huống minh họa, không phải hồ sơ khách hàng hoặc cam kết kết quả.</p>
      <Link className={s.primary} href={go("/contact")}>Trao đổi tình huống thực tế →</Link>
     </aside>
    </section>
   </>}

   {section==="services"&&<>
    <section className={s.pageIntro}>
     <span className={s.sectionEyebrow}>NORTH / QUY TRÌNH LÀM VIỆC</span>
     <h1>Hiểu vấn đề.<br/><em>Thực hiện từng bước.</em></h1>
     <p>Quy trình rõ ràng để người tham gia biết cần chuẩn bị gì và nhận lại điều gì.</p>
    </section>
    <section className={s.processPage}>
     <div className={s.processHeading}>
      <h2>Từ trao đổi đến kế hoạch cải thiện.</h2>
      <p>Bốn chặng có thể điều chỉnh theo độ phức tạp thực tế của từng dự án.</p>
     </div>
     <ol className={s.processList}>
      {[
       {n:"01",title:"Tìm hiểu hiện trạng",description:"Trao đổi về công việc đang diễn ra, những điểm nghẽn và người liên quan.",result:"Bản tóm tắt vấn đề."},
       {n:"02",title:"Thống nhất ưu tiên",description:"Chọn việc cần giải quyết trước, phạm vi và cách đánh giá hiệu quả.",result:"Phạm vi và tiêu chí rõ ràng."},
       {n:"03",title:"Thiết kế phương án",description:"Phác thảo quy trình, công cụ hoặc phương án tổ chức công việc phù hợp.",result:"Phương án triển khai để cùng xem xét."},
       {n:"04",title:"Kiểm thử và bàn giao",description:"Thử nghiệm, thu thập phản hồi và điều chỉnh theo phạm vi đã thống nhất.",result:"Kết quả nghiệm thu và đề xuất tiếp theo."},
      ].map(item=><li key={item.n}>
       <span className={s.processNumber}>{item.n}</span>
       <div><h3>{item.title}</h3><p>{item.description}</p></div>
       <div className={s.processOutput}><small>ĐẦU RA</small><strong>{item.result}</strong></div>
      </li>)}
     </ol>
    </section>
    <NorthClosing go={go} brand={site.brand}/>
   </>}

   {section==="about"&&<>
    <section className={s.pageIntro}>
     <span className={s.sectionEyebrow}>NORTH / QUAN ĐIỂM LÀM VIỆC</span>
     <h1>Một hệ thống tốt<br/><em>phải dễ sử dụng.</em></h1>
     <p>NORTH đặt con người, công việc thực tế và kết quả có thể kiểm chứng ở trung tâm của mọi đề xuất.</p>
    </section>
    <section className={s.aboutPage}>
     <div className={s.aboutTitle}><span>BA NGUYÊN TẮC</span><h2>Đơn giản không có nghĩa là sơ sài.</h2></div>
     <div className={s.principles}>
      {principles.map(item=><article key={item.number}>
       <span>{item.number}</span><h3>{item.name}</h3><p>{item.description}</p>
      </article>)}
     </div>
    </section>
    <NorthClosing go={go} brand={site.brand}/>
   </>}

   {section==="contact"&&<>
    <section className={s.pageIntro}>
     <span className={s.sectionEyebrow}>NORTH / LIÊN HỆ</span>
     <h1>Hãy kể về<br/><em>vấn đề bạn gặp.</em></h1>
     <p>Bạn không cần chuẩn bị sẵn giải pháp. Một mô tả ngắn về điều đang khó khăn là đủ để bắt đầu.</p>
    </section>
    <section className={s.contactPage}>
     <div className={s.contactDescription}>
      <h2>Nội dung trao đổi</h2>
      <p>Chọn vấn đề gần nhất với tình huống của bạn, thêm một vài thông tin và tạo bản nháp email.</p>
      <div className={s.contactDisclosure}>
       <strong>Lưu ý về website mẫu</strong>
       <p>Biểu mẫu không gửi dữ liệu lên máy chủ. Bạn sẽ tự chọn người nhận và xác nhận gửi trong ứng dụng email.</p>
      </div>
     </div>
     <form className={s.contactForm} onSubmit={createEmail}>
      <div className={s.contactRow}>
       <div><label htmlFor="north-name">Tên liên hệ</label><input id="north-name" autoComplete="name" required value={clientName} onChange={event=>setClientName(event.target.value)} placeholder="Tên của bạn"/></div>
       <div><label htmlFor="north-email">Email</label><input id="north-email" autoComplete="email" type="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="ten@doanhnghiep.vn"/></div>
      </div>
      <label htmlFor="north-issue">Vấn đề cần trao đổi</label>
      <NorthSelector id="north-issue" className={s.selectShell} value={issue} onChange={setIssue} options={["Ưu tiên công việc","Kết nối quy trình và công cụ","Lập kế hoạch triển khai"]}/>
      <label htmlFor="north-detail">Mô tả bối cảnh</label>
      <textarea id="north-detail" required minLength={10} value={detail} onChange={event=>setDetail(event.target.value)} placeholder="Bạn muốn cải thiện điều gì? Công việc đang gặp khó khăn ở đâu?"/>
      <button className={s.submit} type="submit">Tạo bản nháp email <span aria-hidden="true">→</span></button>
     </form>
    </section>
   </>}
  </main>

  <footer className={s.footer}>
   <div className={s.footerTop}>
    <div><Link href={go("/")} className={s.footerBrand}>{site.brand}<span>.</span></Link><p>Rõ vấn đề. Đúng ưu tiên. Từng bước cải thiện.</p></div>
    <nav aria-label="Điều hướng chân trang">{navigation.map(item=><Link href={go(item.href)} key={item.href}>{item.text}</Link>)}</nav>
   </div>
   <div className={s.footerBottom}><span>WEBSITE MINH HỌA / ATHENA STUDIO</span><span>Không đại diện cho doanh nghiệp thật.</span></div>
  </footer>
 </div>;
}

function NorthClosing({go,brand}:{go:(path:string)=>string;brand:string}){
 return <section className={s.closing}>
  <div><span>BƯỚC TIẾP THEO</span><h2>Biết rõ vấn đề.<br/><em>Dễ chọn hướng đi.</em></h2></div>
  <Link href={go("/contact")}>Trao đổi với {brand} <span aria-hidden="true">→</span></Link>
 </section>;
}
