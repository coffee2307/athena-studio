"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import site from "../data/site.json";
import s from "./campaign-sovereign.module.css";

type Section="home"|"work"|"services"|"about"|"contact"|"detail";
type Props={section?:Section;itemIndex?:number;basePath?:string;assetBase?:string};
const chapters=[
 {id:"01",slug:"sound",eyebrow:"ÂM THANH / NHỊP ĐIỆU",title:"Để thành phố lên tiếng.",short:"Nghe những điều bình thường theo cách khác.",detail:"Một góc nhìn giả định về âm thanh, chuyển động và nhịp sống. Không phải lịch diễn hoặc danh sách nghệ sĩ đã xác nhận.",call:"LẮNG NGHE",image:0},
 {id:"02",slug:"vision",eyebrow:"THỊ GIÁC / KHÔNG GIAN",title:"Nhìn lại điều quen thuộc.",short:"Thay đổi góc nhìn, mở ra một không gian mới.",detail:"Một chương hình ảnh minh họa cách nghệ thuật có thể biến bức tường, ánh sáng và phố xá thành chất liệu kể chuyện.",call:"QUAN SÁT",image:1},
 {id:"03",slug:"make",eyebrow:"XƯỞNG / THỰC HÀNH",title:"Ý tưởng cần người bắt đầu.",short:"Chạm vào chất liệu. Thử một điều chưa từng thử.",detail:"Một ý tưởng workshop mô phỏng, nơi người tham gia tự sáng tạo thay vì chỉ đứng nhìn. Không nhận đăng ký hoặc thu phí thật.",call:"TẠO NÊN",image:2}
];
const navigation:[string,string][]=[["Chương trình","/work"],["Trải nghiệm","/services"],["Câu chuyện","/about"]];
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:Props){
 const [menu,setMenu]=useState(false);
 const [active,setActive]=useState(0);
 const [name,setName]=useState("");
 const [message,setMessage]=useState("");
 const [interest,setInterest]=useState("Chương trình sáng tạo");
 const [notice,setNotice]=useState("");
 const stageRef=useRef<HTMLDivElement>(null);
 const go=(target:string)=>basePath+(target==="/"?"":target);
 const media=site.images.map(file=>assetBase+file);
 const current=chapters[active];
 const chapter=chapters[Math.max(0,Math.min(chapters.length-1,itemIndex-1))];
 useEffect(()=>setMenu(false),[section]);
 useEffect(()=>{
  if(!menu)return;
  const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setMenu(false)};
  window.addEventListener("keydown",close);
  return()=>window.removeEventListener("keydown",close);
 },[menu]);
 const draft=(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(message.trim().length<10)return;
  const subject="MỞ Festival / "+interest;
  const body="Tên: "+name.trim()+"\nChủ đề: "+interest+"\n\n"+message.trim()+"\n\n(Gửi từ giao diện demo Athena Studio)";
  window.location.href="mailto:?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
  setNotice("Đã mở bản nháp trên ứng dụng email nếu thiết bị hỗ trợ. Bạn cần tự chọn người nhận và gửi.");
 };
 const copy=async()=>{
  try{
   await navigator.clipboard.writeText("MỞ Festival — "+interest+"\n"+message.trim());
   setNotice("Đã sao chép nội dung. Đây chỉ là bản demo, không gửi dữ liệu.");
  }catch{setNotice("Không thể sao chép tự động. Hãy chọn và sao chép nội dung trong ô nhập.");}
 };
 return <div className={s.root} id="campaign-landing-top">
  <header className={s.header}>
   <Link className={s.logo} href={go("/")} aria-label={site.brand+" — về trang chủ"}>{site.brand.split(" ")[0]}<span className={s.logoDot}>.</span><small>FESTIVAL<br/>CONCEPT</small></Link>
   <nav className={s.desktopNav} aria-label="Điều hướng chính">{navigation.map(([title,route])=><Link href={go(route)} key={route}>{title}</Link>)}</nav>
   <Link href={go("/contact")} className={s.headerCta}>THAM GIA Ý TƯỞNG <span aria-hidden="true">↗</span></Link>
   <button type="button" className={s.menuButton} aria-label={menu?"Đóng điều hướng":"Mở điều hướng"} aria-expanded={menu} aria-controls="mo-mobile-navigation" onClick={()=>setMenu(v=>!v)}><i/><i/><span>{menu?"ĐÓNG":"MENU"}</span></button>
  </header>
  <div id="mo-mobile-navigation" className={s.mobileNav} data-open={menu} inert={!menu}>
   <span className={s.mobileLabel}>ĐI BẤT CỨ ĐÂU / 01—04</span>
   {[["Khám phá","/"],...navigation,["Liên hệ","/contact"]].map(([title,route],i)=><Link key={route} href={go(route)} onClick={()=>setMenu(false)}><small>0{i+1}</small>{title}<span aria-hidden="true">↗</span></Link>)}
   <p>Website mẫu sáng tạo. Không có hoạt động bán vé hoặc nhận đăng ký thực tế.</p>
  </div>
  <main>
   {section==="home"&&<>
    <section className={s.posterStage} data-dna04-artifact="campaign-landing-posterStage">
     <div className={s.heroTop}><span>CHƯƠNG TRÌNH SÁNG TẠO — DEMO</span><span>KHÔNG CÓ NGÀY DIỄN RA THỰC TẾ</span></div>
     <div className={s.heroText}>
      <span className={s.heroOverline}><i/> KHÔNG GIAN MỞ / Ý TƯỞNG MỚI</span>
      <h1>THÀNH PHỐ<br/><em>LÀ SÂN</em><br/>KHẤU<span className={s.heroPeriod}>.</span></h1>
      <p>Không chỉ nhìn. Không chỉ nghe. Hãy bước vào một thành phố được kể lại bằng nghệ thuật và trí tưởng tượng.</p>
      <div className={s.heroActions}><Link href={go("/work")} className={s.primary}>KHÁM PHÁ CHƯƠNG TRÌNH <span aria-hidden="true">↗</span></Link><button type="button" className={s.scrollAction} onClick={()=>stageRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}>XEM TIẾP <span aria-hidden="true">↓</span></button></div>
     </div>
     <div className={s.heroArt} aria-hidden="true"><div className={s.artHalo}/><span className={s.artTop}>THIS<br/>CITY</span><span className={s.artCenter}>MỞ</span><span className={s.artBottom}>IS YOUR<br/>STAGE.</span><span className={s.artSeal}>CONCEPT<br/>EDITION<br/>26</span></div>
     <div className={s.heroBottom}><span>01 / 03 — KHÁM PHÁ TỪNG CHƯƠNG</span><span>↓ CUỘN ĐỂ MỞ RA</span></div>
    </section>
    <section className={s.manifesto} ref={stageRef}><span className={s.eyebrow}>BẢN TUYÊN NGÔN / 001</span><div><p>VẪN CÒN <strong>RẤT NHIỀU</strong> CÁCH ĐỂ NHÌN THẾ GIỚI.</p><Link href={go("/about")}>ĐÂY LÀ MỞ <span aria-hidden="true">↗</span></Link></div><span className={s.manifestoGlyph} aria-hidden="true">↗</span></section>
    <section className={s.chapterSection}>
     <div className={s.sectionHeading}><div><span className={s.eyebrow}>BA CHƯƠNG / MỘT Ý TƯỞNG</span><h2>MỞ TỪ<br/>MỌI PHÍA.</h2></div><p>Chọn một chương để thay đổi poster. Mỗi phần là một hướng khám phá của chương trình khái niệm.</p></div>
     <div className={s.chapterLayout}>
      <div className={s.chapterControls} role="group" aria-label="Chọn chương trình">{chapters.map((ch,i)=><button key={ch.id} aria-pressed={active===i} type="button" onClick={()=>setActive(i)} className={s.chapterButton}><small>{ch.id}</small><span>{ch.title}<em>{ch.eyebrow}</em></span><b aria-hidden="true">↗</b></button>)}</div>
      <figure className={s.chapterVisual} data-dna04-artifact="campaign-landing-chapterVisual"><img src={media[current.image]} alt={"Hình ảnh minh họa cho chương "+current.eyebrow}/><span className={s.chapterImageLabel}>VISUAL STUDY / {current.id}</span><figcaption><strong>{current.call}</strong><p>{current.short}</p><Link href={go("/work/"+(active+1))}>XEM CHƯƠNG {current.id} <span aria-hidden="true">↗</span></Link></figcaption></figure>
     </div>
    </section>
    <section className={s.runningLine} aria-label="Chủ đề chiến dịch"><div>KHÔNG NGỪNG TƯỞNG TƯỢNG <span aria-hidden="true">/</span> KHÔNG NGỪNG KHÁM PHÁ <span aria-hidden="true">/</span> KHÔNG NGỪNG TẠO NÊN</div></section>
    <section className={s.closingInvitation}><span className={s.eyebrow}>ĐỂ CÂU CHUYỆN BẮT ĐẦU</span><h2>ĐỪNG CHỈ<br/>ĐỨNG NGOÀI<span>.</span></h2><div><p>Đây là một website minh họa được thiết kế cho thư viện Athena Studio. Bạn có thể khám phá các ý tưởng, nhưng không có vé, lịch biểu diễn hoặc đơn đăng ký thực tế.</p><Link href={go("/contact")} className={s.primary}>ĐỂ LẠI Ý TƯỞNG <span aria-hidden="true">↗</span></Link></div></section>
   </>}
   {section==="work"&&<section className={s.subPage}><div className={s.pageHero}><span className={s.eyebrow}>MỞ FESTIVAL / CHƯƠNG TRÌNH GIẢ ĐỊNH</span><h1>BA CÁCH<br/><em>ĐỂ MỞ.</em></h1><p>Ba chương sáng tạo, ba góc nhìn khác nhau. Tất cả là nội dung minh họa, không đại diện cho một lịch sự kiện thực tế.</p></div><div className={s.programGrid}>{chapters.map((ch,i)=><Link href={go("/work/"+(i+1))} key={ch.id} className={s.programCard} data-dna04-artifact={"campaign-landing-program-"+i}><div className={s.programPhoto}><img src={media[ch.image]} alt={"Minh họa "+ch.eyebrow}/><b>{ch.id} / 03</b></div><span>{ch.eyebrow}</span><h2>{ch.title}</h2><p>{ch.short}</p><strong>XEM CÂU CHUYỆN <span aria-hidden="true">↗</span></strong></Link>)}</div></section>}
   {section==="detail"&&<article className={s.detailPage}><Link href={go("/work")} className={s.back}>← TẤT CẢ CHƯƠNG</Link><div className={s.detailHeading}><span className={s.eyebrow}>CHƯƠNG {chapter.id} / {chapter.eyebrow}</span><h1>{chapter.title}</h1><p>{chapter.short}</p></div><figure className={s.detailImage}><img src={media[chapter.image]} alt={"Hình ảnh minh họa "+chapter.title}/><figcaption>HÌNH ẢNH MINH HỌA / MỞ FESTIVAL CONCEPT</figcaption></figure><div className={s.detailStory}><span>GÓC NHÌN</span><p>{chapter.detail}</p><span>CÁCH THAM GIA</span><p>Hãy khám phá một ý tưởng khác hoặc soạn lời nhắn trao đổi. Không có hoạt động đăng ký được thực hiện qua bản demo này.</p></div><div className={s.detailLinks}><Link href={go("/work/"+(itemIndex%3+1))}>CHƯƠNG TIẾP THEO ↗</Link><Link href={go("/contact")}>CHIA SẺ Ý TƯỞNG ↗</Link></div></article>}
   {section==="services"&&<section className={s.subPage}><div className={s.pageHero}><span className={s.eyebrow}>TRẢI NGHIỆM / CHỌN MỘT TÍN HIỆU</span><h1>KHƠI NGUỒN<br/><em>KHÁC BIỆT.</em></h1><p>Mỗi chương là một phương thức sáng tạo. Hãy chọn một tín hiệu và theo dõi sự thay đổi trong khung hình.</p></div><div className={s.experience}><div className={s.experienceChoices} role="group" aria-label="Chọn trải nghiệm">{chapters.map((ch,i)=><button type="button" key={ch.id} aria-pressed={active===i} onClick={()=>setActive(i)}><small>{ch.id} / {ch.eyebrow}</small><strong>{ch.call}</strong><span aria-hidden="true">↗</span></button>)}</div><div className={s.experienceFrame}><img src={media[current.image]} alt={"Hình minh họa "+current.title}/><div><span>{current.id} / {current.call}</span><h2>{current.title}</h2><p>{current.detail}</p><Link href={go("/work/"+(active+1))}>KHÁM PHÁ CHƯƠNG <span aria-hidden="true">↗</span></Link></div></div></div></section>}
   {section==="about"&&<section className={s.aboutPage}><span className={s.eyebrow}>VỀ MỞ / CHƯƠNG TRÌNH Ý NIỆM</span><h1>KHÔNG PHẢI MỘT ĐỊA ĐIỂM.<br/><em>LÀ MỘT CÁCH NHÌN.</em></h1><div className={s.aboutSplit}><div className={s.aboutArt} aria-label="Hình đồ họa chữ MỞ"><span>?</span><b>MỞ</b><small>WHAT IF / 2026</small></div><div className={s.aboutText}><h2>Không chờ sự sáng tạo gõ cửa.</h2><p>MỞ Festival là thương hiệu khái niệm được xây dựng để minh họa cách một landing page chiến dịch có thể kể chuyện bằng hình ảnh, cấu trúc và tương tác.</p><p>Toàn bộ chương trình, thông điệp và hình ảnh chỉ phục vụ trình diễn giao diện. MỞ không công bố lịch sự kiện, nghệ sĩ, địa điểm hay bán vé trong bản demo này.</p><Link href={go("/work")} className={s.primary}>XEM BA CHƯƠNG <span aria-hidden="true">↗</span></Link></div></div></section>}
   {section==="contact"&&<section className={s.contactPage}><div className={s.contactIntro}><span className={s.eyebrow}>LỜI MỜI / BẢN NHÁP LIÊN HỆ</span><h1>CÓ MỘT<br/><em>Ý TƯỞNG?</em></h1><p>Hãy ghi lại. Biểu mẫu chỉ tạo nội dung email trên thiết bị của bạn; website mẫu không nhận hoặc lưu dữ liệu.</p><div className={s.contactGraphic} aria-hidden="true">↗</div></div><form className={s.contactForm} onSubmit={draft}><label htmlFor="mo-name">TÊN CỦA BẠN</label><input id="mo-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Bạn muốn được gọi là gì?" required maxLength={90}/><label htmlFor="mo-interest">CHỦ ĐỀ MUỐN TRAO ĐỔI</label><select id="mo-interest" value={interest} onChange={e=>setInterest(e.target.value)}><option>Chương trình sáng tạo</option><option>Ý tưởng hợp tác</option><option>Thiết kế trải nghiệm</option></select><label htmlFor="mo-message">Ý TƯỞNG CỦA BẠN</label><textarea id="mo-message" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Hãy kể về điều bạn đang tưởng tượng..." required minLength={10} maxLength={3000}/><button type="submit" className={s.primary}>TẠO BẢN NHÁP EMAIL <span aria-hidden="true">↗</span></button><button type="button" className={s.copyButton} onClick={copy} disabled={!message.trim()}>SAO CHÉP NỘI DUNG</button><p role="status" aria-live="polite">{notice||"Không có người nhận mặc định. Bạn tự lựa chọn địa chỉ nhận và bấm gửi trong ứng dụng email."}</p></form></section>}
  </main>
  <footer className={s.footer}><div className={s.footerUpper}><div><span className={s.eyebrow}>MỞ FESTIVAL / AN ATHENA STUDIO DEMO</span><p>Một ý tưởng được dựng thành trải nghiệm. Không phải thông báo sự kiện đang diễn ra.</p></div><nav aria-label="Điều hướng chân trang">{[["Trang chủ","/"],...navigation,["Liên hệ","/contact"]].map(([title,route])=><Link key={route} href={go(route)}>{title}</Link>)}</nav></div><div className={s.footerMark}>{site.brand.split(" ")[0]}<span>.</span></div><div className={s.footerBottom}><span>© 2026 / WEBSITE MẪU</span><span>THÀNH PHỐ LÀ SÂN KHẤU.</span><Link href={go("/")}>TRỞ LÊN ĐẦU ↑</Link></div></footer>
 </div>;
}
