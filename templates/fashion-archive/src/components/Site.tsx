"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import site from "../data/site.json";
import FashionHero3D from "./FashionHero3D";
import s from "./runway-sovereign.module.css";

type Section="home"|"work"|"services"|"about"|"contact"|"detail";
const navItems:[string,string][]=[["Bộ sưu tập","/work"],["Atelier","/services"],["Câu chuyện","/about"],["Liên hệ","/contact"]];
const looks=[
 {id:"01",title:"THE CITY SILHOUETTE",name:"Phom dáng đô thị",kind:"SILHOUETTE",desc:"Một nghiên cứu về tỷ lệ và cách trang phục chuyển động cùng cơ thể.",feature:"Khám phá tỷ lệ vai, chiều dài áo và cách phối lớp.",image:1},
 {id:"02",title:"COLOUR IN MOTION",name:"Sắc màu chuyển động",kind:"COLOUR",desc:"Tương phản màu sắc tạo ra điểm nhấn cho những bộ trang phục hàng ngày.",feature:"Quan sát những mảng màu và chi tiết phối trang phục.",image:2},
 {id:"03",title:"THE AFTERLIGHT",name:"Ánh sáng sau cùng",kind:"CAMPAIGN",desc:"Ánh sáng góc thấp làm rõ cấu trúc phom dáng và tinh thần của một look.",feature:"Ảnh thời trang trong một bố cục gọn, rõ chi tiết.",image:3}
] as const;
const atelierSteps=[
 {name:"Bắt đầu từ phom",label:"01 / PHÁC THẢO",desc:"Xác định kiểu dáng, tỷ lệ và chi tiết cần làm rõ trong bộ sưu tập.",output:"Bản phác thảo cùng hướng phối dáng."},
 {name:"Chọn chất liệu",label:"02 / KIỂM TRA",desc:"So sánh chất liệu bằng hình ảnh, mẫu thử và cảm giác sử dụng thực tế.",output:"Hướng dẫn chất liệu và những chi tiết cần thử."},
 {name:"Trình bày thành look",label:"03 / LOOKBOOK",desc:"Chụp ảnh, biên tập và trình bày mỗi look theo một hệ thống hình ảnh nhất quán.",output:"Bộ ảnh lookbook, ảnh chi tiết và bản mô tả."}
];
const materials=[
 {name:"Phom dáng",point:"01 / FORM",image:1,desc:"Nhìn tổng thể tỷ lệ, cách phối lớp và hướng chuyển động của trang phục."},
 {name:"Chất liệu",point:"02 / TEXTURE",image:0,desc:"Quan sát bề mặt, nếp gấp và cách vải bắt sáng ở nhiều góc nhìn."},
 {name:"Ánh sáng",point:"03 / LIGHT",image:3,desc:"Thay đổi hướng sáng để làm rõ màu sắc và cấu trúc của một look."}
];
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){
 const [menu,setMenu]=useState(false);
 const [selected,setSelected]=useState(0);
 const [filter,setFilter]=useState("Tất cả");
 const [material,setMaterial]=useState(0);
 const [step,setStep]=useState(0);
 const [detailImage,setDetailImage]=useState(0);
 const [inquiryKind,setInquiryKind]=useState("Bộ sưu tập");
 const [inquiry,setInquiry]=useState("");
 const [pointer,setPointer]=useState({x:50,y:50});
 const media=site.images.map(path=>assetBase+path);
 const go=(path:string)=>basePath+(path==="/"?"":path);
 const chosen=looks[Math.max(0,(itemIndex-1)%looks.length)];
 const visibleLooks=looks.map((look,i)=>({look,index:i})).filter(({look})=>filter==="Tất cả"||look.kind===filter);
 useEffect(()=>{setMenu(false)},[section]);
 useEffect(()=>{if(!menu)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenu(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[menu]);
 useEffect(()=>{setDetailImage(0)},[itemIndex]);
 const storyMenu=<><div className={s.topIndex}><span>{site.brand.toUpperCase()} / 2026</span><span>INDEPENDENT FASHION CONCEPT — DEMO</span></div><header className={s.header}>
   <Link className={s.logo} href={go("/")}>{site.brand.split(" ")[0]} <em>{site.brand.split(" ").slice(1).join(" ")}</em><span className={s.logoDot}>.</span></Link>
   <nav aria-label="Điều hướng chính">{navItems.map(([text,path])=><Link href={go(path)} key={path}>{text}</Link>)}</nav>
   <Link className={s.headAction} href={go("/work")}>COLLECTION 01 <span aria-hidden="true"></span></Link>
   <button className={s.hamburger} aria-expanded={menu} onClick={()=>setMenu(v=>!v)} aria-label={menu?"Đóng điều hướng":"Mở điều hướng"} type="button"><i/><i/><i/></button>
  </header>
  {menu&&<button className={s.menuScrim} type="button" aria-label="Đóng điều hướng" onClick={()=>setMenu(false)}/>}
  <aside className={s.menuPanel} inert={!menu} aria-hidden={!menu}><div className={s.menuTitle}>THE MENU / {site.brand}</div>{navItems.map(([text,path],i)=><Link href={go(path)} onClick={()=>setMenu(false)} key={path}><small>0{i+1}</small>{text}<span aria-hidden="true"></span></Link>)}<button onClick={()=>setMenu(false)} type="button">ĐÓNG MENU ×</button></aside></>;
 const card=(look:typeof looks[number],index:number)=> <Link className={s.lookCard} href={go("/work/"+(index+1))} key={look.id}>
  <div className={s.lookFrame}><img src={media[look.image]} loading="lazy" alt={"Ảnh minh họa phong cách "+look.name}/><span>{look.id} / {look.kind}</span><div className={s.lookFrameLink} aria-hidden="true">XEM LOOK </div></div>
  <div className={s.lookMeta}><h3>{look.name}</h3><p>{look.desc}</p></div>
 </Link>;
 return <div className={s.root} id="fashion-archive-top">
  {storyMenu}
  <main>
   {section==="home"&&<>
    <FashionHero3D modelBase={assetBase+"/models"} collectionUrl={go("/work")}/>
    <section className={s.collectionSection} id="fashion-collection">
     <div className={s.sectionIntro}><span>01 / THE EDITION</span><h2>THREE LOOKS.<br/><em>THREE WAYS TO SEE.</em></h2><p>Ba hướng thể hiện phom dáng, màu sắc và ánh sáng. Đây là các mẫu minh họa cho trải nghiệm website, không phải sản phẩm đang bán.</p></div>
     <div className={s.collectionGrid}>{looks.map((look,i)=>card(look,i))}</div>
     <div className={s.collectionBottom}><span>THE ARCHIVE / 001—003</span><Link href={go("/work")}>XEM TOÀN BỘ COLLECTION <span aria-hidden="true"></span></Link></div>
    </section>
    <section className={s.materialSection} aria-label="Khám phá chất liệu và phom dáng">
     <div className={s.materialHeading}><span>02 / THE OBSERVATION</span><h2>LOOK CLOSER<span>.</span></h2><p>Chọn một hướng quan sát để thay đổi hình ảnh và cách đọc chi tiết.</p></div>
     <div className={s.materialWorkbench}>
      <div className={s.materialControls} role="group" aria-label="Chọn khía cạnh cần quan sát">{materials.map((item,i)=><button key={item.name} type="button" aria-pressed={material===i} onClick={()=>setMaterial(i)}><small>{item.point}</small><strong>{item.name}</strong><span aria-hidden="true"></span></button>)}</div>
      <div className={s.materialWindow} onPointerMove={e=>{if(e.pointerType==="mouse"){const box=e.currentTarget.getBoundingClientRect();setPointer({x:Math.round((e.clientX-box.left)/box.width*100),y:Math.round((e.clientY-box.top)/box.height*100)})}}} onPointerLeave={()=>setPointer({x:50,y:50})} style={{"--pointer-x":pointer.x+"%","--pointer-y":pointer.y+"%"} as React.CSSProperties}>
       <img src={media[materials[material].image]} alt={"Ảnh minh họa quan sát "+materials[material].name} loading="lazy"/>
       <div className={s.materialHighlight} aria-hidden="true"/>
       <div className={s.materialLabel}><span>{materials[material].point}</span><h3>{materials[material].name}</h3><p>{materials[material].desc}</p></div>
      </div>
     </div>
    </section>
    <section className={s.atelierTeaser}>
     <div className={s.atelierTeaserImage}><img src={media[0]} alt="Giá treo quần áo và những chất liệu thời trang, ảnh minh họa" loading="lazy"/><span>BEHIND THE FORM / 2026</span></div>
     <div className={s.atelierTeaserText}><small>03 / THE MAKING</small><h2>EVERY FORM<br/><em>BEGINS SOMEWHERE.</em></h2><p>Phom dáng, chất liệu và cách trình bày được phát triển qua từng bước. Xem một quy trình thiết kế mẫu dễ hiểu.</p><Link href={go("/services")}>ĐẾN ATELIER <span aria-hidden="true"></span></Link></div>
    </section>
    <section className={s.finalCampaign}><div className={s.finalCampaignVisual}><img src={media[2]} loading="lazy" alt="Hình ảnh campaign thời trang minh họa"/></div><div className={s.finalCampaignCopy}><small>04 / AFTER THE LIGHT</small><h2>LET THE<br/><em>LOOK SPEAK.</em></h2><p>Khám phá bộ sưu tập theo phom dáng, chi tiết và cách phối đồ.</p><Link href={go("/work")}>KHÁM PHÁ COLLECTION <span aria-hidden="true"></span></Link></div><div className={s.finalCampaignLine} aria-hidden="true"/></section>
   </>}
   {section==="work"&&<section className={s.archivePage}>
    <div className={s.subpageCover}><small>THE ARCHIVE / COLLECTION 01</small><h1>WEAR THE<br/><em>DIFFERENCE.</em></h1><div><p>Ba nghiên cứu hình ảnh về phong cách cá nhân. Hình ảnh dùng cho website mẫu; không phải hàng hóa đang mở bán.</p><span>01—03 / LOOK FILES</span></div></div>
    <div className={s.filters} role="group" aria-label="Lọc các look">{[["Tất cả","Tất cả"],["Phom dáng","SILHOUETTE"],["Màu sắc","COLOUR"],["Campaign","CAMPAIGN"]].map(([label,value])=><button key={value} type="button" aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}<span aria-hidden="true"></span></button>)}</div>
    <div className={s.collectionGrid}>{visibleLooks.map(({look,index})=>card(look,index))}</div>
    <div className={s.collectionBottom}>CÁC HÌNH ẢNH CHỈ PHỤC VỤ MỤC ĐÍCH MINH HỌA.</div>
   </section>}
   {section==="detail"&&<article className={s.detailPage}>
    <Link className={s.backLink} href={go("/work")}>← TRỞ LẠI COLLECTION</Link><div className={s.detailLayout}>
     <div className={s.detailPhotos}><div className={s.detailMain}><img src={media[(chosen.image+detailImage)%media.length]} alt={"Góc nhìn "+(detailImage+1)+" của "+chosen.name}/><span>LOOK {chosen.id} / VISUAL STUDY</span></div><div className={s.detailThumbs} role="group" aria-label="Thay đổi ảnh sản phẩm">{[0,1,2].map(i=><button type="button" key={i} aria-pressed={detailImage===i} onClick={()=>setDetailImage(i)}><img src={media[(chosen.image+i)%media.length]} alt={"Ảnh "+(i+1)}/></button>)}</div></div>
     <div className={s.detailCopy}><span>LOOK {chosen.id} / {chosen.kind}</span><h1>{chosen.title}</h1><h2>{chosen.name}</h2><p>{chosen.desc}</p><div className={s.detailNotes}><div><small>ĐIỂM NHẤN</small><p>{chosen.feature}</p></div><div><small>TRẠNG THÁI</small><p>Hình ảnh minh họa cho mẫu website; chưa có sản phẩm bán hoặc dữ liệu tồn kho.</p></div></div><Link href={go("/contact")}>LIÊN HỆ VỀ LOOK NÀY <span aria-hidden="true"></span></Link></div>
    </div>
   </article>}
   {section==="services"&&<section className={s.atelierPage}>
    <div className={s.subpageCover}><small>ATELIER / THE PROCESS</small><h1>BEHIND<br/><em>THE FORM.</em></h1><div><p>Từ phác thảo đến hình ảnh cuối cùng. Ba bước minh họa cách xây dựng một bộ sưu tập thời trang.</p><span>PROCESS / 01—03</span></div></div>
    <div className={s.atelierProcess}><div className={s.processSteps} role="group" aria-label="Chọn bước quy trình">{atelierSteps.map((item,i)=><button key={item.name} type="button" onClick={()=>setStep(i)} aria-pressed={step===i}><span>{item.label}</span><strong>{item.name}</strong><span aria-hidden="true"></span></button>)}</div><div className={s.processVisual}><img src={media[[0,1,3][step]]} alt={"Hình ảnh minh họa "+atelierSteps[step].name}/><div><small>{atelierSteps[step].label}</small><h2>{atelierSteps[step].name}</h2><p>{atelierSteps[step].desc}</p><strong>ĐẦU RA THAM KHẢO</strong><p>{atelierSteps[step].output}</p></div></div></div>
    <div className={s.atelierStatement}><strong>PHOM DÁNG LÀ ĐIỂM BẮT ĐẦU.</strong><p>Người xem cần thấy được cách một ý tưởng trở thành sản phẩm rõ ràng, không chỉ một bộ ảnh đẹp.</p></div>
   </section>}
   {section==="about"&&<section className={s.aboutPage}>
    <div className={s.subpageCover}><small>ATELIER ARCHIVE / THE STORY</small><h1>AN ARCHIVE<br/><em>OF FORM.</em></h1><div><p>Không gian khám phá hình ảnh, ánh sáng và cách trình bày trang phục.</p><span>ABOUT / THE CONCEPT</span></div></div>
    <div className={s.aboutGrid}><div><small>WHAT THIS IS</small><h2>ÁNH SÁNG LÀ CÁCH CHÚNG TÔI KỂ CHUYỆN.</h2><p>Atelier Archive là thương hiệu khái niệm trong thư viện Athena Studio. Mọi hình ảnh, collection và look ở đây được sử dụng để minh họa một website thời trang giàu tương tác.</p><p>Không có tuyên bố về khách hàng thật, sản phẩm đã sản xuất hay doanh thu bán hàng. Khi triển khai cho thương hiệu thực tế, hình ảnh và nội dung sẽ được thay bằng dữ liệu có quyền sử dụng.</p><Link href={go("/contact")}>TRAO ĐỔI VỀ THƯƠNG HIỆU <span aria-hidden="true"></span></Link></div><figure><img src={media[0]} alt="Quần áo trên giá treo, hình ảnh tham khảo"/><figcaption>THE ARCHIVE / VISUAL REFERENCE</figcaption></figure></div>
   </section>}
   {section==="contact"&&<section className={s.contactPage}>
    <div className={s.contactLead}><small>{site.brand.toUpperCase()} / CONTACT</small><h1>LET'S MAKE<br/><em>IT VISIBLE.</em></h1><p>Chọn nội dung cần trao đổi. Website sẽ soạn thư nháp trên thiết bị của bạn, không gửi dữ liệu lên máy chủ.</p><div className={s.contactPicture}><img src={media[3]} alt="Ảnh thời trang minh họa"/></div></div>
    <form onSubmit={e=>{e.preventDefault();window.location.href="mailto:?subject="+encodeURIComponent(site.brand+" / "+inquiryKind)+"&body="+encodeURIComponent(inquiry+"\n\nWebsite demo: bạn tự chọn địa chỉ nhận thư trước khi gửi.")}}>
     <label className={s.fieldLabel}>01 / BẠN MUỐN TRAO ĐỔI VỀ</label>
     <div className={s.contactOptions} role="radiogroup" aria-label="Chủ đề trao đổi">{["Bộ sưu tập","Hợp tác hình ảnh","Thiết kế website"].map((value,i)=><label key={value} className={s.contactOption}><input type="radio" name="fashion-topic" value={value} checked={inquiryKind===value} onChange={()=>setInquiryKind(value)}/><span>0{i+1}</span><strong>{value}</strong><b aria-hidden="true"></b></label>)}</div>
     <label className={s.fieldLabel} htmlFor="fashion-inquiry">02 / NỘI DUNG</label><textarea id="fashion-inquiry" required minLength={10} maxLength={2400} placeholder="Ví dụ: Tôi cần website giới thiệu bộ sưu tập, lookbook và trang liên hệ..." value={inquiry} onChange={e=>setInquiry(e.target.value)}/>
     <button type="submit" className={s.submitInquiry}>SOẠN THƯ TRAO ĐỔI <span aria-hidden="true"></span></button>
     <p className={s.contactPrivacy}>Đây là website mẫu. Không có hộp thư nhận yêu cầu hoặc hệ thống gửi tin nhắn thực tế.</p>
    </form>
   </section>}
  </main>
  <footer className={s.footer}><div className={s.footerHeading}><span>{site.brand}</span><Link href={go("/")}>VỀ ĐẦU TRANG ↑</Link></div><div className={s.footerSignature}>FORM<span>.</span><br/><em>IN LIGHT</em></div><div className={s.footerBottom}><span>© 2026 / INDEPENDENT FASHION CONCEPT / ATHENA STUDIO</span><nav aria-label="Điều hướng cuối trang">{navItems.map(([label,url])=><Link key={url} href={go(url)}>{label}</Link>)}</nav></div></footer>
 </div>;
}
