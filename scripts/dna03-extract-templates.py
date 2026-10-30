from pathlib import Path
import json, shutil, textwrap
root=Path(__file__).resolve().parents[1]
registry=json.loads((root/'data/templates.json').read_text(encoding='utf-8'))
out=root/'templates'
if out.exists() and any(out.iterdir()):
    print('TEMPLATES_ALREADY_PRESENT: no destructive overwrite')
    raise SystemExit(2)
out.mkdir(exist_ok=True)
palette={
 'portfolio':('#181c1a','#f3ede5','#d75c47'), 'corporate':('#172c3c','#edf2f5','#3d7290'),
 'commerce':('#252520','#f6f2e7','#c17c4e'), 'fashion':('#261d21','#f2e7e3','#d6a69b'),
 'saas':('#142c33','#e7f5f1','#67c5aa'), 'campaign':('#2f1b23','#fff2df','#e95846'),
 'hospitality':('#412b22','#f7ede1','#bf855f'), 'editorial':('#22211c','#f5f1e5','#b96b48'),
 'architecture':('#202826','#eeece5','#a79a84'), 'wellness':('#31483c','#eaf2e7','#8cae80'),
 'property':('#283a42','#ece9e3','#b78a66'), 'education':('#243a60','#f2f3e8','#e1a94c'),
 'petshop':('#394a36','#f5e6dc','#dc906e'), 'automotive':('#111318','#e9ebeb','#f47432'),
 'industrial':('#202b34','#eceff1','#e09d5a'), 'finance':('#15373a','#ecf3f1','#96baac'),
 'construction':('#383127','#f1ebe1','#d68c45'), 'music':('#241726','#f4e8ed','#c87eb9'),
 'concert':('#1b1532','#f6ebf6','#f57e78'), 'intranet':('#182c37','#e7eff3','#64a9c3'),
 'immersive':('#262531','#edf0f2','#e07b69')
}
layouts={
'portfolio':'editorial','corporate':'structured','commerce':'catalog','fashion':'editorial','saas':'structured',
'campaign':'statement','hospitality':'organic','editorial':'editorial','architecture':'editorial','wellness':'organic',
'property':'structured','education':'organic','petshop':'catalog','automotive':'cinematic','industrial':'structured',
'finance':'structured','construction':'structured','music':'statement','concert':'statement','intranet':'structured','immersive':'playful'
}
readme="""# {title} — Athena independent template
Standalone Next.js App Router project. This is a **DNA-03 extraction baseline** with its own app, components, visual assets, routes, package and content config. It is not yet a pixel-identical extraction of every previous Athena demo interaction; compare original /template-demos/{slug} and implement any missing bespoke scenes before delivery to a customer.

Setup: npm install && npm run build && npm run dev. Routes: /, /work, /services, /about, /contact.
Customize src/data/site.json and src/app/globals.css. Never add production credentials. Contact form is demo-only; no submission or payment integration.
Asset copyright/origin: see public/ASSET-SOURCES.md, original Athena registry and upstream credits. Don't claim example portfolio work is a customer commission.
"""
layouttsx="""import "./globals.css";
import type {Metadata} from "next";
import site from "../data/site.json";
export const metadata:Metadata={title:site.title,description:site.description};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>;}
"""
page="""import {Site} from "../components/Site";
export default function Page(){return <Site section="home"/>;}
"""
sectionpage="""import {notFound} from "next/navigation";
import {Site} from "../../components/Site";
const sections=["work","services","about","contact"] as const;
export function generateStaticParams(){return sections.map(section=>({section}));}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!sections.includes(section as typeof sections[number]))notFound();return <Site section={section as "work"|"services"|"about"|"contact"}/>;}
"""
sitejs="""\"use client\";
import {useState} from "react";
import Link from "next/link";
import site from "../data/site.json";
type Section="home"|"work"|"services"|"about"|"contact";
const routes=[["home","Trang chủ","/"],["work","Dự án","/work"],["services","Dịch vụ","/services"],["about","Giới thiệu","/about"],["contact","Liên hệ","/contact"]] as const;
export function Site({section="home"}:{section?:Section}){
 const [focus,setFocus]=useState(0);
 const [menu,setMenu]=useState(false);
 const items=site.features as string[];
 const gallery=site.images as string[];
 const label=section==="home"?"TRANG CHỦ":section==="work"?"CÔNG VIỆC":section==="services"?"DỊCH VỤ":section==="about"?"CÂU CHUYỆN":"LIÊN HỆ";
 return <div className={"site site-"+site.layout+" site-"+site.variant}>
  <header className="site-header"><Link className="brand" href="/">{site.brand}</Link><button className="menu-toggle" type="button" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}>{menu?"Đóng":"Menu"}</button><nav className={menu?"open":""} aria-label="Điều hướng chính">{routes.map(([id,title,url])=><Link key={id} aria-current={section===id?"page":undefined} href={url}>{title}</Link>)}</nav><span className="site-index">EST. 2026 / CONCEPT</span></header>
  <main>
   <section className="hero"><div className="hero-copy"><span className="eyebrow">{site.industry} / {label}</span><h1>{section==="home"?site.brand:section==="work"?"Khám phá công việc.":section==="services"?"Những gì chúng tôi làm.":section==="about"?"Một hướng đi riêng.":"Bắt đầu trao đổi."}</h1><p>{section==="home"?site.description:section==="work"?site.purpose:section==="services"?site.description:section==="about"?site.purpose:"Mẫu website minh họa. Hãy thay thế thông tin liên hệ bằng thông tin thương hiệu của bạn trước khi sử dụng."}</p><Link className="hero-action" href={section==="contact"?"/":"#explore"}>{section==="contact"?"Trở về trang chủ":"Khám phá"}<span aria-hidden="true">↗</span></Link></div><div className="hero-visual"><img src={gallery[focus]||gallery[0]} alt={"Ảnh minh họa "+site.title}/><span className="hero-overlay">{site.style} / {String(focus+1).padStart(2,"0")}</span></div></section>
   <section className="explore" id="explore"><div className="section-header"><small>SELECTED EXPERIENCE / 01</small><h2>{section==="work"?"Những góc nhìn khác nhau.":section==="services"?"Cấu trúc được thiết kế.":section==="about"?"Điều chúng tôi theo đuổi.":section==="contact"?"Mở đầu một câu chuyện.":"Dấu ấn riêng của mỗi lựa chọn."}</h2></div>
   {section==="contact"?<div className="contact-sample"><strong>Contact / Demo</strong><p>Website mẫu không tự động thu thập hay gửi thông tin.</p><Link href="mailto:hello@example.com?subject=Website%20inquiry">Mở ứng dụng email mẫu</Link></div>:<><div className="feature-grid">{items.slice(0,4).map((feature,i)=><button key={feature} type="button" aria-pressed={focus===i%gallery.length} onClick={()=>setFocus(i%gallery.length)} className="feature"><span>0{i+1}</span><strong>{feature}</strong><span>↗</span></button>)}</div><div className="gallery">{gallery.slice(0,5).map((image,i)=><button type="button" aria-label={"Chọn ảnh "+(i+1)} aria-pressed={focus===i} key={image} onClick={()=>setFocus(i)}><img src={image} alt={site.title+" / hình "+(i+1)}/></button>)}</div></>}
   </section>
   <section className="ending"><span>ATHENA / INDEPENDENT TEMPLATE</span><h2>{site.style}</h2><Link href="/contact">Trao đổi về dự án <span aria-hidden="true">↗</span></Link></section>
  </main><footer><span>{site.brand} © 2026 / CONCEPT</span><span>Template độc lập từ Athena Studio — Không phải website khách hàng thật</span></footer>
 </div>
}
"""
css="""*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:400 15px/1.65 Arial,sans-serif}a{color:inherit;text-decoration:none}button{font:inherit}button,a{ -webkit-tap-highlight-color:transparent}button:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.site{--ink:__INK__;--paper:__PAPER__;--accent:__ACCENT__;min-height:100vh;overflow-x:clip}.site-header{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:76px;padding:16px clamp(18px,4vw,70px);border-bottom:1px solid currentColor;background:var(--paper)}.brand{font-weight:900;font-size:19px;letter-spacing:-.04em}.site-header nav{display:flex;gap:20px}.site-header nav a{font-size:12px;font-weight:650}.site-header nav a[aria-current=page]{text-decoration:underline;text-underline-offset:6px}.site-index,.eyebrow,small{font-size:10px;letter-spacing:.13em;font-weight:800}.menu-toggle{display:none}.hero{max-width:1540px;margin:auto;min-height:min(80vh,800px);display:grid;grid-template-columns:1fr 1.05fr;gap:clamp(20px,6vw,95px);align-items:center;padding:clamp(25px,6vw,84px) clamp(18px,4vw,70px)}.hero-copy{min-width:0}.hero h1{font-size:clamp(44px,7vw,116px);line-height:.98;letter-spacing:-.074em;margin:30px 0;overflow-wrap:anywhere}.hero p{max-width:42ch}.hero-action,.ending>a{display:inline-flex;justify-content:space-between;align-items:center;gap:35px;min-height:46px;padding:13px 18px;margin-top:25px;color:white;background:var(--ink);font-size:12px;font-weight:800;border-radius:3px}.hero-action:hover,.ending>a:hover{background:var(--accent);color:#161a17}.hero-visual{position:relative;overflow:hidden;aspect-ratio:4/5;background:#c9cdcb;border-radius:4px}.hero-visual img{width:100%;height:100%;object-fit:cover;object-position:center;animation:enter 1s both}.hero-overlay{position:absolute;left:16px;bottom:16px;background:var(--paper);padding:8px 12px;font-size:10px;font-weight:800}.explore{padding:clamp(70px,7vw,120px) clamp(18px,4vw,70px);background:var(--ink);color:var(--paper)}.section-header{max-width:1000px}.section-header h2{font-size:clamp(34px,5vw,80px);line-height:1.08;letter-spacing:-.06em}.feature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:38px}.feature{min-height:150px;border:1px solid #a4a4a46a;padding:24px;background:transparent;color:inherit;display:grid;align-content:space-between;text-align:left;cursor:pointer}.feature[aria-pressed=true]{background:var(--accent);color:#1b241c}.feature span:first-child{font-size:10px}.feature strong{font-size:clamp(17px,2.3vw,30px);line-height:1.25;letter-spacing:-.03em}.gallery{display:flex;gap:12px;overflow-x:auto;padding:30px 0 8px;scroll-snap-type:x proximity}.gallery button{border:0;padding:0;background:transparent;cursor:pointer;flex:0 0 210px;height:140px;scroll-snap-align:start;opacity:.75}.gallery button[aria-pressed=true]{opacity:1;outline:3px solid var(--accent)}.gallery img{width:100%;height:100%;object-fit:cover}.contact-sample{padding:36px;background:#faf8f3;color:#20291f;max-width:650px}.contact-sample a{text-decoration:underline}.ending{padding:clamp(65px,8vw,130px) clamp(18px,4vw,70px);text-align:center}.ending h2{font:italic clamp(47px,8vw,120px)/1.1 Georgia,serif}.ending>a{margin:auto}footer{display:flex;justify-content:space-between;gap:15px;padding:25px clamp(18px,4vw,70px);border-top:1px solid #0003;font-size:11px}@keyframes enter{from{opacity:.4;transform:scale(1.035)}to{opacity:1;transform:none}}.site-editorial .hero{grid-template-columns:1.2fr 1fr}.site-editorial h1,.site-organic h1{font-family:Georgia,serif;font-weight:500;letter-spacing:-.055em}.site-organic .hero-visual,.site-organic .feature{border-radius:40px 4px 40px 4px}.site-structured .hero-visual{aspect-ratio:5/4}.site-structured .feature-grid{grid-template-columns:repeat(4,1fr)}.site-catalog .hero-visual{aspect-ratio:1/1}.site-catalog .feature-grid{grid-template-columns:repeat(4,1fr)}.site-statement .hero{grid-template-columns:1fr;position:relative}.site-statement .hero-copy{z-index:1}.site-statement .hero-visual{position:absolute;z-index:0;inset:0;aspect-ratio:auto;opacity:.18}.site-statement .hero-copy{max-width:850px}.site-cinematic{--paper:#12151b;--ink:#f2f2f0;color:var(--ink)}.site-cinematic .hero{grid-template-columns:.85fr 1.15fr}.site-cinematic .explore{background:#24282f}.site-cinematic .hero-action,.site-cinematic .ending>a{background:var(--accent);color:#10151a}.site-playful .hero-visual{transform:rotate(3deg);border-radius:20px}.site-playful .feature:nth-child(even){border-radius:40px 4px 40px 4px}@media(max-width:800px){.site-index{display:none}.menu-toggle{display:block;min-height:44px;padding:8px 15px;border:1px solid currentColor;background:transparent;color:inherit}.site-header{position:relative}.site-header nav{display:none;position:absolute;z-index:5;top:70px;left:0;right:0;padding:20px;background:var(--paper);border-bottom:1px solid currentColor;flex-direction:column}.site-header nav.open{display:flex}.hero,.site-editorial .hero,.site-cinematic .hero{grid-template-columns:1fr;min-height:0;gap:25px}.hero h1{font-size:clamp(43px,12vw,65px);margin:18px 0}.hero-visual{aspect-ratio:4/3}.site-structured .feature-grid,.site-catalog .feature-grid{grid-template-columns:1fr 1fr}.site-statement .hero{min-height:65vh}.site-statement .hero-visual{height:100%}.feature{min-height:115px;padding:17px}.gallery button{flex-basis:160px;height:113px}footer{flex-direction:column}}@media(max-width:380px){.feature-grid{grid-template-columns:1fr}.hero-visual{aspect-ratio:1/1}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.hero-visual img{animation:none}}\n"""
for i,t in enumerate(registry):
 slug=t['slug'];d=out/slug; (d/'src/app/[section]').mkdir(parents=True);(d/'src/components').mkdir(parents=True);(d/'src/data').mkdir(parents=True);(d/'public/images').mkdir(parents=True)
 ink,paper,accent=palette.get(t['variant'],palette['portfolio'])
 data={k:t[k] for k in ['slug','title','industry','style','purpose','description','variant','features','modules','reference'] if k in t}
 data['brand']=t['title'];data['layout']=layouts[t['variant']];data['images']=[]
 for n in range(1,6):
  src=root/'public/template-demos'/slug/('image-'+str(n)+'.jpg')
  if src.is_file(): shutil.copy2(src,d/'public/images'/src.name);data['images'].append('/images/'+src.name)
 if not data['images']:
  preview=root/'public/template-previews'/(slug+'.png')
  if preview.is_file(): shutil.copy2(preview,d/'public/images/preview.png');data['images']=['/images/preview.png']
 if slug=='auto-showroom':
  glb=root/'public/models/mclaren.glb'
  if glb.is_file(): (d/'public/models').mkdir(parents=True);shutil.copy2(glb,d/'public/models/mclaren.glb')
 (d/'src/data/site.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
 (d/'src/app/layout.tsx').write_text(layouttsx,encoding='utf-8')
 (d/'src/app/page.tsx').write_text(page,encoding='utf-8')
 (d/'src/app/[section]/page.tsx').write_text(sectionpage,encoding='utf-8')
 (d/'src/components/Site.tsx').write_text(sitejs,encoding='utf-8')
 (d/'src/app/globals.css').write_text(css.replace('__INK__',ink).replace('__PAPER__',paper).replace('__ACCENT__',accent),encoding='utf-8')
 pkg={'name':'athena-template-'+slug,'private':True,'version':'0.1.0','type':'module','scripts':{'dev':'next dev','build':'next build','start':'next start','typecheck':'tsc --noEmit'},'dependencies':{'next':'15.5.28','react':'19.1.0','react-dom':'19.1.0'},'devDependencies':{'@types/node':'22.15.0','@types/react':'19.1.0','@types/react-dom':'19.1.0','typescript':'5.8.3'}}
 (d/'package.json').write_text(json.dumps(pkg,indent=2),encoding='utf-8')
 (d/'tsconfig.json').write_text(json.dumps({'compilerOptions':{'target':'ES2017','lib':['dom','dom.iterable','esnext'],'allowJs':True,'skipLibCheck':True,'strict':True,'noEmit':True,'esModuleInterop':True,'module':'esnext','moduleResolution':'bundler','resolveJsonModule':True,'isolatedModules':True,'jsx':'preserve','incremental':True,'plugins':[{'name':'next'}]},'include':['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],'exclude':['node_modules']},indent=2),encoding='utf-8')
 (d/'next-env.d.ts').write_text('/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',encoding='utf-8')
 (d/'next.config.ts').write_text('import type {NextConfig} from "next";\nconst config:NextConfig={output:"standalone"};\nexport default config;\n',encoding='utf-8')
 (d/'template.manifest.json').write_text(json.dumps({'slug':slug,'name':t['title'],'layout':data['layout'],'originalDemo':t.get('demoPath'),'status':'standalone-baseline-extraction','fidelity':'original bespoke demos require visual parity review','license':t.get('reference'),'version':'0.1.0'},ensure_ascii=False,indent=2),encoding='utf-8')
 (d/'README.md').write_text(readme.format(title=t['title'],slug=slug),encoding='utf-8')
 source=root/'public/template-demos/ASSET-SOURCES.md'
 if source.is_file(): shutil.copy2(source,d/'public/ASSET-SOURCES.md')
 (d/'.env.example').write_text('# No secrets are required for the demo.\n',encoding='utf-8')
 (d/'.gitignore').write_text('node_modules\n.next\n.env.local\n*.tsbuildinfo\n',encoding='utf-8')
print('GENERATED',len(registry),'standalone template baselines')
