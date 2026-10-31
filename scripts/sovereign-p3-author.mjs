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
function words(s){return JSON.stringify(s);}
function makeSection(st,which){const cls=st.variant+"_"+which;
 const [a,b,c]=st.parts;
 if(which==="work")return '<section className={style.archivePage}><div className={style.sectionTitle}><small>'+words(st.kicker)+'</small><h1>'+words(st.parts[0]+' / '+st.parts[1])+'</h1><p>'+words(st.description)+'</p></div><div className={style.catalogGrid}>{artifacts.map((item,i)=><Link key={item.title} href={go("/work/"+(i+1))} className={style.artifact}><img src={media[i%media.length]} alt={item.title}/><small>0{i+1} / '+st.variant.toUpperCase()+'</small><h2>{item.title}</h2><p>{item.description}</p></Link>)}</div></section>';
 if(which==="detail")return '<article className={style.detailPage}><Link href={go("/work")}>← BACK TO INDEX</Link><small>FILE / 0{itemIndex}</small><h1>{artifacts[(itemIndex-1)%3].title}</h1><p>{artifacts[(itemIndex-1)%3].description}</p><figure><img src={media[(itemIndex-1)%media.length]} alt="Illustrative case material"/><figcaption>VISUAL STUDY / DEMONSTRATION MATERIAL</figcaption></figure><div className={style.detailPair}><span>CONTEXT</span><p>'+words(st.description)+'</p><span>PROCESS</span><p>Trình bày phương pháp minh họa. Không phải hồ sơ dự án đã thực hiện cho khách hàng.</p></div><Link href={go("/contact")}>START A CONVERSATION →</Link></article>';
 if(which==="services")return '<section className={style.servicePage}><div className={style.sectionTitle}><small>THE PRACTICE / 01—03</small><h1>'+words(st.parts.join(' / '))+'</h1><p>'+words(st.description)+'</p></div><div className={style.serviceSequence}>{artifacts.map((item,i)=><button key={item.title} onClick={()=>setSelected(i)} aria-pressed={selected===i}><span>0{i+1}</span><strong>{item.title}</strong><p>{item.description}</p></button>)}</div><figure className={style.serviceVisual}><img src={media[selected%media.length]} alt={artifacts[selected].title}/><figcaption>{artifacts[selected].title} / SELECTED DISCIPLINE</figcaption></figure></section>';
 if(which==="about")return '<section className={style.aboutPage}><div className={style.aboutCopy}><small>ABOUT / '+st.variant.toUpperCase()+'</small><h1>'+words(st.headline)+'</h1><p>'+words(st.description)+'</p><p>Đây là thương hiệu khái niệm trong thư viện Athena Studio. Nội dung và hình ảnh minh họa không được trình bày là thành tích của khách hàng thật.</p></div><div className={style.aboutMedia}><img src={media[3%media.length]} alt="Illustrative brand material"/><span>THE PRINCIPLES / 2026</span></div></section>';
 return '<section className={style.contactPage}><div className={style.contactIntro}><small>INQUIRY / '+st.variant.toUpperCase()+'</small><h1>'+words("Let’s talk about "+st.parts[0].toLowerCase()+".")+'</h1><p>'+words(st.description)+'</p></div><form onSubmit={e=>{e.preventDefault();window.location.href="mailto:hello@example.com?subject="+encodeURIComponent('+words(st.brand+" / enquiry")+')+"&body="+encodeURIComponent(inquiry)}}><label htmlFor="independent-inquiry-'+st.slug+'">YOUR MESSAGE</label><textarea id="independent-inquiry-'+st.slug+'" required minLength={10} value={inquiry} onChange={e=>setInquiry(e.target.value)} placeholder="Mô tả nhu cầu của bạn…"/><button type="submit">MỞ ỨNG DỤNG EMAIL →</button><p>Website demo không thu thập hoặc gửi dữ liệu đến máy chủ.</p></form></section>';
}
