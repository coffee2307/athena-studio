"use client";
import Image from "next/image";
import Link from "next/link";
import type {DemoCopy} from "@/data/demo-worlds";
import type {WorldDetail} from "@/data/demo-world-details";

type Props={slug:string;world:DemoCopy;extra:WorldDetail;addToCart:()=>void};
export function hasExistingSpecialHome(slug:string){
 return ["hospitality-booking","editorial-journal","commerce-standard","education-platform"].includes(slug);
}
function Photo({slug,n,alt}:{slug:string;n:number;alt:string}){
 return <Image src={`/template-demos/${slug}/image-${n}.jpg`} alt={alt} fill sizes="(max-width:720px) 100vw, 60vw"/>;
}
function Closing({slug,world}:{slug:string;world:DemoCopy}){
 return <section className="secondary-special-cta"><small>{world.brand} / CONCEPT WEBSITE</small><h2>Chúng ta bắt đầu từ đâu?</h2><Link href={`/template-demos/${slug}/contact`}>Liên hệ và trải nghiệm </Link></section>;
}
export function WorldExistingSpecialHome({slug,world,extra,addToCart}:Props){
 const root="/template-demos/"+slug;
 if(slug==="hospitality-booking")return <main className="secondary-special secondary-restaurant" id="world-main">
  <section className="restaurant-opening"><p>MỘC BẾP — BẾP MÙA / VIỆT NAM</p><h1>Ăn một bữa ngon.<em> Giữ một buổi chiều.</em></h1><span>{world.intro}</span><Link href={root+"/contact"}>ĐẶT BÀN TRẢI NGHIỆM </Link><div className="restaurant-opening-image"><Photo slug={slug} n={1} alt="Không gian nhà hàng ấm cúng"/></div></section>
  <section className="restaurant-philosophy"><span>OUR TABLE / OUR STORY</span><h2>Bếp mùa, lòng người.</h2><p>{extra.story}</p><Link href={root+"/about"}>Câu chuyện Mộc Bếp </Link></section>
  <section className="restaurant-menu"><div className="restaurant-menu-heading"><span>FRESH FROM THE KITCHEN</span><h2>Hôm nay ăn gì?</h2><Link href={root+"/work"}>XEM THỰC ĐƠN →</Link></div><div className="restaurant-dishes">{world.cards.map((item,i)=><Link key={item.title} href={root+"/work/"+(i+1)}><div><Photo slug={slug} n={i+2} alt={item.title}/></div><small>{item.label}</small><h3>{item.title}</h3><p>{item.text}</p></Link>)}</div></section>
  <section className="restaurant-reserve"><div className="restaurant-reserve-photo"><Photo slug={slug} n={5} alt="Món ăn theo mùa"/></div><div><span>MAKE ROOM FOR GOOD FOOD</span><h2>Những cuộc hẹn đáng nhớ luôn cần một chiếc bàn.</h2><p>Hãy lựa chọn thời gian phù hợp để thử quy trình đặt bàn.</p><Link href={root+"/contact"}>THỬ ĐẶT BÀN </Link></div></section><Closing slug={slug} world={world}/>
 </main>;
 if(slug==="editorial-journal")return <main className="secondary-special secondary-journal" id="world-main">
  <div className="journal-masthead"><span>INDEPENDENT JOURNAL / NO. 08 — 2026</span><strong>FIELDNOTES.</strong><div><span>ART · DESIGN · LIFE</span><span>READ SLOW / THINK DEEP</span></div></div>
  <section className="journal-cover"><div><span>ON THE COVER / ISSUE 08</span><h1>Những điều đáng để <em>đọc chậm.</em></h1><p>{world.intro}</p><Link href={root+"/work"}>KHÁM PHÁ SỐ MỚI </Link></div><div className="journal-cover-image"><Photo slug={slug} n={1} alt="Trang bìa tạp chí và bút máy"/></div></section>
  <section className="journal-articles"><div className="journal-category"><span>THE READING LIST</span><h2>Ghi chép mới nhất.</h2></div><div className="journal-article-list">{world.cards.map((story,i)=><Link href={root+"/work/"+(i+1)} key={story.title}><div className="journal-story-thumbnail"><Photo slug={slug} n={i+2} alt={story.title}/></div><div><span>{story.label} / VOL.0{i+1}</span><h3>{story.title}</h3><p>{story.text}</p></div><span></span></Link>)}</div></section>
  <div className="journal-quote"><span>EDITOR&apos;S NOTE</span><p>“{extra.slogan}”</p></div><Closing slug={slug} world={world}/>
 </main>;
 if(slug==="commerce-standard")return <main className="secondary-special secondary-commerce" id="world-main">
  <section className="commerce-banner"><div><span>DESIGNED TO LAST / DAILY OBJECTS</span><h1>Những món đồ <em>đáng giữ lại.</em></h1><p>{world.intro}</p><Link href={root+"/work"}>XEM CỬA HÀNG </Link></div><div className="commerce-banner-image"><Photo slug={slug} n={1} alt="Sản phẩm thiết kế hiện đại"/></div></section>
  <div className="commerce-trust"><span>CURATED OBJECTS</span><span>FUNCTION FIRST</span><span>EVERYDAY FORM</span></div>
  <section className="commerce-products"><header><span>CATALOG / 001</span><h2>Được chọn để đồng hành cùng bạn.</h2><Link href={root+"/work"}>TẤT CẢ SẢN PHẨM </Link></header><div className="commerce-product-grid">{world.cards.map((item,i)=><article key={item.title}><Link href={root+"/work/"+(i+1)}><div><Photo slug={slug} n={i+2} alt={item.title}/></div><small>0{i+1} / {item.label}</small><h3>{item.title}</h3><p>{item.text}</p></Link><button type="button" onClick={addToCart}>Thêm vào túi <span>+</span></button></article>)}</div></section>
  <section className="commerce-story"><div className="commerce-story-photo"><Photo slug={slug} n={5} alt="Tinh thần thiết kế đồ vật"/></div><div><span>WHY MỘC / OUR PHILOSOPHY</span><h2>Chọn ít.<br/>Dùng nhiều.<br/>Giữ lâu.</h2><p>{extra.story}</p><Link href={root+"/about"}>CÂU CHUYỆN THƯƠNG HIỆU </Link></div></section><Closing slug={slug} world={world}/>
 </main>;
 if(slug==="education-platform")return <main className="secondary-special secondary-education" id="world-main">
  <section className="education-hero"><div className="education-hero-copy"><span>LEARN · CREATE · GROW / MỞ LEARNING</span><h1>Học kỹ năng.<br/><em>Làm ra thứ hay.</em></h1><p>{world.intro}</p><div><Link href={root+"/work"}>KHÁM PHÁ KHÓA HỌC </Link><Link href={root+"/about"}>CÁCH CHÚNG TÔI DẠY →</Link></div><div className="education-hero-stats"><span><b>08</b> MODULES</span><span><b>03</b> TRACKS</span><span><b>01</b> GOAL</span></div></div><div className="education-hero-photo"><Photo slug={slug} n={1} alt="Bàn học sáng tạo"/><div className="education-floating-card"><span>YOUR PROGRESS</span><strong>LEARNING BY MAKING</strong><div><i/><i/><i/><i/></div><small>COURSE PREVIEW / INTERACTIVE DEMO</small></div></div></section>
  <section className="education-courses"><header><span>START SOMETHING NEW</span><h2>Điều gì bạn muốn học tiếp?</h2></header><div>{world.cards.map((c,i)=><Link href={root+"/work/"+(i+1)} key={c.title}><small>PATHWAY / 0{i+1}</small><h3>{c.title}</h3><p>{c.text}</p><span>XEM LỘ TRÌNH </span></Link>)}</div></section>
  <section className="education-how"><h2>Không chỉ học lý thuyết.</h2><div>{extra.principles.map((v,i)=><article key={v}><span>0{i+1}</span><strong>{v}</strong></article>)}</div></section><Closing slug={slug} world={world}/>
 </main>;
 return null;
}
