import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join,resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const entries=[
 {
  "slug": "fashion-archive",
  "brand": "Atelier Archive",
  "headline": "The collection is the story.",
  "description": "An archive of silhouettes, gestures and details.",
  "kicker": "LOOK 01 / COLLECTION",
  "cta": "Explore the edition",
  "layout": "editorial",
  "theme": "curtain",
  "ink": "#24191e",
  "paper": "#f6ecdf",
  "accent": "#ca8b83",
  "parts": [
   "Collection 01",
   "Craft notes",
   "The silhouette"
  ],
  "variant": "runway",
  "idx": 0
 },
 {
  "slug": "saas-product",
  "brand": "LUMA Workspace",
  "headline": "Make room for better work.",
  "description": "A product experience built around clarity and flow.",
  "kicker": "PRODUCT / INTERACTIVE TOUR",
  "cta": "Explore the workspace",
  "layout": "dashboard",
  "theme": "product",
  "ink": "#151c40",
  "paper": "#f1f2fe",
  "accent": "#a6b3fc",
  "parts": [
   "Plan work",
   "Review progress",
   "Collaborate"
  ],
  "variant": "workspace",
  "idx": 1
 },
 {
  "slug": "campaign-landing",
  "brand": "MỞ Festival",
  "headline": "Ideas made impossible to ignore.",
  "description": "A campaign isn't a page; it's a moment worth joining.",
  "kicker": "CAMPAIGN / THE MESSAGE",
  "cta": "Enter the experience",
  "layout": "poster",
  "theme": "amplify",
  "ink": "#19180e",
  "paper": "#ecff3e",
  "accent": "#f36d3c",
  "parts": [
   "The idea",
   "The moments",
   "Take part"
  ],
  "variant": "campaign",
  "idx": 2
 },
 {
  "slug": "hospitality-booking",
  "brand": "Bếp & Chuyện",
  "headline": "Stay for the conversation.",
  "description": "A restaurant story told through seasonal tables and ingredients.",
  "kicker": "TABLE / SEASONAL NOTES",
  "cta": "Explore the menu",
  "layout": "booklet",
  "theme": "table",
  "ink": "#274638",
  "paper": "#f4eee0",
  "accent": "#bda07e",
  "parts": [
   "Seasonal table",
   "Our kitchen",
   "The evening"
  ],
  "variant": "hospitality",
  "idx": 3
 },
 {
  "slug": "editorial-journal",
  "brand": "FIELDNOTES",
  "headline": "Stories worth keeping.",
  "description": "A quiet journal about ideas, culture and the details between.",
  "kicker": "ISSUE 08 / SELECTED WRITING",
  "cta": "Open the issue",
  "layout": "newspaper",
  "theme": "stories",
  "ink": "#32281e",
  "paper": "#f8f3e9",
  "accent": "#bd6448",
  "parts": [
   "Field report",
   "Conversations",
   "Photo essay"
  ],
  "variant": "editorial",
  "idx": 4
 },
 {
  "slug": "architecture-studio",
  "brand": "FORMA",
  "headline": "Space shapes thought.",
  "description": "An architectural practice exploring the space between light and structure.",
  "kicker": "ARCHIVE / BUILT & UNBUILT",
  "cta": "View the spaces",
  "layout": "blueprint",
  "theme": "spaces",
  "ink": "#343c39",
  "paper": "#eae9e2",
  "accent": "#9a8b70",
  "parts": [
   "Residences",
   "Material studies",
   "Public spaces"
  ],
  "variant": "architecture",
  "idx": 5
 },
 {
  "slug": "wellness-clinic",
  "brand": "An Nhiên",
  "headline": "Find your own rhythm.",
  "description": "Care begins with space to understand what you need.",
  "kicker": "CARE / AN INDIVIDUAL JOURNEY",
  "cta": "Discover the approach",
  "layout": "garden",
  "theme": "care",
  "ink": "#345a45",
  "paper": "#eaf3e8",
  "accent": "#b9d39a",
  "parts": [
   "Consultation",
   "Wellness routines",
   "Follow-up"
  ],
  "variant": "wellness",
  "idx": 6
 },
 {
  "slug": "property-showcase",
  "brand": "NEST Residences",
  "headline": "A place to belong.",
  "description": "Considered spaces for living, gathered as an intimate collection.",
  "kicker": "RESIDENCES / PRIVATE VIEWING",
  "cta": "Explore residences",
  "layout": "brochure",
  "theme": "residences",
  "ink": "#142321",
  "paper": "#ece7dc",
  "accent": "#d4b886",
  "parts": [
   "The residence",
   "Interiors",
   "Neighbourhood"
  ],
  "variant": "property",
  "idx": 7
 },
 {
  "slug": "education-platform",
  "brand": "MỞ Learning",
  "headline": "Curiosity has a path.",
  "description": "Learn with small steps, clear milestones and room to explore.",
  "kicker": "LEARNING / YOUR PATH",
  "cta": "Choose a lesson",
  "layout": "classroom",
  "theme": "learning",
  "ink": "#372873",
  "paper": "#faf5ff",
  "accent": "#e9ad63",
  "parts": [
   "Discover",
   "Practice",
   "Reflect"
  ],
  "variant": "education",
  "idx": 8
 },
 {
  "slug": "pet-store",
  "brand": "Poppy & Co.",
  "headline": "Every little friend matters.",
  "description": "The essentials for a happier everyday with your pet.",
  "kicker": "POPPY / FRIENDLY FINDS",
  "cta": "Find their favourites",
  "layout": "playful",
  "theme": "petshop",
  "ink": "#6c3d53",
  "paper": "#fff5eb",
  "accent": "#efaec8",
  "parts": [
   "For dogs",
   "For cats",
   "Play & care"
  ],
  "variant": "pets",
  "idx": 9
 },
 {
  "slug": "engineering-industry",
  "brand": "FORGE Precision",
  "headline": "Engineered to fit.",
  "description": "Materials, tolerances and production thinking in one technical space.",
  "kicker": "FORGE / SPECIFICATION INDEX",
  "cta": "Inspect capability",
  "layout": "technical",
  "theme": "engineering",
  "ink": "#252e32",
  "paper": "#e4e6e2",
  "accent": "#f17e3c",
  "parts": [
   "CNC machining",
   "Quality control",
   "Materials"
  ],
  "variant": "industrial",
  "idx": 10
 },
 {
  "slug": "finance-trust",
  "brand": "ATLAS Capital",
  "headline": "Understand before you decide.",
  "description": "Research-first financial explanations with transparent assumptions.",
  "kicker": "ATLAS / INSIGHT DESK",
  "cta": "Explore the framework",
  "layout": "ledger",
  "theme": "financial",
  "ink": "#1d3549",
  "paper": "#f0f3f6",
  "accent": "#7ea5bf",
  "parts": [
   "Market context",
   "Risk literacy",
   "Decision framework"
  ],
  "variant": "finance",
  "idx": 11
 },
 {
  "slug": "construction-firm",
  "brand": "TERRACON",
  "headline": "Built from the ground up.",
  "description": "A clear record of process, people and places under construction.",
  "kicker": "PROJECT / THE BUILD LOG",
  "cta": "Explore the works",
  "layout": "construction",
  "theme": "projects",
  "ink": "#363c36",
  "paper": "#ece9df",
  "accent": "#d28155",
  "parts": [
   "Site planning",
   "Engineering",
   "Delivery"
  ],
  "variant": "construction",
  "idx": 12
 },
 {
  "slug": "music-label",
  "brand": "ECHO Records",
  "headline": "Sounds have a home.",
  "description": "An independent catalog of artists, visual releases and sonic identities.",
  "kicker": "ECHO / RELEASE NO. 001",
  "cta": "Browse the records",
  "layout": "vinyl",
  "theme": "releases",
  "ink": "#412337",
  "paper": "#f4dcd5",
  "accent": "#bd5f86",
  "parts": [
   "Releases",
   "Artists",
   "Artwork"
  ],
  "variant": "music",
  "idx": 13
 },
 {
  "slug": "live-concert",
  "brand": "NEON LIVE",
  "headline": "The night starts here.",
  "description": "A live culture poster with an evolving line-up and immersive stage notes.",
  "kicker": "NEON / THE LINE-UP",
  "cta": "See the program",
  "layout": "neon",
  "theme": "lineup",
  "ink": "#211133",
  "paper": "#f4f3e9",
  "accent": "#e1ff33",
  "parts": [
   "Opening act",
   "Main stage",
   "After hours"
  ],
  "variant": "concert",
  "idx": 14
 },
 {
  "slug": "team-intranet",
  "brand": "ORBIT Workspace",
  "headline": "Work, in one place.",
  "description": "A clearer view of people, projects and everyday priorities.",
  "kicker": "ORBIT / TEAM SPACE",
  "cta": "Enter the workspace",
  "layout": "operating",
  "theme": "team",
  "ink": "#2b3751",
  "paper": "#f3f6fb",
  "accent": "#99a8df",
  "parts": [
   "Workstreams",
   "Team notes",
   "Shared resources"
  ],
  "variant": "workspace",
  "idx": 15
 }
];
function write(path,source){const target=join(root,path);mkdirSync(join(target,".."),{recursive:true});writeFileSync(target,source);}
function words(s){return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}
function makeSection(st,which){const cls=st.variant+"_"+which;
 const [a,b,c]=st.parts;
 if(which==="work")return '<section className={style.archivePage}><div className={style.sectionTitle}><small>'+words(st.kicker)+'</small><h1>'+words(st.parts[0]+' / '+st.parts[1])+'</h1><p>'+words(st.description)+'</p></div><div className={style.catalogGrid}>{artifacts.map((item,i)=><Link key={item.title} href={go("/work/"+(i+1))} className={style.artifact}><img src={media[i%media.length]} alt={item.title}/><small>0{i+1} / '+st.variant.toUpperCase()+'</small><h2>{item.title}</h2><p>{item.description}</p></Link>)}</div></section>';
 if(which==="detail")return '<article className={style.detailPage}><Link href={go("/work")}>← BACK TO INDEX</Link><small>FILE / 0{itemIndex}</small><h1>{artifacts[(itemIndex-1)%3].title}</h1><p>{artifacts[(itemIndex-1)%3].description}</p><figure><img src={media[(itemIndex-1)%media.length]} alt="Illustrative case material"/><figcaption>VISUAL STUDY / DEMONSTRATION MATERIAL</figcaption></figure><div className={style.detailPair}><span>CONTEXT</span><p>'+words(st.description)+'</p><span>PROCESS</span><p>Trình bày phương pháp minh họa. Không phải hồ sơ dự án đã thực hiện cho khách hàng.</p></div><Link href={go("/contact")}>START A CONVERSATION →</Link></article>';
 if(which==="services")return '<section className={style.servicePage}><div className={style.sectionTitle}><small>THE PRACTICE / 01—03</small><h1>'+words(st.parts.join(' / '))+'</h1><p>'+words(st.description)+'</p></div><div className={style.serviceSequence}>{artifacts.map((item,i)=><button key={item.title} onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>0{i+1}</span><strong>{item.title}</strong><p>{item.description}</p></button>)}</div><figure className={style.serviceVisual}><img src={media[selected%media.length]} alt={artifacts[selected].title}/><figcaption>{artifacts[selected].title} / SELECTED DISCIPLINE</figcaption></figure></section>';
 if(which==="about")return '<section className={style.aboutPage}><div className={style.aboutCopy}><small>ABOUT / '+st.variant.toUpperCase()+'</small><h1>'+words(st.headline)+'</h1><p>'+words(st.description)+'</p><p>Đây là thương hiệu khái niệm trong thư viện Athena Studio. Nội dung và hình ảnh minh họa không được trình bày là thành tích của khách hàng thật.</p></div><div className={style.aboutMedia}><img src={media[3%media.length]} alt="Illustrative brand material"/><span>THE PRINCIPLES / 2026</span></div></section>';
 return '<section className={style.contactPage}><div className={style.contactIntro}><small>INQUIRY / '+st.variant.toUpperCase()+'</small><h1>'+words("Let’s talk about "+st.parts[0].toLowerCase()+".")+'</h1><p>'+words(st.description)+'</p></div><form onSubmit={e=>{e.preventDefault();window.location.href="mailto:hello@example.com?subject="+encodeURIComponent('+JSON.stringify(st.brand+" / enquiry")+')+"&body="+encodeURIComponent(inquiry)}}><label htmlFor="independent-inquiry-'+st.slug+'">YOUR MESSAGE</label><textarea id="independent-inquiry-'+st.slug+'" required minLength={10} value={inquiry} onChange={e=>setInquiry(e.target.value)} placeholder="Mô tả nhu cầu của bạn…"/><button type="submit">MỞ ỨNG DỤNG EMAIL →</button><p>Website demo không thu thập hoặc gửi dữ liệu đến máy chủ.</p></form></section>';
}

function home(st){
 const c=st.layout;
 const intro='<div className={style.heroWords}><small>'+st.kicker+'</small><h1>'+st.headline+'</h1><p>'+st.description+'</p><Link href={go("/work")}>DISCOVER THE COLLECTION <span aria-hidden="true">→</span></Link></div>';
 const figure='<figure className={style.heroFigure}><img src={media[selected%media.length]} alt={artifacts[selected].title}/><figcaption>0{selected+1} / {artifacts[selected].title}</figcaption></figure>';
 const choose='<div className={style.interactive} role="group" aria-label="Khám phá nội dung">'+ '{artifacts.map((item,i)=><button type="button" key={item.title} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>0{i+1}</span><b>{item.title}</b></button>)}'+'</div>';
 const scenes={
 "editorial":'<section className={style.editorialCover}>'+figure+intro+'</section><section className={style.issueContents}><h2>ARCHIVE / THE EDITION</h2>'+choose+'</section><section className={style.imageEssay}><img src={media[2%media.length]} alt="Collection detail"/><p>Collection notes / considered gestures and quiet details.</p></section>',
 "dashboard":'<section className={style.productBoard}><div className={style.statusBar}>LUMA / WORKSPACE PREVIEW <span>DEMO MODE</span></div>'+intro+'<div className={style.appPanel}><strong>WORKSPACE / OVERVIEW</strong>'+choose+'<div className={style.productDetail}><span>ACTIVE MODULE</span><h2>{artifacts[selected].title}</h2><p>{artifacts[selected].description}</p></div></div></section><section className={style.imageEssay}><h2>Built around the way people work.</h2>'+figure+'</section>',
 "poster":'<section className={style.posterStage}><span className={style.punch}>CAMPAIGN / 2026</span>'+intro+figure+'</section><section className={style.posterRibbon}>THIS IS THE MOMENT / MAKE IT COUNT / BE PART OF IT</section><section className={style.posterLineup}><h2>THE MOVEMENT</h2>'+choose+'</section>',
 "booklet":'<section className={style.tableStage}><div className={style.tableInvitation}>A TABLE FOR EVERY STORY</div>'+figure+intro+'</section><section className={style.menuBoard}><h2>TONIGHT / ON THE TABLE</h2>'+choose+'<p>{artifacts[selected].description}</p></section>',
 "newspaper":'<section className={style.issueBanner}><span>FIELDNOTES / ISSUE NO. 08 — THE EDITORIAL INDEX</span><h1>'+st.headline+'</h1></section><section className={style.editorialCover}> '+figure+intro+'</section><section className={style.newspaperColumns}><h2>THE STORIES</h2>'+choose+'</section>',
 "blueprint":'<section className={style.planBoard}><span>FORMA / SPACE 001</span>'+intro+figure+'</section><section className={style.sitePlans}><h2>ROOM TO THINK</h2>'+choose+'<div>SELECTED / {artifacts[selected].description}</div></section>',
 "garden":'<section className={style.gardenScene}><div className={style.gardenHalo}></div>'+intro+figure+'</section><section className={style.carePaths}><h2>Find your path.</h2>'+choose+'</section>',
 "brochure":'<section className={style.residenceView}>'+figure+'<div className={style.residenceText}>'+intro+'</div></section><section className={style.spaceSelector}><h2>EXPLORE THE RESIDENCE</h2>'+choose+'</section>',
 "classroom":'<section className={style.learningSpace}><div className={style.classroomTop}>MODULE / 01 <span>LEARNING PATH</span></div>'+intro+'<div className={style.courseCards}>'+choose+'</div></section><section className={style.learningPicture}>'+figure+'<p>Make progress one meaningful step at a time.</p></section>',
 "playful":'<section className={style.poppyScene}><span>HELLO, LITTLE FRIEND!</span>'+intro+figure+'</section><section className={style.petPaths}><h2>WHO ARE WE SHOPPING FOR?</h2>'+choose+'</section>',
 "technical":'<section className={style.drawingStage}><div className={style.technicalMark}>FORGE / DRAWING 001</div>'+intro+'<div className={style.specSheet}>'+choose+'<strong>{artifacts[selected].description}</strong></div></section><section className={style.industrialPhoto}>'+figure+'</section>',
 "ledger":'<section className={style.marketDesk}><div className={style.ledgerStatus}>ATLAS / RESEARCH NOTE / DEMO DATA</div>'+intro+'<div className={style.researchBoard}><span>DECISION FRAMEWORK / NOT INVESTMENT ADVICE</span>'+choose+'<p>{artifacts[selected].description}</p></div></section><section className={style.evidenceBlock}>'+figure+'<p>Every conclusion requires context and provenance.</p></section>',
 "construction":'<section className={style.siteBuilding}><div className={style.siteMarker}>TERRACON / ON THE GROUND</div>'+figure+intro+'</section><section className={style.constructionSteps}><h2>BUILDING IN STAGES</h2>'+choose+'</section>',
 "vinyl":'<section className={style.recordSleeve}><div className={style.recordLabel}>SIDE A / ECHO RECORDS</div>'+figure+intro+'</section><section className={style.trackList}><h2>RELEASE NOTES</h2>'+choose+'<p>Release preview only — no copyrighted audio playback.</p></section>',
 "neon":'<section className={style.nightStage}><div className={style.lineupTicker}>NEON LIVE / TONIGHT / A FICTIONAL EVENT</div>'+intro+figure+'</section><section className={style.stageList}><h2>STAGE PROGRAM</h2>'+choose+'</section>',
 "operating":'<section className={style.orbitHome}><div className={style.workspaceRail}>ORBIT / TEAM SPACE <span>LOCAL DEMO</span></div>'+intro+'<div className={style.workspaceModules}>'+choose+'</div></section><section className={style.workspaceIllustration}>'+figure+'<p>One place for better everyday coordination.</p></section>'
 };
 return scenes[c]||scenes.editorial;
}
function header(st){
 const nav='const navItems:[string,string][]='+JSON.stringify([[st.parts[0],"/work"],[st.parts[1],"/services"],["The studio","/about"],["Contact","/contact"]])+';';
 const variants={
 "editorial":'<div className={style.topIndex}>ARCHIVE / 2026 <span>STUDIES IN MOTION</span></div><header className={style.header}><Link className={style.logo} href={go("/")}>ATELIER ARCHIVE</Link><nav>{navItems.slice(0,3).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "dashboard":'<header className={style.header}><Link className={style.logo} href={go("/")}>LUMA <small>WORKSPACE</small></Link><span className={style.headStatus}>● DEMO</span><nav>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "poster":'<header className={style.header}><span className={style.headStatus}>2026 / CAMPAIGN</span><Link className={style.logo} href={go("/")}>MỞ!</Link>'+toggle()+'<Link className={style.actionHead} href={go("/contact")}>JOIN THE CONVERSATION</Link></header>',
 "booklet":'<header className={style.header}><Link className={style.logo} href={go("/")}>Bếp & Chuyện</Link><nav>{navItems.slice(0,2).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav><Link className={style.actionHead} href={go("/contact")}>CHỌN BÀN / DEMO</Link>'+toggle()+'</header>',
 "newspaper":'<div className={style.topIndex}>VOL. 08 / CULTURE / IDEAS <span>INDEPENDENT JOURNAL</span></div><header className={style.header}><nav>{navItems.slice(0,2).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav><Link className={style.logo} href={go("/")}>FIELDNOTES.</Link>'+toggle()+'</header>',
 "blueprint":'<header className={style.header}><Link className={style.logo} href={go("/")}>FORMA / STUDIO</Link><span className={style.headStatus}>SPACE & STRUCTURE</span><nav>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "garden":'<header className={style.header}><div className={style.headStatus}>A QUIETER PATH</div><Link className={style.logo} href={go("/")}>An Nhiên</Link>'+toggle()+'<Link className={style.actionHead} href={go("/contact")}>Lời nhắn</Link></header>',
 "brochure":'<header className={style.header}><Link className={style.logo} href={go("/")}>NEST <small>RESIDENCES</small></Link><nav>{navItems.slice(0,3).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav><Link className={style.actionHead} href={go("/contact")}>PRIVATE ENQUIRY</Link>'+toggle()+'</header>',
 "classroom":'<header className={style.header}><Link className={style.logo} href={go("/")}>MỞ <small>LEARNING</small></Link><div className={style.headStatus}>YOUR LEARNING SPACE</div><nav>{navItems.slice(0,3).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "playful":'<header className={style.header}><Link className={style.logo} href={go("/")}>Poppy & Co.</Link><nav>{navItems.slice(0,2).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'<Link className={style.actionHead} href={go("/contact")}>Hi there!</Link></header>',
 "technical":'<header className={style.header}><div className={style.headStatus}>F/01 — ENGINEERING</div><Link className={style.logo} href={go("/")}>FORGE<span>™</span></Link><nav>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "ledger":'<div className={style.topIndex}>ATLAS RESEARCH / INFORMATIONAL DEMO <span>NO LIVE FINANCIAL DATA</span></div><header className={style.header}><Link className={style.logo} href={go("/")}>ATLAS / CAPITAL</Link><nav>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "construction":'<header className={style.header}><Link className={style.logo} href={go("/")}>TERRACON</Link><div className={style.headStatus}>BUILT WITH INTENT.</div><nav>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>',
 "vinyl":'<header className={style.header}><Link className={style.logo} href={go("/")}>ECHO<span>◎</span></Link><span className={style.headStatus}>INDEPENDENT RECORDS / 001</span>'+toggle()+'<nav>{navItems.slice(0,3).map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav></header>',
 "neon":'<header className={style.header}><span className={style.headStatus}>THE LIVE EXPERIMENT / 2026</span><Link className={style.logo} href={go("/")}>NEON LIVE</Link><Link className={style.actionHead} href={go("/contact")}>ENQUIRY</Link>'+toggle()+'</header>',
 "operating":'<header className={style.header}><Link className={style.logo} href={go("/")}>ORBIT / WORKSPACE</Link><span className={style.headStatus}>TEAM SPACE / DEMO</span><nav>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</nav>'+toggle()+'</header>'
 };
 function toggle(){return '<button className={style.hamburger} aria-expanded={menu} onClick={()=>setMenu(v=>!v)} aria-label={menu?"Đóng điều hướng":"Mở điều hướng"}><i/><i/><i/></button>';}
 return {nav,markup:variants[st.layout]};
}
function footer(st){
 const k=st.idx%4;
 if(k===0)return '<footer className={style.footer}><div className={style.footerSignature}>'+st.brand+'</div><p>'+st.description+'</p><div className={style.footerMenu}>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</div><small>© 2026 / ATHENA INDEPENDENT CONCEPT</small></footer>';
 if(k===1)return '<footer className={style.footer}><div className={style.footerTop}><small>END OF THIS JOURNEY / NEXT STARTS HERE</small><Link href={go("/contact")}>START A CONVERSATION →</Link></div><div className={style.footerSignature}>'+st.brand+'</div><div className={style.footerMenu}>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</div><small>AN INDEPENDENT DEMO, NOT A VERIFIED COMMERCIAL ENTITY.</small></footer>';
 if(k===2)return '<footer className={style.footer}><div className={style.footerTop}><strong>'+st.headline+'</strong><Link href={go("/contact")}>GET IN TOUCH →</Link></div><div className={style.footerColumns}><div><small>'+st.kicker+'</small><p>'+st.description+'</p></div><div className={style.footerMenu}>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</div></div><span className={style.footerSignature}>'+st.brand+'</span></footer>';
 return '<footer className={style.footer}><div className={style.footerColumns}><div><small>CONTACT</small><Link href={go("/contact")}>TELL US WHAT’S NEXT →</Link></div><div><small>DIRECTORY</small><div className={style.footerMenu}>{navItems.map(([x,p])=><Link href={go(p)} key={p}>{x}</Link>)}</div></div></div><div className={style.footerSignature}>'+st.brand+'</div><small>ATHENA STUDIO / CREATIVE DEMO ONLY.</small></footer>';
}

function makeSite(st){
 const Head=header(st);
 const artifacts=st.parts.map((title,i)=>({title,description:[
 "An independent exploration of craft, process and everyday moments.",
 "A closer look at the detail, people and thinking behind the work.",
 "A practical path from first idea to a considered experience."
 ][i]}));
 const parts=[
 '"use client";',
 'import Link from "next/link";',
 'import {useState,useEffect} from "react";',
 'import site from "../data/site.json";',
 'import style from "./'+st.variant+'-sovereign.module.css";',
 'type Section="home"|"work"|"services"|"about"|"contact"|"detail";',
 Head.nav,
 'const artifacts='+JSON.stringify(artifacts)+';',
 'export function Site({section="home",itemIndex=1,basePath="",assetBase=""}:{section?:Section;itemIndex?:number;basePath?:string;assetBase?:string}){',
 ' const [menu,setMenu]=useState(false);',
 ' const [selected,setSelected]=useState(0);',
 ' const [inquiry,setInquiry]=useState("");',
 ' const media=site.images.map(path=>assetBase+path);',
 ' const go=(path:string)=>basePath+(path==="/"?"":path);',
 ' useEffect(()=>{setMenu(false)},[section]);',
 ' useEffect(()=>{if(!menu)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setMenu(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[menu]);',
 ' return <div className={style.root} id="'+st.slug+'-top">',
 Head.markup,
 ' {menu&&<button className={style.menuScrim} aria-label="Đóng điều hướng" onClick={()=>setMenu(false)}/>}<aside className={style.menuPanel} inert={!menu} aria-hidden={!menu}><div className={style.menuTitle}>NAVIGATION / '+st.brand.toUpperCase()+'</div>{navItems.map(([label,path],i)=><Link key={path} href={go(path)} onClick={()=>setMenu(false)}><small>0{i+1}</small>{label}</Link>)}<button onClick={()=>setMenu(false)}>CLOSE / MENU</button></aside>',
 ' <main>',
 ' {section==="home"&&<>'+home(st)+'</>}',
 ' {section==="work"&&<>'+makeSection(st,"work")+'</>}',
 ' {section==="detail"&&<>'+makeSection(st,"detail")+'</>}',
 ' {section==="services"&&<>'+makeSection(st,"services")+'</>}',
 ' {section==="about"&&<>'+makeSection(st,"about")+'</>}',
 ' {section==="contact"&&<>'+makeSection(st,"contact")+'</>}',
 ' </main>',
 footer(st),
 ' </div>;',
 '}'
 ];
 return parts.join("\n")+"\n";
}
function cssFor(st){
 const typography={
 editorial:"Georgia,serif",dashboard:"Arial,sans-serif",poster:"Impact,Arial,sans-serif",
 booklet:"Georgia,serif",newspaper:"Georgia,serif",blueprint:"Arial,sans-serif",
 garden:"Georgia,serif",brochure:"Georgia,serif",classroom:"Arial,sans-serif",
 playful:"Arial,sans-serif",technical:"Arial,sans-serif",ledger:"Arial,sans-serif",
 construction:"Arial,sans-serif",vinyl:"Georgia,serif",neon:"Impact,Arial,sans-serif",operating:"Arial,sans-serif"
 }[st.layout]||"Arial,sans-serif";
 const layouts={
 editorial:"grid-template-columns:1fr 1.2fr;gap:6vw;min-height:730px",
 dashboard:"grid-template-columns:1fr 1.3fr;gap:40px;min-height:700px",
 poster:"grid-template-columns:1.3fr .7fr;gap:2vw;min-height:800px",
 booklet:"grid-template-columns:1fr 1fr;gap:4vw;min-height:710px",
 newspaper:"grid-template-columns:1fr 1.2fr;gap:5vw;min-height:650px",
 blueprint:"grid-template-columns:.8fr 1.2fr;gap:4vw;min-height:760px",
 garden:"grid-template-columns:1fr 1fr;gap:5vw;min-height:720px",
 brochure:"grid-template-columns:1.2fr .8fr;gap:0;min-height:760px",
 classroom:"grid-template-columns:1fr 1.2fr;gap:4vw;min-height:650px",
 playful:"grid-template-columns:1fr 1.1fr;gap:5vw;min-height:680px",
 technical:"grid-template-columns:1fr 1.15fr;gap:4vw;min-height:700px",
 ledger:"grid-template-columns:.95fr 1.05fr;gap:3vw;min-height:640px",
 construction:"grid-template-columns:1.1fr .9fr;gap:5vw;min-height:740px",
 vinyl:"grid-template-columns:1fr 1fr;gap:7vw;min-height:750px",
 neon:"grid-template-columns:1.3fr .7fr;gap:3vw;min-height:760px",
 operating:"grid-template-columns:1fr 1fr;gap:3vw;min-height:680px"
 };
 const start=st.layout==="poster"||st.layout==="neon"?"105px":"90px";
 const radius={editorial:"0",dashboard:"16px",poster:"0",booklet:"4px",newspaper:"0",blueprint:"0",garden:"55px",brochure:"0",classroom:"22px",playful:"32px",technical:"0",ledger:"4px",construction:"0",vinyl:"120px",neon:"0",operating:"12px"}[st.layout];
 const headerMode={
 editorial:"grid-template-columns:1fr 2fr auto;min-height:110px",
 dashboard:"grid-template-columns:1fr auto 2fr auto;min-height:74px;border-radius:0 0 16px 16px",
 poster:"grid-template-columns:1fr 2fr auto 1fr;min-height:96px;border-bottom:5px solid currentColor",
 booklet:"grid-template-columns:1fr 2fr auto auto;min-height:110px",
 newspaper:"grid-template-columns:1fr 3fr auto;min-height:125px;border-block:3px double currentColor",
 blueprint:"grid-template-columns:1fr auto 2fr auto;min-height:87px",
 garden:"grid-template-columns:1fr 2fr auto auto;min-height:94px;border-radius:0 0 45px 45px",
 brochure:"grid-template-columns:1fr 2fr auto auto;min-height:105px",
 classroom:"grid-template-columns:1fr 1fr 2fr auto;min-height:85px",
 playful:"grid-template-columns:1.2fr 2fr auto auto;min-height:90px;border-radius:0 0 28px 28px",
 technical:"grid-template-columns:1fr 1fr 3fr auto;min-height:92px;border-block:4px solid currentColor",
 ledger:"grid-template-columns:1fr 3fr auto;min-height:81px",
 construction:"grid-template-columns:1fr 1fr 2fr auto;min-height:96px;border-bottom:7px solid currentColor",
 vinyl:"grid-template-columns:1fr 2fr auto 1.5fr;min-height:97px",
 neon:"grid-template-columns:1fr 2fr 1fr auto;min-height:102px;border-bottom:4px solid currentColor",
 operating:"grid-template-columns:1fr auto 2fr auto;min-height:66px"
 }[st.layout];
 const css=[
 '.root{--ink:'+st.ink+';--paper:'+st.paper+';--accent:'+st.accent+';--display:'+typography+';--radius:'+radius+';background:var(--paper);color:var(--ink);min-height:100vh;font:15px/1.65 Arial,Helvetica,sans-serif;overflow-x:clip}',
 '.root *{box-sizing:border-box}.root a{color:inherit;text-decoration:none}.root button,.root textarea{font:inherit;cursor:pointer}.root :where(a,button,textarea):focus-visible{outline:3px solid var(--accent);outline-offset:4px}',
 '.header{display:grid;'+headerMode+';align-items:center;gap:clamp(12px,3vw,40px);padding:18px 5vw;border-bottom:1px solid currentColor;position:relative;z-index:45;background:var(--paper)}',
 '.logo{font:800 clamp(22px,3vw,40px)/1.05 var(--display);letter-spacing:-.055em}.logo small{font:700 9px Arial;letter-spacing:.12em;display:inline-block;margin-left:8px}.logo span{color:var(--accent)}',
 '.header nav{display:flex;gap:clamp(11px,2vw,32px);justify-content:center}.header nav a{font-size:12px;font-weight:700;white-space:nowrap}.headStatus,.topIndex,.actionHead{font:700 10px/1.6 Arial;letter-spacing:.12em}.topIndex{padding:10px 5vw;display:flex;justify-content:space-between;border-bottom:1px solid currentColor}',
 '.actionHead{padding:13px 18px;border:1px solid currentColor;white-space:nowrap}.hamburger{width:46px;height:46px;display:none;flex-direction:column;align-items:flex-start;justify-content:center;gap:6px;padding:9px;border:1px solid currentColor;background:transparent;color:inherit}.hamburger i{height:2px;width:24px;background:currentColor}.hamburger i:nth-child(2){width:17px}',
 '.menuScrim{position:fixed;inset:0;background:#101010aa;border:0;z-index:72}.menuPanel{position:fixed;z-index:73;top:0;right:0;bottom:0;background:var(--paper);color:var(--ink);width:min(480px,92vw);padding:40px 30px;display:flex;flex-direction:column;gap:10px;overflow:auto;transform:translateX(110%);visibility:hidden;transition:transform .3s}.menuPanel:not([aria-hidden="true"]){transform:none;visibility:visible}.menuTitle{font:750 11px Arial;letter-spacing:.12em;margin-bottom:40px}.menuPanel a{border-bottom:1px solid currentColor;padding:18px 0;display:flex;gap:17px;font:600 24px var(--display)}.menuPanel a small{font:600 10px Arial}.menuPanel button{margin-top:30px;padding:15px;background:var(--ink);color:var(--paper);border:0}',
 '.heroWords{padding:5vw;align-self:center}.heroWords small{font-size:11px;letter-spacing:.14em;font-weight:800}.heroWords h1{font:700 clamp(53px,7.2vw,125px)/.96 var(--display);letter-spacing:-.07em;margin:35px 0}.heroWords p{font:16px/1.75 Arial;max-width:41ch}.heroWords a{display:inline-flex;gap:18px;align-items:center;background:var(--ink);color:var(--paper);padding:16px 22px;font:800 11px Arial;letter-spacing:.06em;min-height:48px;margin-top:25px;border-radius:var(--radius)}',
 '.heroFigure{margin:0;position:relative;min-width:0;align-self:stretch;overflow:hidden;background:var(--accent)}.heroFigure img{display:block;width:100%;height:100%;min-height:420px;object-fit:cover}.heroFigure figcaption{position:absolute;bottom:20px;left:20px;background:var(--paper);padding:10px 15px;font:800 10px Arial}',
 '.editorialCover,.productBoard,.posterStage,.tableStage,.planBoard,.gardenScene,.residenceView,.learningSpace,.poppyScene,.drawingStage,.marketDesk,.siteBuilding,.recordSleeve,.nightStage,.orbitHome{display:grid;'+layouts[st.layout]+';align-items:stretch;position:relative}',
 '.issueBanner{padding:55px 5vw 15px;border-bottom:2px solid currentColor}.issueBanner span{font-size:11px;letter-spacing:.13em}.issueBanner h1{font:600 clamp(55px,11vw,155px)/.9 var(--display);letter-spacing:-.085em;margin:20px 0}',
 '.interactive{display:flex;gap:10px;flex-wrap:wrap;align-content:start}.interactive button{border:1px solid currentColor;background:transparent;color:inherit;text-align:left;display:flex;flex-direction:column;gap:17px;min-width:130px;flex:1;padding:20px;min-height:105px}.interactive button[aria-pressed="true"]{background:var(--accent);color:var(--ink)}.interactive button span{font-size:10px}.interactive button b{font-size:clamp(15px,1.65vw,23px);line-height:1.2}',
 '.issueContents,.posterLineup,.menuBoard,.newspaperColumns,.sitePlans,.carePaths,.spaceSelector,.petPaths,.constructionSteps,.trackList,.stageList{padding:85px 6vw;background:var(--ink);color:var(--paper)}.issueContents h2,.posterLineup h2,.menuBoard h2,.newspaperColumns h2,.sitePlans h2,.carePaths h2,.spaceSelector h2,.petPaths h2,.constructionSteps h2,.trackList h2,.stageList h2{font:600 clamp(34px,5vw,70px)/1.1 var(--display);margin:0 0 35px}',
 '.imageEssay,.learningPicture,.industrialPhoto,.evidenceBlock,.workspaceIllustration{padding:70px 7vw;display:grid;grid-template-columns:1.4fr 1fr;gap:4vw;align-items:center}.imageEssay img,.learningPicture img,.industrialPhoto img,.evidenceBlock img,.workspaceIllustration img{width:100%;max-height:680px;object-fit:cover}.imageEssay h2,.workspaceIllustration h2{font:600 50px var(--display)}',
 '.productBoard,.marketDesk,.orbitHome,.learningSpace{background:var(--ink);color:var(--paper);padding:5vw}.productBoard .heroWords,.marketDesk .heroWords,.orbitHome .heroWords,.learningSpace .heroWords{padding:3vw}.productBoard .heroWords a,.marketDesk .heroWords a,.orbitHome .heroWords a,.learningSpace .heroWords a{background:var(--accent);color:var(--ink)}',
 '.statusBar,.gridCaption,.posterRibbon,.tableInvitation,.technicalMark,.ledgerStatus,.siteMarker,.recordLabel,.lineupTicker,.workspaceRail,.classroomTop,.residenceText,.punch{font:800 11px Arial;letter-spacing:.14em}.statusBar,.ledgerStatus,.workspaceRail,.classroomTop{grid-column:1/-1;display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid currentColor}',
 '.appPanel,.researchBoard,.workspaceModules,.specSheet,.courseCards,.serviceVisual{background:var(--paper);color:var(--ink);border-radius:var(--radius);padding:32px;display:flex;flex-direction:column;justify-content:center;gap:25px}.appPanel strong,.researchBoard>span,.specSheet strong{font-size:12px}.productDetail{border-top:1px solid #778;padding-top:15px}.productDetail h2{font:600 40px var(--display)}',
 '.posterStage,.nightStage{background:var(--ink);color:var(--paper)}.posterStage .heroWords a,.nightStage .heroWords a{background:var(--accent);color:var(--ink)}.posterRibbon{padding:25px;background:var(--accent);color:var(--ink);font:900 23px var(--display);text-align:center}',
 '.tableStage,.gardenScene,.poppyScene,.recordSleeve{padding:45px 5vw;gap:5vw}.tableInvitation,.recordLabel{grid-column:1/-1;border-bottom:1px solid currentColor;padding:12px}.tableStage .heroFigure,.recordSleeve .heroFigure,.poppyScene .heroFigure{border-radius:var(--radius)}',
 '.planBoard{background:var(--ink);color:var(--paper);padding:5vw;gap:2vw}.planBoard>span{grid-column:1/-1}.planBoard .heroWords{padding:4vw 0}.planBoard .heroWords a{background:var(--accent);color:var(--ink)}',
 '.gardenHalo{position:absolute;border:2px solid var(--accent);width:260px;height:260px;border-radius:50%;right:10%;top:12%;pointer-events:none}.residenceView .heroWords{padding:7vw}.residenceText{align-self:center}.sitePlans>div{margin-top:30px}.classroomTop{margin-bottom:8px}',
 '.carePaths .interactive button,.petPaths .interactive button,.stageList .interactive button{border-radius:var(--radius)}.poppyScene{background:#fff8f1}.drawingStage,.siteBuilding{padding:4vw}.siteBuilding .heroFigure{grid-column:1;grid-row:1/3}.siteBuilding .heroWords{grid-column:2}.siteMarker{grid-column:2;align-self:end}',
 '.recordSleeve .heroFigure{border-radius:50%;aspect-ratio:1/1;align-self:center}.recordSleeve .heroFigure img{aspect-ratio:1/1;min-height:0}.trackList .interactive{flex-direction:column}.trackList .interactive button{min-height:65px;flex-direction:row;align-items:center;border-top:1px solid #777;border-bottom:0}',
 '.nightStage{padding:5vw}.nightStage .lineupTicker{grid-column:1/-1}.nightStage .heroFigure img{min-height:500px}.orbitHome{border-bottom:5px solid var(--accent)}',
 '.archivePage,.servicePage{padding:80px 7vw 110px}.sectionTitle{max-width:1150px;padding-bottom:60px}.sectionTitle small{font:800 11px Arial;letter-spacing:.15em}.sectionTitle h1{font:700 clamp(52px,8vw,126px)/1 var(--display);letter-spacing:-.075em;margin:25px 0}.sectionTitle p{max-width:50ch;font-size:16px}',
 '.catalogGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.artifact{min-width:0;display:block}.artifact img{width:100%;aspect-ratio:4/5;object-fit:cover}.artifact:nth-child(2){margin-top:10vw}.artifact small{font-size:10px;letter-spacing:.1em}.artifact h2{font:600 clamp(24px,2.9vw,41px)/1.15 var(--display)}.artifact p{font-size:14px}',
 '.detailPage{padding:60px 7vw 110px}.detailPage>a{font-size:12px;text-decoration:underline}.detailPage>small{display:block;margin-top:45px;font:750 10px Arial}.detailPage h1{font:700 clamp(52px,9vw,145px)/.98 var(--display);letter-spacing:-.08em;max-width:13ch}.detailPage>p{font-size:20px;max-width:50ch}.detailPage figure{margin:60px 0}.detailPage img{width:100%;height:min(67vh,750px);object-fit:cover}.detailPage figcaption{font-size:10px;padding:15px 0}.detailPair{display:grid;grid-template-columns:1fr 2fr;border-block:1px solid currentColor;gap:12px;padding:30px 0;max-width:1000px}.detailPair span{font-size:11px;letter-spacing:.12em}.detailPair p{margin:0 0 30px;font-size:17px}',
 '.serviceSequence{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.serviceSequence button{min-height:225px;text-align:left;background:transparent;color:inherit;border:1px solid currentColor;padding:23px;display:flex;flex-direction:column;gap:20px}.serviceSequence button[aria-pressed="true"]{background:var(--accent);color:var(--ink)}.serviceSequence button span{font-size:11px}.serviceSequence button strong{font:600 30px var(--display)}.serviceSequence button p{font-size:13px}.serviceVisual{display:grid;grid-template-columns:1fr auto;margin-top:35px;min-height:400px}.serviceVisual img{width:100%;max-height:580px;object-fit:cover}.serviceVisual figcaption{writing-mode:vertical-rl;font-size:10px;letter-spacing:.12em}',
 '.aboutPage{padding:100px 7vw;display:grid;grid-template-columns:1fr 1fr;gap:5vw}.aboutCopy small{font-size:11px}.aboutCopy h1{font:700 clamp(52px,7vw,110px)/1 var(--display);letter-spacing:-.07em}.aboutCopy p{font-size:18px;line-height:1.7}.aboutMedia img{width:100%;min-height:500px;object-fit:cover}.aboutMedia span{display:block;font-size:10px;letter-spacing:.12em;margin-top:20px}',
 '.contactPage{padding:95px 7vw 130px;display:grid;grid-template-columns:1fr 1fr;gap:7vw}.contactIntro small{font-size:11px;letter-spacing:.12em}.contactIntro h1{font:700 clamp(48px,7vw,110px)/1 var(--display);letter-spacing:-.07em}.contactIntro p{font-size:17px;max-width:43ch}.contactPage form{padding:35px;background:var(--ink);color:var(--paper);display:flex;flex-direction:column;gap:25px;align-self:start}.contactPage label{font-size:11px;letter-spacing:.1em;font-weight:800}.contactPage textarea{min-height:230px;padding:20px;border:1px solid #aaa;background:var(--paper);color:var(--ink);resize:vertical}.contactPage form button{background:var(--accent);color:var(--ink);border:0;padding:17px;min-height:48px;font-weight:800}.contactPage form p{font-size:11px}',
 '.footer{background:var(--ink);color:var(--paper);padding:70px 6vw 30px;min-height:450px}.footerSignature{font:800 clamp(63px,11vw,170px)/.94 var(--display);letter-spacing:-.08em;padding:25px 0;border-bottom:1px solid #ffffff57;overflow-wrap:anywhere}.footerTop{display:flex;align-items:start;justify-content:space-between;gap:22px}.footerTop strong{font:750 clamp(34px,5vw,80px) var(--display)}.footerTop a{font-size:13px;text-decoration:underline}.footerColumns{display:grid;grid-template-columns:1.5fr 1fr;gap:40px;padding:35px 0}.footerMenu{display:flex;gap:20px;flex-wrap:wrap;padding:25px 0}.footerMenu a{font-size:13px}.footer>small{font-size:9px;letter-spacing:.12em}',
 '@media(max-width:850px){.header{grid-template-columns:1fr auto!important;min-height:72px!important}.header nav,.headStatus,.topIndex,.actionHead{display:none!important}.hamburger{display:flex;justify-self:end}.editorialCover,.productBoard,.posterStage,.tableStage,.planBoard,.gardenScene,.residenceView,.learningSpace,.poppyScene,.drawingStage,.marketDesk,.siteBuilding,.recordSleeve,.nightStage{grid-template-columns:1fr!important;min-height:0!important;gap:12px!important}.heroWords{padding:70px 7vw}.heroWords h1{font-size:clamp(50px,11vw,83px)}.heroFigure{max-height:65vh}.heroFigure img{min-height:320px}.productBoard,.marketDesk,.orbitHome,.learningSpace{padding:3vw}.productBoard .heroWords,.marketDesk .heroWords,.orbitHome .heroWords,.learningSpace .heroWords{padding:45px 6vw}.issueContents,.posterLineup,.menuBoard,.newspaperColumns,.sitePlans,.carePaths,.spaceSelector,.petPaths,.constructionSteps,.trackList,.stageList{padding:70px 7vw}.imageEssay,.learningPicture,.industrialPhoto,.evidenceBlock,.workspaceIllustration{grid-template-columns:1fr;padding:60px 7vw}.catalogGrid{grid-template-columns:1fr 1fr}.serviceSequence{grid-template-columns:1fr}.aboutPage,.contactPage{grid-template-columns:1fr}.siteBuilding .heroFigure,.siteBuilding .heroWords,.siteMarker{grid-column:auto;grid-row:auto}.gardenHalo{width:135px;height:135px}.residenceView .heroWords{padding:60px 7vw}}',
 '@media(max-width:540px){.root{font-size:14px}.header{padding:12px 6vw}.logo{font-size:27px}.heroWords{padding:65px 7vw}.heroWords h1{font-size:clamp(52px,12vw,72px)}.heroWords p{font-size:15px}.heroFigure{height:420px}.heroFigure img{height:420px}.interactive{flex-direction:column}.interactive button{min-height:70px;gap:9px}.heroWords a{font-size:10px}.posterRibbon{font-size:15px}.archivePage,.servicePage{padding:65px 6vw}.catalogGrid{grid-template-columns:1fr}.artifact:nth-child(2){margin-top:0}.artifact img{max-height:490px}.sectionTitle h1{font-size:54px}.detailPage{padding:55px 6vw}.detailPage h1{font-size:54px}.detailPair{grid-template-columns:1fr}.aboutPage,.contactPage{padding:70px 6vw}.aboutCopy h1,.contactIntro h1{font-size:54px}.aboutMedia img{min-height:270px}.footer{padding:60px 7vw}.footerSignature{font-size:clamp(45px,13vw,80px)}.footerColumns{grid-template-columns:1fr}.footerTop{display:block}.footerMenu{display:grid;grid-template-columns:1fr 1fr}.serviceVisual{grid-template-columns:1fr}.serviceVisual figcaption{writing-mode:horizontal-tb}.menuPanel{padding:38px 24px}}',
 '@media(prefers-reduced-motion:reduce){.root *, .root *::before,.root *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}'
 ];
 return css.join("\n").replaceAll("align-items:start","align-items:flex-start");
}
for(const st of entries){
 const dir="templates/"+st.slug+"/src/";
 write(dir+"components/Site.tsx",makeSite(st));
 write(dir+"components/"+st.variant+"-sovereign.module.css",cssFor(st));
 const path=join(root,dir+"app/layout.tsx");const old=readFileSync(path,"utf8");
 write(dir+"app/layout.tsx",old.replace('import "./globals.css";\n',"").replace("<body>{children}</body>","<body style={{margin:0}}>{children}</body>"));
 write(dir+"app/work/[item]/page.tsx",'import {notFound} from "next/navigation";\nimport {Site} from "../../../components/Site";\nexport function generateStaticParams(){return [1,2,3].map(item=>({item:String(item)}));}\nexport default async function Detail({params}:{params:Promise<{item:string}>}){const {item}=await params;if(!["1","2","3"].includes(item))notFound();return <Site section="detail" itemIndex={Number(item)}/>;}\n');
 console.log("AUTHORED",st.slug,st.layout,st.parts.length);
}
