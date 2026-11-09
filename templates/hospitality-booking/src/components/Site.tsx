"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import site from "../data/site.json";
import s from "./hospitality-sovereign.module.css";

type Section="home"|"work"|"services"|"about"|"contact"|"booking"|"detail";
type Props={section?:Section;itemIndex?:number;basePath?:string;assetBase?:string};
type Dish={id:number;category:string;name:string;english:string;note:string;price:string;image:number};
const nav:[string,string][]=[["Thực đơn","/work"],["Gian bếp","/services"],["Câu chuyện","/about"],["Liên hệ","/contact"]];
const categories=["Tất cả","Khai vị","Món chính","Món chay","Tráng miệng","Đồ uống"];
const dishes:Dish[]=[
 {id:1,category:"Món chính",name:"Thịt nướng thảo mộc",english:"THE HERB TABLE",note:"Món nướng dùng cùng rau xanh, gia vị thơm và phần sốt chấm cân bằng.",price:"225.000đ",image:2},
 {id:2,category:"Món chính",name:"Đĩa mùa của bếp",english:"FROM THE SEASON",note:"Một cách kết hợp rau củ, phần đạm và hương vị được lựa chọn theo mùa.",price:"195.000đ",image:3},
 {id:3,category:"Món chính",name:"Bữa tối thong thả",english:"THE EVENING PLATE",note:"Đĩa ăn ấm, vị tròn, dành cho những cuộc trò chuyện dài.",price:"245.000đ",image:4},
 {id:4,category:"Khai vị",name:"Rau vườn và sốt nhẹ",english:"GARDEN OPENING",note:"Rau tươi, vị chua dịu và lớp giòn nhẹ.",price:"95.000đ",image:3},
 {id:5,category:"Khai vị",name:"Bánh giòn của ngày",english:"A LITTLE BEGINNING",note:"Miếng nhỏ mở đầu bữa ăn, ăn cùng phần sốt theo mùa.",price:"89.000đ",image:4},
 {id:6,category:"Món chay",name:"Đĩa rau củ áp chảo",english:"THE QUIET GARDEN",note:"Nguyên liệu thực vật, thảo mộc và hương thơm dịu.",price:"155.000đ",image:3},
 {id:7,category:"Tráng miệng",name:"Vị ngọt cuối bữa",english:"A SOFT ENDING",note:"Một phần ngọt nhẹ, thay đổi theo cảm hứng của bếp.",price:"75.000đ",image:4},
 {id:8,category:"Đồ uống",name:"Trà chiều dịu mát",english:"SLOW AFTERNOON",note:"Một ly trà không cồn dành cho nhịp thưởng thức chậm.",price:"65.000đ",image:4}
];
const stories=[
 {title:"Một bàn ăn đủ gần.",description:"Không cần dịp đặc biệt. Chỉ cần mọi người có thời gian ở bên nhau.",label:"01 / BÀN ĂN",image:0},
 {title:"Vị mùa trên từng đĩa.",description:"Một góc nhìn về nguyên liệu, hương vị và cách làm có chủ đích.",label:"02 / GIAN BẾP",image:2},
 {title:"Ở lại thêm một chút.",description:"Ánh sáng vừa phải, chỗ ngồi dễ chịu và một cuộc trò chuyện chưa vội kết thúc.",label:"03 / BUỔI TỐI",image:1}
];
const timeChoices=["17:30","18:00","18:30","19:00","19:30","20:00"];
const faqs=[
 ["Bàn đã được xác nhận khi gửi biểu mẫu chưa?","Chưa. Đây là template trình diễn, không có hệ thống giữ bàn hoặc kiểm tra chỗ trống. Mọi lựa chọn chỉ tạo một bản nháp tại trình duyệt."],
 ["Tôi có thể yêu cầu bàn cho dịp đặc biệt không?","Có. Mục ghi chú cho phép mô phỏng yêu cầu sinh nhật, họp mặt hoặc ăn chay. Nhà hàng thực tế sẽ cần xác nhận riêng khi triển khai."],
 ["Giá trên thực đơn đã chính thức chưa?","Chưa. Các tên món, mức giá và hình ảnh là dữ liệu minh họa thiết kế, không phải thực đơn bán hàng thật."]
];
function getToday(){
 const d=new Date();const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);
 return local.toISOString().slice(0,10);
}
export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:Props){
 const [menuOpen,setMenuOpen]=useState(false);
 const [story,setStory]=useState(0);
 const [category,setCategory]=useState("Tất cả");
 const [dishId,setDishId]=useState(1);
 const [date,setDate]=useState("");
 const [minDate,setMinDate]=useState("");
 const [guests,setGuests]=useState(2);
 const [time,setTime]=useState("19:00");
 const [guestName,setGuestName]=useState("");
 const [guestEmail,setGuestEmail]=useState("");
 const [occasion,setOccasion]=useState("Bữa tối");
 const [request,setRequest]=useState("");
 const [bookingDraft,setBookingDraft]=useState(false);
 const [bookingNotice,setBookingNotice]=useState("");
 const [contactName,setContactName]=useState("");
 const [contactMessage,setContactMessage]=useState("");
 const [contactNotice,setContactNotice]=useState("");
 const rootRef=useRef<HTMLDivElement>(null);
 const media=site.images.map(file=>assetBase+file);
 const go=(path:string)=>basePath+(path==="/"?"":path);
 const feature=stories[story];
 const chosen=dishes.find(d=>d.id===dishId)||dishes[0];
 const detail=dishes[Math.max(0,Math.min(2,itemIndex-1))];
 const visible=dishes.filter(d=>category==="Tất cả"||d.category===category);
 useEffect(()=>{setMenuOpen(false)},[section]);
 useEffect(()=>{const local=getToday();setDate(v=>v||local);setMinDate(local)},[]);
 useEffect(()=>{
  if(!menuOpen)return;
  const handle=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenuOpen(false)};
  window.addEventListener("keydown",handle);
  return()=>window.removeEventListener("keydown",handle);
 },[menuOpen]);
 useEffect(()=>{
  const root=rootRef.current;
  if(!root||!window.IntersectionObserver||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const targets=[...root.querySelectorAll<HTMLElement>("[data-reveal]")];
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){(entry.target as HTMLElement).dataset.revealed="true";observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:"0px 0px -45px 0px"});
  targets.forEach(el=>{
   if(el.getBoundingClientRect().top<window.innerHeight*.91)el.dataset.revealed="true";
   else{el.dataset.revealPending="true";observer.observe(el);}
  });
  return()=>observer.disconnect();
 },[section]);
 function makeBooking(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(!date||date<minDate||!guestName.trim()||!guestEmail.trim()){setBookingNotice("Vui lòng điền đủ các trường hợp lệ.");return;}
  setBookingDraft(true);setBookingNotice("Đã tạo bản nháp trên thiết bị. Chưa gửi yêu cầu hoặc giữ bàn.");
 }
 const bookingText="BẾP & CHUYỆN — YÊU CẦU ĐẶT BÀN (BẢN NHÁP)\nNgày: "+date+"\nGiờ mong muốn: "+time+"\nSố khách: "+guests+"\nDịp: "+occasion+"\nTên: "+guestName.trim()+"\nEmail: "+guestEmail.trim()+"\nGhi chú: "+(request.trim()||"Không có")+"\n\nBản demo, chưa xác nhận tình trạng bàn.";
 async function copyBooking(){
  try{await navigator.clipboard.writeText(bookingText);setBookingNotice("Đã sao chép bản nháp. Vẫn chưa gửi yêu cầu đặt bàn.");}
  catch{setBookingNotice("Không thể sao chép tự động trên thiết bị này. Bạn có thể chọn và sao chép phần tóm tắt.");}
 }
 function draftContact(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  const subject="Bếp & Chuyện / Trao đổi từ website mẫu";
  const body="Người gửi: "+contactName.trim()+"\n\n"+contactMessage.trim()+"\n\n(Được soạn từ template demo, không gửi dữ liệu lên máy chủ.)";
  window.location.href="mailto:?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
  setContactNotice("Đã yêu cầu mở ứng dụng email. Bạn cần tự nhập người nhận và gửi.");
 }
 return <div className={s.root} id="hospitality-booking-top" ref={rootRef}>
  <header className={s.header}>
   <Link href={go("/")} className={s.logo} aria-label="Bếp & Chuyện — về trang chủ">{site.brand}</Link>
   <nav aria-label="Điều hướng nhà hàng">{nav.map(([label,path])=><Link key={path} href={go(path)}>{label}</Link>)}</nav>
   <Link className={s.actionHead} href={go("/booking")}>ĐẶT BÀN <span aria-hidden="true">›</span></Link>
   <button type="button" className={s.hamburger} aria-label={menuOpen?"Đóng menu":"Mở menu"} aria-controls="hospitality-mobile-menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}><i/><i/><i/></button>
  </header>
  {menuOpen&&<button className={s.menuScrim} type="button" aria-label="Đóng menu điều hướng" onClick={()=>setMenuOpen(false)}/>}
  <aside id="hospitality-mobile-menu" className={s.menuPanel} inert={!menuOpen} aria-hidden={!menuOpen}>
   <div className={s.menuTitle}>BẾP & CHUYỆN / ĐIỀU HƯỚNG</div>
   {[["Trang chủ","/"],...nav,["Đặt bàn","/booking"]].map(([label,path],i)=><Link key={path} href={go(path)} onClick={()=>setMenuOpen(false)}><small>0{i+1}</small>{label}<span aria-hidden="true">›</span></Link>)}
   <p>Hãy chọn một lối đi đến bữa ăn của bạn. Đây là website minh họa.</p>
   <button type="button" onClick={()=>setMenuOpen(false)}>ĐÓNG / MENU</button>
  </aside>
  <main id="hospitality-content">
   {section==="home"&&<>
    <section className={s.tableStage} data-dna04-artifact="hospitality-booking-tableStage">
     <div className={s.tableInvitation}>BẾP & CHUYỆN <span>—</span> MỘT BÀN ĂN, NHIỀU CÂU CHUYỆN</div>
     <figure className={s.heroFigure}>
      <img key={feature.image} src={media[feature.image]} alt={feature.title}/>
      <figcaption>{feature.label}</figcaption>
      <div className={s.photoControls} role="group" aria-label="Chọn câu chuyện hình ảnh">
       <button type="button" aria-label="Hình trước" onClick={()=>setStory(i=>(i+stories.length-1)%stories.length)}><svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H4m7-7-7 7 7 7"/></svg></button>
       <span>0{story+1} / 0{stories.length}</span>
       <button type="button" aria-label="Hình tiếp theo" onClick={()=>setStory(i=>(i+1)%stories.length)}><svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-7-7 7 7-7 7"/></svg></button>
      </div>
     </figure>
     <div className={s.heroWords}>
      <small>SEASONAL TABLE / AN ATHENA STUDIO CONCEPT</small>
      <h1>Ngồi lại. <em>Chuyện sẽ tới.</em></h1>
      <p>Một không gian vừa đủ yên, một bữa ăn vừa đủ ngon, và thật nhiều điều để kể cùng nhau.</p>
      <div className={s.heroActions}><Link href={go("/booking")}>CHỌN BÀN <span aria-hidden="true">›</span></Link><Link href={go("/work")}>KHÁM PHÁ THỰC ĐƠN →</Link></div>
      <span className={s.demoHint}>Không gian và thực đơn minh họa. Chưa nhận đặt chỗ thực tế.</span>
     </div>
    </section>
    <section className={s.storyRail} data-reveal>
     <div className={s.storyRailIntro}><small>THƯỞNG THỨC CHẬM / 01—03</small><h2>Mỗi bữa ăn có <em>một nhịp riêng.</em></h2><p>Chạm vào từng câu chuyện để thay đổi khung hình đầu trang.</p></div>
     <div className={s.storyChoices} role="group" aria-label="Lựa chọn câu chuyện">
      {stories.map((item,i)=><button type="button" key={item.label} aria-pressed={story===i} onClick={()=>{setStory(i);rootRef.current?.querySelector("main")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}><small>{item.label}</small><strong>{item.title}</strong><span>{item.description}</span><b aria-hidden="true">›</b></button>)}
     </div>
    </section>
    <section className={s.featuredMenu} data-reveal>
     <div className={s.featuredTitle}><div><small>THỰC ĐƠN THEO MÙA / SEASONAL NOTES</small><h2>Từ căn bếp <em>hôm nay.</em></h2></div><Link href={go("/work")}>XEM TOÀN BỘ THỰC ĐƠN ›</Link></div>
     <div className={s.featuredGrid}>{dishes.slice(0,3).map((d,i)=><Link href={go("/work/"+(i+1))} key={d.id} className={s.featuredDish}><img src={media[d.image]} alt={"Hình minh họa "+d.name}/><div><span>0{i+1} / {d.english}</span><h3>{d.name}</h3><p>{d.note}</p><strong>XEM MÓN <span aria-hidden="true">›</span></strong></div></Link>)}</div>
     <p className={s.demoFootnote}>Tên món, hình ảnh và giá là nội dung mô phỏng để trình diễn giao diện.</p>
    </section>
    <section className={s.homeInvitation} data-reveal><div><small>MỘT CHỖ NGỒI / A MOMENT TO STAY</small><h2>Chừa lại <em>một chiếc ghế</em> cho câu chuyện.</h2><p>Chọn ngày, khung giờ mong muốn và số người trong hành trình đặt bàn thử nghiệm.</p><Link href={go("/booking")}>KHÁM PHÁ ĐẶT BÀN ›</Link></div><img src={media[1]} alt="Không gian nhà hàng minh họa nhìn từ bàn ăn"/></section>
   </>}
   {section==="work"&&<section className={s.menuPage}>
    <div className={s.menuIntro} data-reveal><small>01 / THE MENU — MENU MINH HỌA</small><h1>Hương vị <em>để kể lại.</em></h1><p>Những lựa chọn lấy cảm hứng từ bàn ăn theo mùa. Chọn một nhóm món, chạm vào tên món để xem câu chuyện phía sau.</p></div>
    <div className={s.menuExperience}>
     <div className={s.menuListPanel} data-reveal>
      <div className={s.menuFilters} role="group" aria-label="Lọc danh mục thực đơn">{categories.map(c=><button type="button" key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);const next=dishes.find(d=>c==="Tất cả"||d.category===c);if(next)setDishId(next.id)}}>{c}</button>)}</div>
      <div className={s.menuEntries}>{visible.map(d=><button type="button" className={s.menuEntry} key={d.id} aria-pressed={chosen.id===d.id} onClick={()=>setDishId(d.id)}><span className={s.menuNumber}>{String(d.id).padStart(2,"0")}</span><span><small>{d.english} / {d.category.toUpperCase()}</small><strong>{d.name}</strong><span className={s.menuDescription}>{d.note}</span></span><span className={s.menuPrice}>{d.price}</span></button>)}</div>
      <p className={s.menuNotice}>Giá và mô tả chỉ mang tính minh họa, không phải thực đơn kinh doanh thật.</p>
     </div>
     <aside className={s.menuSpotlight} data-reveal><figure><img key={chosen.id} src={media[chosen.image]} alt={"Ảnh món ăn minh họa: "+chosen.name}/><figcaption>{chosen.english}</figcaption></figure><small>SELECTED / {String(chosen.id).padStart(2,"0")}</small><h2>{chosen.name}</h2><p>{chosen.note}</p><div><span>{chosen.price} / GIÁ MẪU</span>{chosen.id<=3&&<Link href={go("/work/"+chosen.id)}>CÂU CHUYỆN MÓN ›</Link>}</div></aside>
    </div>
    <div className={s.menuEnding}><span>THE LAST BITE IS NEVER THE LAST STORY</span><Link href={go("/booking")}>CHỌN BÀN CHO BỮA TỐI ›</Link></div>
   </section>}
   {section==="detail"&&<article className={s.dishDetail}>
    <Link className={s.backLink} href={go("/work")}>← TRỞ LẠI THỰC ĐƠN</Link>
    <div className={s.dishDetailGrid}><div><small>THE MENU / {String(detail.id).padStart(2,"0")}</small><h1>{detail.name}</h1><p>{detail.note}</p><p>Một bản diễn giải ẩm thực dành cho website mẫu Bếp & Chuyện. Tên món, hình ảnh và giá chỉ minh họa.</p><div className={s.dishDetailActions}><strong>{detail.price}</strong><Link href={go("/booking")}>CHỌN BÀN ›</Link></div></div><figure><img src={media[detail.image]} alt={"Ảnh minh họa "+detail.name}/><figcaption>{detail.english} / TASTE STUDY</figcaption></figure></div>
   </article>}
   {section==="services"&&<section className={s.kitchenPage}>
    <div className={s.kitchenOpening} data-reveal><div><small>02 / OUR KITCHEN</small><h1>Điều tinh tế <em>nằm ở cách làm.</em></h1><p>Một căn bếp không cần kể quá nhiều về mình. Từ nguyên liệu, nhịp chuẩn bị tới cách đặt món ăn lên bàn — mọi chi tiết đều góp phần tạo cảm giác.</p><Link href={go("/work")}>XEM THỰC ĐƠN ›</Link></div><img src={media[4]} alt="Không khí phục vụ món ăn tại bàn"/></div>
    <div className={s.kitchenSequence} data-reveal>{[["01","Chọn đúng mùa.","Ưu tiên sự phù hợp của nguyên liệu và vị giác."],["02","Làm có chủ đích.","Sự cân bằng đến từ những lựa chọn giản dị."],["03","Phục vụ có nhịp.","Món ăn được đặt trong một trải nghiệm đủ thư thả."]].map(([n,title,description])=><article key={n}><small>{n} / THE PROCESS</small><h2>{title}</h2><p>{description}</p></article>)}</div>
    <div className={s.kitchenEnd} data-reveal><img src={media[2]} alt="Món nướng và rau củ minh họa"/><div><small>AN INVITATION TO SLOW DOWN</small><h2>Không chỉ là một chiếc đĩa.</h2><p>Bữa ăn là lý do để mọi người ngồi gần nhau hơn.</p><Link href={go("/booking")}>TRẢI NGHIỆM ĐẶT BÀN ›</Link></div></div>
   </section>}
   {section==="about"&&<section className={s.aboutPage}>
    <div className={s.aboutCopy} data-reveal><small>03 / BẾP & CHUYỆN</small><h1>Chuyện ngon bắt đầu <em>khi ta ngồi lại.</em></h1><p>Bếp & Chuyện là một ý niệm về nhà hàng nơi bữa ăn được kể bằng ánh sáng ấm, chất liệu tự nhiên và những khoảng dừng đủ dài.</p><p>Không phải một chuỗi dịch vụ hay một thương hiệu nhà hàng đang vận hành. Đây là concept được phát triển để minh họa khả năng thiết kế trải nghiệm nhà hàng của Athena Studio.</p><Link href={go("/contact")}>KỂ CHUYỆN CÙNG CHÚNG TÔI ›</Link></div>
    <div className={s.aboutMedia} data-reveal><img src={media[0]} alt="Không gian nhà hàng minh họa với các bàn ăn"/><span>A PLACE FOR STORIES / CONCEPT 2026</span></div>
    <div className={s.aboutPrinciples} data-reveal>{[["01","Ấm vừa đủ."],["02","Chọn vừa kỹ."],["03","Ngồi vừa lâu."]].map(([n,x])=><div key={n}><small>{n}</small><strong>{x}</strong></div>)}</div>
   </section>}
   {section==="booking"&&<section className={s.bookingPage}>
    <div className={s.bookingIntro} data-reveal><small>RESERVATION / BẢN TRÌNH DIỄN</small><h1>Một chỗ ngồi, <em>một cuộc hẹn.</em></h1><p>Chọn buổi gặp mặt mà bạn muốn hình dung. Biểu mẫu này tạo bản nháp tại trình duyệt, không kiểm tra bàn trống và không xác nhận chỗ.</p></div>
    <div className={s.bookingLayout}>
     <form className={s.bookingForm} onSubmit={makeBooking}>
      <div className={s.formIntro}><span>01 / CHỌN BUỔI HẸN</span><p>Tất cả các khung giờ dưới đây chỉ để mô phỏng thao tác, không thể hiện tình trạng còn bàn.</p></div>
      <div className={s.dateGuests}><label>NGÀY MONG MUỐN<input type="date" aria-label="Ngày đặt bàn mong muốn" value={date} min={minDate||undefined} required onChange={e=>{setDate(e.target.value);setBookingDraft(false)}}/></label><fieldset className={s.guestCounter}><legend>SỐ KHÁCH</legend><div><button type="button" disabled={guests<=1} aria-label="Giảm số khách" onClick={()=>{setGuests(n=>Math.max(1,n-1));setBookingDraft(false)}}>−</button><output aria-live="polite">{String(guests).padStart(2,"0")}</output><button type="button" disabled={guests>=10} aria-label="Tăng số khách" onClick={()=>{setGuests(n=>Math.min(10,n+1));setBookingDraft(false)}}>+</button></div></fieldset></div>
      <fieldset className={s.timeField}><legend>GIỜ ĐẾN MONG MUỐN</legend><div role="group" aria-label="Chọn giờ đến">{timeChoices.map(slot=><button key={slot} type="button" aria-pressed={time===slot} onClick={()=>{setTime(slot);setBookingDraft(false)}}>{slot}</button>)}</div></fieldset>
      <label className={s.fieldRow}>DỊP GẶP MẶT<select value={occasion} onChange={e=>{setOccasion(e.target.value);setBookingDraft(false)}}><option>Bữa tối</option><option>Gặp mặt bạn bè</option><option>Sinh nhật</option><option>Dịp đặc biệt</option></select></label>
      <div className={s.formIntro}><span>02 / THÔNG TIN BẢN NHÁP</span><p>Thông tin không được lưu trên máy chủ Athena.</p></div>
      <div className={s.personalFields}><label>NGƯỜI ĐẠI DIỆN<input placeholder="Tên của bạn" required maxLength={90} value={guestName} onChange={e=>{setGuestName(e.target.value);setBookingDraft(false)}}/></label><label>EMAIL LIÊN HỆ<input type="email" required placeholder="you@example.com" value={guestEmail} onChange={e=>{setGuestEmail(e.target.value);setBookingDraft(false)}}/></label></div>
      <label className={s.fieldRow}>GHI CHÚ (KHÔNG BẮT BUỘC)<textarea rows={3} maxLength={500} value={request} onChange={e=>{setRequest(e.target.value);setBookingDraft(false)}} placeholder="Yêu cầu món chay, lời nhắn cho buổi gặp mặt..."/></label>
      <button className={s.bookingSubmit} type="submit">TẠO BẢN NHÁP YÊU CẦU <span aria-hidden="true">›</span></button>
      <p className={s.bookingWarning}>Đây không phải thao tác đặt bàn thật. Không có bàn nào được giữ hoặc yêu cầu được gửi đi.</p>
      <p className={s.bookingStatus} role="status" aria-live="polite">{bookingNotice}</p>
     </form>
     <aside className={s.bookingAside}><figure><img src={media[1]} alt="Không gian bàn ăn cho buổi tối minh họa"/><figcaption>A SEAT AT THE TABLE / CONCEPT VISUAL</figcaption></figure><div className={s.bookingReceipt}><small>YOUR EVENING / BẢN XEM TRƯỚC</small><h2>Chi tiết cuộc hẹn.</h2><dl><div><dt>Ngày</dt><dd>{date||"Chưa chọn"}</dd></div><div><dt>Giờ mong muốn</dt><dd>{time}</dd></div><div><dt>Số khách</dt><dd>{guests} người</dd></div><div><dt>Dịp</dt><dd>{occasion}</dd></div></dl>{bookingDraft&&<div className={s.draftResult}><strong>ĐÃ TẠO BẢN NHÁP — CHƯA XÁC NHẬN</strong><p>Chưa có kết nối nhà hàng và không có xác nhận chỗ trống.</p><button type="button" onClick={copyBooking}>SAO CHÉP NỘI DUNG ›</button><textarea readOnly rows={6} value={bookingText} aria-label="Nội dung bản nháp yêu cầu đặt bàn"/></div>}</div></aside>
    </div>
   </section>}
   {section==="contact"&&<section className={s.contactPage}>
    <div className={s.contactIntro} data-reveal><small>04 / SAY HELLO</small><h1>Một câu hỏi cũng <em>mở đầu câu chuyện.</em></h1><p>Trao đổi về thực đơn, không gian hoặc một dịp đặc biệt. Mẫu liên hệ này chỉ tạo email nháp, không gửi hoặc lưu dữ liệu.</p><div className={s.contactFacts}><div><small>ĐỊA CHỈ</small><strong>Địa điểm minh họa, chưa công bố cơ sở thực tế.</strong></div><div><small>ĐẶT BÀN</small><Link href={go("/booking")}>THỬ QUY TRÌNH ĐẶT BÀN ›</Link></div></div></div>
    <form className={s.contactForm} onSubmit={draftContact}><span>YOUR NOTE / LỜI NHẮN</span><label>HỌ VÀ TÊN<input required maxLength={90} placeholder="Bạn muốn được gọi là gì?" value={contactName} onChange={e=>setContactName(e.target.value)}/></label><label>LỜI NHẮN<textarea minLength={10} maxLength={3000} rows={6} required placeholder="Hãy để lại điều bạn đang quan tâm..." value={contactMessage} onChange={e=>setContactMessage(e.target.value)}/></label><button type="submit">MỞ BẢN NHÁP EMAIL ›</button><p role="status" aria-live="polite">{contactNotice||"Bạn cần nhập địa chỉ người nhận trong ứng dụng email để gửi."}</p></form>
    <div className={s.faqSection} data-reveal><div><small>NHỮNG ĐIỀU CẦN BIẾT / FAQ</small><h2>Trước khi ghé bàn.</h2></div><div>{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div>
   </section>}
  </main>
  <footer className={s.footer}>
   <div className={s.footerColumns}><div><small>COME FOR THE FOOD. STAY FOR THE STORY.</small><p>Một chiếc bàn dành cho những cuộc trò chuyện.</p><Link className={s.footerBooking} href={go("/booking")}>CHỌN BUỔI HẸN ›</Link></div><div><small>KHÁM PHÁ</small><nav className={s.footerMenu} aria-label="Điều hướng cuối trang">{[["Trang chủ","/"],...nav,["Đặt bàn","/booking"]].map(([label,path])=><Link href={go(path)} key={path}>{label}</Link>)}</nav></div></div>
   <div className={s.footerSignature}>{site.brand}<span>.</span></div>
   <div className={s.footerBottom}><small>© 2026 / ATHENA STUDIO CONCEPT</small><small>WEBSITE MẪU — KHÔNG NHẬN ĐẶT BÀN THẬT</small><Link href={go("/")}>VỀ ĐẦU TRANG ↑</Link></div>
  </footer>
 </div>;
}
