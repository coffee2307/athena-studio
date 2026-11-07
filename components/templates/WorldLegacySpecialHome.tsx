"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";

type Props={slug:string;world:DemoCopy;extra:WorldDetail};
export function hasLegacySpecialHome(slug:string){
 return ["creative-studio","modern-corporate","fashion-archive","saas-product","campaign-landing","architecture-studio","wellness-clinic","property-showcase"].includes(slug);
}
function Photo({slug,n,alt}:{slug:string;n:number;alt:string}){
 return <Image fill src={`/template-demos/${slug}/image-${n}.jpg`} alt={alt} sizes="(max-width:760px) 100vw, 65vw"/>;
}
function ContactBanner({slug,world}:{slug:string;world:DemoCopy}){
 return <section className="special-footer-cta"><span>AN OPEN INVITATION / {world.brand}</span><h2>Bắt đầu từ một ý tưởng.</h2><Link href={`/template-demos/${slug}/contact`}>TRAO ĐỔI VỚI CHÚNG TÔI </Link></section>;
}
export function WorldLegacySpecialHome({slug,world,extra}:Props){
 const root="/template-demos/"+slug;
 const [tab,setTab]=useState(0);
 if(slug==="creative-studio")return <main className="legacy-signature legacy-creative" id="world-main">
  <section className="legacy-creative-hero"><span>01 / INDEPENDENT CREATIVE PRACTICE</span><h1>We make <em>ideas</em><br/>worth feeling.</h1><div className="legacy-creative-intro"><p>{world.intro}</p><Link href={root+"/work"}>DỰ ÁN ĐÃ CHỌN </Link></div><div className="legacy-creative-hero-image"><Photo slug={slug} n={1} alt="Không gian studio sáng tạo"/></div><span className="legacy-creative-side">SORA STUDIO — VISUAL EXPLORATIONS</span></section>
  <section className="legacy-creative-work"><div><span>THE SELECTED WORKS / 02</span><h2>Good work is a conversation.</h2></div><div>{world.cards.map((card,i)=><Link href={root+"/work/"+(i+1)} key={card.title} className={"legacy-creative-work-"+i}><div><Photo slug={slug} n={i+2} alt={card.title}/></div><span>0{i+1} / {card.label}</span><h3>{card.title} </h3></Link>)}</div></section>
  <section className="legacy-creative-manifesto"><span>WHAT WE BELIEVE</span><p>{extra.slogan}</p><Link href={root+"/about"}>ĐỌC TUYÊN NGÔN </Link></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="modern-corporate")return <main className="legacy-signature legacy-corporate" id="world-main">
  <section className="legacy-corporate-hero"><div><span>NORTH SYSTEMS / ADVISORY & OPERATIONS</span><h1>Hệ thống rõ ràng.<br/><em>Vận hành vững vàng.</em></h1><p>{world.intro}</p><Link href={root+"/services"}>GIẢI PHÁP CỦA CHÚNG TÔI </Link></div><div className="legacy-corporate-picture"><Photo slug={slug} n={1} alt="Không gian làm việc chuyên nghiệp"/></div></section>
  <section className="legacy-corporate-trust"><div><strong>01</strong><span>DIAGNOSE</span></div><div><strong>02</strong><span>ALIGN</span></div><div><strong>03</strong><span>DELIVER</span></div><div><strong>04</strong><span>IMPROVE</span></div></section>
  <section className="legacy-corporate-solutions"><header><span>EXPERTISE / 2026</span><h2>Giải quyết đúng những vấn đề quan trọng.</h2></header><div>{extra.services.map(s=><Link href={root+"/services"} key={s.number}><span>{s.number}</span><div><h3>{s.title}</h3><p>{s.detail}</p></div><b></b></Link>)}</div></section><section className="legacy-corporate-case"><div><Photo slug={slug} n={4} alt="Văn phòng hiện đại"/></div><div><span>STRUCTURE TO GROW</span><h2>Thông tin tốt tạo ra những quyết định tốt.</h2><p>{extra.story}</p><Link href={root+"/about"}>TÌM HIỂU NORTH </Link></div></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="fashion-archive")return <main className="legacy-signature legacy-fashion" id="world-main">
  <section className="legacy-fashion-cover"><Photo slug={slug} n={1} alt="Bộ sưu tập thời trang mới"/><div><span>ATELIER / ARCHIVE Nº 01</span><h1>THE FORM<br/>OF <em>SILENCE.</em></h1><Link href={root+"/work"}>XEM COLLECTION 01 </Link></div><span className="legacy-fashion-cover-no">FORM / TEXTURE / MOVEMENT</span></section>
  <div className="legacy-fashion-belt"><span>THIS IS NOT A SEASONAL COLLECTION</span><span>—</span><span>MADE TO OUTLAST TRENDS</span></div>
  <section className="legacy-fashion-collection"><header><span>COLLECTION 01 / PIECES</span><h2>Objects of intention.</h2></header><div>{world.cards.map((c,i)=><Link href={root+"/work/"+(i+1)} key={c.title}><div><Photo slug={slug} n={i+2} alt={c.title}/></div><span>0{i+1} — {c.label}</span><h3>{c.title}</h3></Link>)}</div></section><section className="legacy-fashion-statement"><h2>Nothing unnecessary.<br/><i>Everything considered.</i></h2><p>{extra.story}</p><Link href={root+"/about"}>THE ATELIER </Link></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="saas-product")return <main className="legacy-signature legacy-saas" id="world-main">
  <section className="legacy-saas-hero"><div className="legacy-saas-intro"><span>FOCUSED WORK / LUMA WORKSPACE</span><h1>Work together.<br/><em>Without the noise.</em></h1><p>{world.intro}</p><Link href={root+"/contact"}>BẮT ĐẦU TRẢI NGHIỆM </Link></div><div className="legacy-saas-app"><div className="legacy-saas-top"><strong>◉ LUMA WORKSPACE</strong><span>PRODUCT DEMO / READ ONLY</span></div><div className="legacy-saas-columns"><aside><span>▦ Overview</span><span>✓ Tasks</span><span>◫ Reports</span></aside><div><h2>Good morning, Team.</h2><div className="legacy-saas-metrics"><span><b>12</b> TASKS</span><span><b>84%</b> PROGRESS</span><span><b>03</b> PRIORITIES</span></div><div className="legacy-saas-graph"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="legacy-saas-row">● Project Alpha <span>On track</span></div><div className="legacy-saas-row">● Product Launch <span>In review</span></div></div></div></div></section>
  <section className="legacy-saas-features"><header><span>BUILT FOR TEAMS</span><h2>A better way to move forward.</h2></header><div className="legacy-saas-tabs">{extra.services.map((s,i)=><button type="button" aria-pressed={tab===i} onClick={()=>setTab(i)} key={s.number}>{s.number} / {s.title}</button>)}</div><div className="legacy-saas-feature"><div><span>FEATURE {extra.services[tab].number}</span><h3>{extra.services[tab].title}</h3><p>{extra.services[tab].detail}</p><Link href={root+"/services"}>KHÁM PHÁ TÍNH NĂNG </Link></div><div className="legacy-saas-feature-visual"><Photo slug={slug} n={tab+2} alt={extra.services[tab].title}/></div></div></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="campaign-landing")return <main className="legacy-signature legacy-campaign" id="world-main">
  <section className="legacy-campaign-cover"><span>CREATIVITY HAPPENS HERE</span><h1>MỞ<br/><i>FESTIVAL</i><b>26</b></h1><div><p>{world.intro}</p><Link href={root+"/contact"}>THAM GIA NGAY </Link></div><div className="legacy-campaign-photo"><Photo slug={slug} n={1} alt="Không gian sự kiện sáng tạo"/></div></section>
  <div className="legacy-campaign-ticker"><span>DESIGN / MUSIC / CULTURE / PEOPLE / IDEAS / OPEN CITY</span></div>
  <section className="legacy-campaign-program"><header><span>THE PROGRAM / 2026</span><h2>THREE DAYS.<br/>A THOUSAND IDEAS.</h2></header><div>{world.cards.map((c,i)=><Link href={root+"/work/"+(i+1)} key={c.title}><span>DAY 0{i+1}</span><strong>{c.title}</strong><span>{c.text} </span></Link>)}</div></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="architecture-studio")return <main className="legacy-signature legacy-architecture" id="world-main">
  <section className="legacy-architecture-hero"><div><span>MỘC ARCHITECTURE / A PRACTICE OF LISTENING</span><h1>Space is<br/>a <em>feeling.</em></h1><p>{world.intro}</p><Link href={root+"/work"}>KHÁM PHÁ CÔNG TRÌNH </Link></div><div className="legacy-architecture-hero-image"><Photo slug={slug} n={1} alt="Công trình kiến trúc hiện đại"/></div></section>
  <section className="legacy-architecture-index"><div><span>01 / THE PROJECTS</span><h2>Built with sensitivity.</h2></div><div>{world.cards.map((c,i)=><Link href={root+"/work/"+(i+1)} key={c.title} className={"legacy-arch-card-"+i}><div><Photo slug={slug} n={i+2} alt={c.title}/></div><span>0{i+1} / {c.label}</span><h3>{c.title} </h3></Link>)}</div></section>
  <section className="legacy-architecture-values"><div><h2>Less noise.<br/>More life.</h2></div><div><p>{extra.story}</p><Link href={root+"/about"}>OUR PRACTICE </Link></div></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="wellness-clinic")return <main className="legacy-signature legacy-wellness" id="world-main">
  <section className="legacy-wellness-hero"><div><span>A QUIETER WAY OF LIVING</span><h1>Để mỗi ngày<br/><em>nhẹ đi một chút.</em></h1><p>{world.intro}</p><Link href={root+"/contact"}>ĐẶT LỊCH TRẢI NGHIỆM </Link></div><div className="legacy-wellness-arch"><Photo slug={slug} n={1} alt="Không gian chăm sóc nhẹ nhàng"/></div></section>
  <div className="legacy-wellness-line"><span>REST</span><span>✿</span><span>MOVE</span><span>✿</span><span>RECONNECT</span></div>
  <section className="legacy-wellness-treatments"><header><span>SELF-CARE RITUALS</span><h2>Dành thời gian cho chính mình.</h2></header><div>{world.cards.map((c,i)=><Link href={root+"/work/"+(i+1)} key={c.title}><div><Photo slug={slug} n={i+2} alt={c.title}/></div><h3>{c.title}</h3><p>{c.text}</p><span>KHÁM PHÁ </span></Link>)}</div></section><section className="legacy-wellness-quote"><p>{extra.slogan}</p><Link href={root+"/about"}>OUR PHILOSOPHY </Link></section><ContactBanner slug={slug} world={world}/>
 </main>;
 if(slug==="property-showcase")return <main className="legacy-signature legacy-property" id="world-main">
  <section className="legacy-property-hero"><div className="legacy-property-main-photo"><Photo slug={slug} n={tab+1} alt={"Không gian "+world.cards[tab].title}/></div><div className="legacy-property-overlay"><span>NEST PROPERTY / CURATED RESIDENCES</span><h1>Find a place<br/>to <i>belong.</i></h1><p>{world.intro}</p><Link href={root+"/work"}>KHÁM PHÁ KHÔNG GIAN </Link></div><div className="legacy-property-slide-nav">{world.cards.map((c,i)=><button key={c.title} aria-pressed={tab===i} onClick={()=>setTab(i)}>0{i+1} / {c.title}</button>)}</div></section>
  <section className="legacy-property-listings"><header><span>THE RESIDENCES / 2026</span><h2>Homes worth discovering.</h2></header><div>{world.cards.map((c,i)=><Link href={root+"/work/"+(i+1)} key={c.title}><div><Photo slug={slug} n={i+2} alt={c.title}/></div><span>{c.label}</span><h3>{c.title}</h3><p>{c.text} </p></Link>)}</div></section><section className="legacy-property-perspective"><div><Photo slug={slug} n={5} alt="Không gian sống được tuyển chọn"/></div><div><span>MORE THAN SQUARE METERS</span><h2>{extra.storyTitle}</h2><p>{extra.story}</p><Link href={root+"/about"}>ABOUT NEST </Link></div></section><ContactBanner slug={slug} world={world}/>
 </main>;
 return null;
}
