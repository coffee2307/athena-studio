"use client";
import Image from "next/image";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";

export type ExperienceSection="work"|"detail"|"services";
type Sector="retail"|"dining"|"journal"|"live"|"realty"|"industry"|"platform"|"atelier"|"automotive";
type Props={slug:string;section:ExperienceSection;itemIndex?:number;world:DemoCopy;extra:WorldDetail;addToCart:(quantity?:number)=>void};
const sectorNames:Record<Sector,string>={
 retail:"CURATED COLLECTION",dining:"FROM OUR KITCHEN",journal:"THE READING ROOM",live:"LIVE / CULTURE",
 realty:"SELECTED SPACES",industry:"OUR CAPABILITIES",platform:"PRODUCT EXPERIENCE",atelier:"SELECTED PRACTICE",automotive:"DESIGN STUDY / BLACK VELOCITY"
};
const sectors:Record<string,Sector>={
 "commerce-standard":"retail","fashion-archive":"retail","pet-store":"retail",
 "hospitality-booking":"dining","editorial-journal":"journal",
 "campaign-landing":"live","live-concert":"live","music-label":"live",
 "auto-showroom":"automotive","property-showcase":"realty",
 "modern-corporate":"industry","finance-trust":"industry","engineering-industry":"industry","construction-firm":"industry",
 "saas-product":"platform","team-intranet":"platform","education-platform":"platform",
 "creative-studio":"atelier","architecture-studio":"atelier","wellness-clinic":"atelier"
};
export function isExperienceSection(section:string){return section==="work"||section==="detail"||section==="services";}
function Photo({slug,n,alt,priority=false}:{slug:string;n:number;alt:string;priority?:boolean}){
 return <Image src={slug==="auto-showroom"?`/template-demos/auto-showroom/image-${Math.max(1,Math.min(n,5))}.jpg`:`/template-demos/${slug}/image-${Math.max(1,Math.min(n,5))}.jpg`} alt={alt} fill priority={priority} sizes="(max-width: 720px) 95vw, (max-width: 1100px) 65vw, 48vw"/>;
}
function Angle(){return <span aria-hidden="true">↗</span>;}
function MockNotice(){return <p className="experience-notice">Trải nghiệm trình diễn của Athena Studio. Không có giao dịch, đặt chỗ hoặc tư vấn thực tế.</p>}
function Crumb({root,label}:{root:string;label:string}){return <nav className="experience-crumb" aria-label="Đường dẫn trang"><Link href={root}>Trang chủ</Link><span>/</span><span>{label}</span></nav>;}
function Cta({root,world,extra}:{root:string;world:DemoCopy;extra:WorldDetail}){
 return <section className="experience-close"><div><span>THE NEXT CHAPTER / {world.brand}</span><h2>{extra.contactTitle}</h2><p>{extra.contactIntro}</p></div><Link href={root+"/contact"}>Bắt đầu trao đổi <Angle/></Link></section>;
}
export function WorldExperiencePages({slug,section,itemIndex=1,world,extra,addToCart}:Props){
 const root="/template-demos/"+slug;
 const sector=sectors[slug]??"atelier";
 const [category,setCategory]=useState("Tất cả");
 const [sort,setSort]=useState("original");
 const [active,setActive]=useState(0);
 const [query,setQuery]=useState("");
 const [qty,setQty]=useState(1);
 const isShop=world.action==="shop";
 const filtered=useMemo(()=>{
  const matches=world.cards.map((card,index)=>({...card,index})).filter(card=>{
   const categoryMatch=category==="Tất cả"||((card.index===0||card.index===2)?world.categories[1]:world.categories[2])===category;
   return categoryMatch&&(`${card.title} ${card.text} ${card.label}`).toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"));
  });
  if(sort==="reverse")matches.reverse();
  if(sort==="alphabetical")matches.sort((a,b)=>a.title.localeCompare(b.title,"vi"));
  return matches;
 },[category,query,sort,world]);
 const cards=world.cards;
 const chosen=cards[itemIndex-1]??cards[0];
 const workLink=(index:number)=>root+"/work/"+(index+1);
 const thumb=(index:number)=> <div className="experience-image"><Photo slug={slug} n={index%5+2} alt={cards[index].title}/><span className="experience-image-arrow"><Angle/></span></div>;
 const catalogCard=(card:typeof filtered[number])=><article className="experience-catalog-card" key={card.index}>
  <Link href={workLink(card.index)} className="experience-card-picture">{thumb(card.index)}<span className="experience-card-index">0{card.index+1} / 03</span></Link>
  <div className="experience-card-meta"><small>{card.label}</small><Link href={workLink(card.index)}><h3>{card.title}</h3></Link><p>{card.text}</p>
  {isShop?<button type="button" onClick={()=>addToCart()}>Thêm vào giỏ <Angle/></button>:<Link href={workLink(card.index)} className="experience-card-more">Xem chi tiết <Angle/></Link>}
  </div>
 </article>;
 const controls=(searchable=true)=><div className="experience-controls">
  <div className="experience-chips" aria-label="Lọc danh mục">{world.categories.map(c=><button key={c} type="button" aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <div className="experience-tools">{searchable&&<label><span className="sr-only">Tìm nội dung</span><input aria-label="Tìm nội dung" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm trong bộ sưu tập..."/></label>}
  <label className="experience-sort"><span className="sr-only">Sắp xếp</span><select aria-label="Sắp xếp nội dung" value={sort} onChange={e=>setSort(e.target.value)}><option value="original">Thứ tự giới thiệu</option><option value="alphabetical">Tên A–Z</option><option value="reverse">Thứ tự ngược lại</option></select></label></div>
 </div>;
 const work=()=>{
  if(sector==="retail")return <main className="experience-sub experience-retail" data-sector={sector} id="world-main">
   <section className="experience-retail-hero"><div><Crumb root={root} label={extra.navWork}/><span className="experience-kicker">CATALOG 01 / {world.brand}</span><h1>{slug==="pet-store"?"Bé thích gì hôm nay?":slug==="fashion-archive"?"ARCHIVE / 001":"Thiết kế để sống cùng."}</h1><p>{world.intro}</p><div className="experience-hero-small">03 SELECTED OBJECTS <span>—</span> DISCOVER MORE ↓</div></div><div className="experience-retail-photo"><Photo slug={slug} n={1} alt={world.brand+" tuyển chọn"} priority/></div></section>
   <section className="experience-products"><div className="experience-section-head"><p>{sectorNames[sector]} / 2026</p><h2>{extra.worksLabel}</h2></div>{controls()}<div className="experience-product-grid">{filtered.map(catalogCard)}</div>{filtered.length===0&&<p className="experience-empty">Không tìm thấy sản phẩm phù hợp. Hãy thử bộ lọc khác.</p>}</section>
   <section className="experience-retail-statement"><span>WHY THIS COLLECTION</span><h2>{extra.slogan}</h2><Link href={root+"/about"}>Khám phá câu chuyện thương hiệu <Angle/></Link></section><Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="dining")return <main className="experience-sub experience-dining" data-sector={sector} id="world-main">
   <section className="experience-dining-intro"><Crumb root={root} label="Thực đơn"/><span className="experience-kicker">THE SEASONAL TABLE</span><h1>Món ngon<br/><em>cho bữa hôm nay.</em></h1><p>{world.intro}</p><Link href={root+"/contact"}>Đặt bàn thử nghiệm <Angle/></Link></section>
   <section className="experience-dining-menu"><div><span className="experience-kicker">TỪ CĂN BẾP</span><h2>Thực đơn theo mùa.</h2><p>{extra.approach}</p>{controls(false)}</div><div className="experience-dish-list">{filtered.map(card=><Link key={card.index} href={workLink(card.index)} className="experience-dish"><div className="experience-dish-photo"><Photo slug={slug} n={card.index+2} alt={card.title}/></div><div><small>{card.label}</small><h3>{card.title}</h3><p>{card.text}</p></div><Angle/></Link>)}{filtered.length===0&&<p>Không có món ở danh mục này.</p>}</div></section><div className="experience-dining-banner"><Photo slug={slug} n={5} alt="Không gian dùng bữa"/><div><span>MADE WITH CARE</span><h2>Chậm rãi, ngon lành, đủ đầy.</h2></div></div><Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="journal")return <main className="experience-sub experience-journal" data-sector={sector} id="world-main">
   <section className="experience-journal-top"><Crumb root={root} label={extra.navWork}/><span>FIELDNOTES / ISSUE 08</span><h1>THE READING<br/><em>ROOM.</em></h1><p>{world.intro}</p></section>
   <section className="experience-journal-edition"><div><span>THE FEATURE / 01</span><h2>{cards[0].title}</h2><p>{cards[0].text}</p><Link href={workLink(0)}>ĐỌC BÀI VIẾT <Angle/></Link></div><div className="experience-journal-image"><Photo slug={slug} n={2} alt={cards[0].title}/></div></section>
   <section className="experience-journal-list"><div className="experience-section-head"><p>ISSUE 08 / INDEX</p><h2>Chọn một câu chuyện.</h2></div>{controls()}<div>{filtered.map(card=><Link key={card.index} href={workLink(card.index)} className="experience-article-row"><span>0{card.index+1}</span><div><small>{card.label}</small><h3>{card.title}</h3><p>{card.text}</p></div><div className="experience-article-photo"><Photo slug={slug} n={card.index+2} alt={card.title}/></div><Angle/></Link>)}</div></section><Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="live")return <main className="experience-sub experience-live" data-sector={sector} id="world-main">
   <section className="experience-live-head"><Crumb root={root} label={extra.navWork}/><span className="experience-kicker">{world.brand} / PROGRAM</span><h1>{slug==="music-label"?"THE SOUND FILES":slug==="campaign-landing"?"THE PROGRAM":"THE LINE-UP"}</h1><p>{world.intro}</p><Link href={root+"/contact"}>{slug==="music-label"?"Liên hệ nhãn đĩa":"Đăng ký quan tâm"} <Angle/></Link></section>
   <div className="experience-live-ticker">LIVE / CULTURE / PEOPLE / MUSIC / CREATIVE FUTURES / LIVE / CULTURE / PEOPLE</div>
   <section className="experience-live-program"><div className="experience-section-head"><p>{extra.worksLabel}</p><h2>Explore every moment.</h2></div>{controls(false)}{filtered.map(card=><Link href={workLink(card.index)} key={card.index} className="experience-lineup-row"><span>0{card.index+1}</span><div><small>{card.label}</small><h3>{card.title}</h3><p>{card.text}</p></div><div className="experience-lineup-photo"><Photo slug={slug} n={card.index+2} alt={card.title}/></div><Angle/></Link>)}</section><Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="automotive")return <main className="experience-sub experience-automotive" data-sector={sector} id="world-main">
   <section className="bv-catalog-head">
    <Crumb root={root} label={extra.navWork}/>
    <span className="experience-kicker">BLACK VELOCITY / SELECTED STUDIES</span>
    <h1>THE MACHINE.<br/><em>THREE PERSPECTIVES.</em></h1>
    <p>Không phải ba mẫu xe khác nhau: đây là ba cách quan sát cùng một chiếc McLaren concept trong không gian trải nghiệm VELAR. Những ảnh phụ trợ chỉ minh họa phong cách thiết kế.</p>
    <Link href={root+"/experience"}>OPEN THE 3D EXPERIENCE <Angle/></Link>
   </section>
   <section className="bv-catalog-grid" aria-label="Ba chương nghiên cứu thiết kế">
    {filtered.map(card=><Link href={workLink(card.index)} key={card.title} className={"bv-catalog-item bv-catalog-item-"+card.index}>
     <div className="bv-catalog-shot"><Photo slug={slug} n={card.index+2} alt={"Ảnh concept minh họa "+card.title}/>
      <span>STUDY / 0{card.index+1}</span></div>
     <div className="bv-catalog-meta"><small>{card.label}</small><h2>{card.title}</h2><p>{card.text}</p><span>EXPLORE STUDY <Angle/></span></div>
    </Link>)}
   </section>
   <section className="bv-catalog-footer"><span>ONE ORIGINAL GLB / MULTIPLE VIEWS</span><p>Chi tiết vật liệu và hình học được minh họa bằng file 3D do người dùng cung cấp. VELAR không phải đơn vị sản xuất hoặc phân phối xe.</p></section>
   <Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="realty")return <main className="experience-sub experience-realty" data-sector={sector} id="world-main">
   <section className="experience-realty-head"><div><Crumb root={root} label={extra.navWork}/><span className="experience-kicker">{world.brand} / SELECTION</span><h1>{slug==="auto-showroom"?"CHOOSE YOUR NEXT DRIVE.":"DISCOVER WHERE YOU BELONG."}</h1><p>{world.intro}</p></div><div className="experience-realty-picture"><Photo slug={slug} n={1} alt={extra.navWork} priority/></div></section>
   <section className="experience-realty-list"><div className="experience-section-head"><p>OUR SELECTION / 01—03</p><h2>{extra.worksLabel}</h2></div>{controls()}<div className="experience-realty-grid">{filtered.map(card=><Link key={card.index} href={workLink(card.index)} className="experience-realty-card"><div><Photo slug={slug} n={card.index+2} alt={card.title}/><span>0{card.index+1} / FEATURED</span></div><section><small>{card.label}</small><h3>{card.title}</h3><p>{card.text}</p><strong>Khám phá chi tiết <Angle/></strong></section></Link>)}</div></section><Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="industry")return <main className="experience-sub experience-industry" data-sector={sector} id="world-main">
   <section className="experience-industry-head"><Crumb root={root} label={extra.navWork}/><div><span className="experience-kicker">CAPABILITIES / {world.brand}</span><h1>{slug==="finance-trust"?"KỶ LUẬT TẠO NIỀM TIN.":slug==="engineering-industry"?"PRECISION IN EVERY DETAIL.":slug==="construction-firm"?"BUILT TO LAST.":"STRATEGY INTO ACTION."}</h1></div><p>{world.intro}</p></section>
   <section className="experience-industrial-list"><header><span>INDEX 01 — 03</span><h2>{extra.worksLabel}</h2></header>{filtered.map(card=><Link key={card.index} href={workLink(card.index)} className="experience-industrial-row"><span>0{card.index+1}</span><div><small>{card.label}</small><h3>{card.title}</h3><p>{card.text}</p></div><div className="experience-industrial-photo"><Photo slug={slug} n={card.index+2} alt={card.title}/></div><Angle/></Link>)}</section><section className="experience-industrial-manifesto"><span>OUR APPROACH</span><h2>{extra.slogan}</h2><p>{extra.approach}</p><Link href={root+"/services"}>Xem phương pháp làm việc <Angle/></Link></section><Cta root={root} world={world} extra={extra}/>
  </main>;
  if(sector==="platform")return <main className="experience-sub experience-platform" data-sector={sector} id="world-main">
   <section className="experience-platform-head"><Crumb root={root} label={extra.navWork}/><span className="experience-kicker">{world.brand} / PRODUCT TOUR</span><h1>{slug==="education-platform"?"Choose a skill. Build something.":slug==="team-intranet"?"A better team workspace.":"Everything in sync."}</h1><p>{world.intro}</p></section>
   <section className="experience-platform-shell"><aside><strong>◉ {world.brand}</strong><span>DEMO WORKSPACE</span>{cards.map((c,i)=><button type="button" key={c.title} aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span>{c.title}</button>)}</aside>
   <div><div className="experience-platform-top"><span>OVERVIEW / EXPERIENCE</span><span>INTERACTIVE DEMO ●</span></div><h2>{cards[active].title}</h2><p>{cards[active].text}</p><div className="experience-platform-feature"><div className="experience-platform-visual"><Photo slug={slug} n={active+2} alt={cards[active].title}/></div><div><small>FEATURE / 0{active+1}</small><h3>{extra.services[active].title}</h3><p>{extra.services[active].detail}</p><Link href={workLink(active)}>Xem chi tiết <Angle/></Link></div></div></div></section>
   <section className="experience-platform-more"><div className="experience-section-head"><p>THE PLATFORM</p><h2>Designed for what matters.</h2></div>{cards.map((card,i)=><Link key={card.title} href={workLink(i)}><span>0{i+1}</span><strong>{card.title}</strong><Angle/></Link>)}</section><Cta root={root} world={world} extra={extra}/>
  </main>;
  return <main className="experience-sub experience-atelier" data-sector={sector} id="world-main">
   <section className="experience-atelier-head"><div><Crumb root={root} label={extra.navWork}/><span className="experience-kicker">{world.brand} / PORTFOLIO</span><h1>{extra.worksLabel}</h1><p>{world.intro}</p></div><div className="experience-atelier-cover"><Photo slug={slug} n={1} alt={world.brand+" tuyển chọn"}/></div></section>
   <section className="experience-atelier-list">{cards.map((card,i)=><Link key={card.title} href={workLink(i)} className={"experience-atelier-row experience-atelier-row-"+i}><div className="experience-atelier-image"><Photo slug={slug} n={i+2} alt={card.title}/></div><div><small>0{i+1} / {card.label}</small><h2>{card.title}</h2><p>{card.text}</p><strong>KHÁM PHÁ <Angle/></strong></div></Link>)}</section><Cta root={root} world={world} extra={extra}/>
  </main>;
 };
 const detail=()=>{
  const index=Math.max(0,Math.min(itemIndex-1,2));
  return <main id="world-main" className={"experience-sub experience-detail experience-detail-"+sector} data-sector={sector}>
   <section className="experience-detail-intro"><Crumb root={root} label={chosen.title}/><Link href={root+"/work"} className="experience-detail-back">← {extra.navWork}</Link><div><span className="experience-kicker">0{itemIndex} / {chosen.label} / {world.brand}</span><h1>{chosen.title}</h1><p>{chosen.text}</p>{isShop&&<span className="experience-pill">Bộ sưu tập thử nghiệm</span>}</div></section>
   <section className="experience-detail-layout"><div className="experience-detail-gallery"><div className="experience-detail-primary"><Photo slug={slug} n={index+2} alt={chosen.title} priority/></div><div className="experience-detail-secondary"><div><Photo slug={slug} n={(index+2)%5+1} alt={"Góc nhìn khác của "+chosen.title}/></div><div><Photo slug={slug} n={(index+3)%5+1} alt={"Chi tiết của "+chosen.title}/></div></div></div>
   <aside className="experience-detail-aside"><span>ABOUT / 0{itemIndex}</span><h2>{sector==="dining"?"Một món ăn dành cho hôm nay.":sector==="journal"?"Bên trong câu chuyện.":sector==="retail"?"Chi tiết tạo nên khác biệt.":sector==="live"?"Một trải nghiệm đáng nhớ." :sector==="realty"?"Được chọn có chủ đích.":sector==="automotive"?"ANATOMY OF A CONCEPT.":sector==="industry"?"Từ yêu cầu đến giải pháp.":sector==="platform"?"Tính năng trong thực tế.":"Một cách nhìn riêng."}</h2><p>{extra.approach}</p><div className="experience-detail-facts">{extra.principles.map((p,i)=><div key={p}><small>0{i+1}</small><span>{p}</span></div>)}</div>
   {isShop?<div className="experience-detail-purchase"><label>Số lượng demo <select aria-label="Số lượng sản phẩm" value={qty} onChange={e=>setQty(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></label><button type="button" onClick={()=>addToCart(qty)}>Thêm {qty} sản phẩm vào giỏ <Angle/></button></div>:<Link className="experience-detail-action" href={root+"/contact"}>{sector==="dining"?"Đặt bàn" :sector==="realty"?"Đặt lịch xem":sector==="automotive"?"Gửi yêu cầu demo":sector==="live"?"Gửi yêu cầu tham gia":"Trao đổi với chúng tôi"} <Angle/></Link>}
   <MockNotice/></aside></section>
   {sector==="journal"&&<article className="experience-story-excerpt"><span>EDITORIAL / EXCERPT</span><h2>{extra.storyTitle}</h2><p>{extra.story}</p><p>{extra.approach}</p><p>Đây là một đoạn nội dung mẫu để thể hiện cách trình bày bài viết. Bài viết đầy đủ cần được biên tập khi triển khai cho khách hàng.</p></article>}
   <section className="experience-detail-next"><span>NEXT IN COLLECTION / 0{index+1}</span><Link href={workLink((index+1)%3)}>{cards[(index+1)%3].title}<Angle/></Link></section><Cta root={root} world={world} extra={extra}/>
  </main>;
 };
 const services=()=>{
  return <main id="world-main" className={"experience-sub experience-services experience-services-"+sector} data-sector={sector}>
   <section className="experience-services-hero"><Crumb root={root} label={extra.navServices}/><span className="experience-kicker">OUR EXPERTISE / {world.brand}</span><h1>{extra.navServices}<span>.</span></h1><p>{extra.approach}</p><div className="experience-services-hero-photo"><Photo slug={slug} n={1} alt={extra.navServices}/></div></section>
   <section className="experience-services-index"><div className="experience-section-head"><p>01 / {extra.servicesLabel}</p><h2>{sector==="retail"?"Hơn cả một món đồ.":sector==="industry"?"Một giải pháp có cơ sở.":sector==="dining"?"Một chiếc bàn cho mọi dịp.":sector==="live"?"Tạo nên khoảnh khắc." :sector==="realty"?"Lựa chọn có hiểu biết.":sector==="automotive"?"DESIGNED TO BE EXPLORED.":sector==="platform"?"Hệ thống phục vụ con người.":"Sự chăm chút trong từng bước."}</h2></div>
   <div className="experience-service-panels">{extra.services.map((s,i)=><details key={s.number} open={i===0}><summary><span>{s.number}</span><strong>{s.title}</strong><span className="experience-expand-symbol">+</span></summary><div className="experience-service-body"><div><p>{s.detail}</p><small>{s.outcome}</small><Link href={root+"/contact"}>Hỏi về dịch vụ này <Angle/></Link></div><div className="experience-service-thumb"><Photo slug={slug} n={i+2} alt={s.title}/></div></div></details>)}</div></section>
   <section className="experience-services-method"><div><span>02 / OUR METHOD</span><h2>{extra.storyTitle}</h2></div><div><p>{extra.story}</p>{extra.principles.map((p,i)=><div className="experience-method-item" key={p}><span>0{i+1}</span><strong>{p}</strong></div>)}</div></section><Cta root={root} world={world} extra={extra}/>
  </main>;
 };
 return section==="work"?work():section==="detail"?detail():services();
}
