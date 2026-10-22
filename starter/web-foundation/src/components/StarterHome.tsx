import type {Preset} from "../config/presets";
type Props={name:string;preset:Preset;modules:readonly string[];contactEmail:string};
export function StarterHome({name,preset,modules,contactEmail}:Props){
 const hasContent=modules.includes("content")||modules.includes("catalog");
 const hasContact=modules.includes("contact")&&/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(contactEmail);
 const items=preset.entries.map(entry=><article key={entry.title}><span className="entry-label">{entry.label}</span><h3>{entry.title}</h3><p>{entry.text}</p></article>);
 return <main id="top" className={`page-shell template-${preset.variant}`}>
  <a className="skip-link" href="#noi-dung-chinh">Bỏ qua điều hướng</a>
  <header className="site-header"><a href="#top" aria-label={`${name} — đầu trang`}>{name}</a><nav aria-label="Điều hướng chính">{hasContent&&<a href="#noi-dung">{preset.sectionTitle}</a>}{hasContact&&<a href="#lien-he">Liên hệ</a>}</nav></header>
  <section id="noi-dung-chinh" className="hero" aria-labelledby="site-title"><p className="eyebrow">{preset.eyebrow}</p><h1 id="site-title">{preset.heading}</h1><p className="hero-intro">{preset.intro}</p>{hasContent?<a className="action" href="#noi-dung">Khám phá thêm <span aria-hidden="true">↗</span></a>:hasContact?<a className="action" href="#lien-he">Bắt đầu trao đổi <span aria-hidden="true">↗</span></a>:null}<div className="hero-mark" aria-hidden="true"><i/><i/><i/></div></section>
  {hasContent&&<section className="content" id="noi-dung" aria-labelledby="content-title"><p className="eyebrow">{name}</p><h2 id="content-title">{preset.sectionTitle}</h2>
   {preset.layout==="services"||preset.layout==="menu"?<dl className={`entries entries-${preset.layout}`}>{preset.entries.map(entry=><div key={entry.title}><dt><span className="entry-label">{entry.label}</span>{entry.title}</dt><dd>{entry.text}</dd></div>)}</dl>:preset.layout==="projects"||preset.layout==="agenda"?<ol className={`entries entries-${preset.layout}`}>{items.map((item,index)=><li key={preset.entries[index].title}>{item}</li>)}</ol>:<div className={`entries entries-${preset.layout}`}>{items}</div>}
  </section>}
  <footer>{hasContact&&<section id="lien-he" aria-labelledby="contact-title"><h2 id="contact-title">Cùng bắt đầu một cuộc trao đổi.</h2><a href={`mailto:${encodeURIComponent(contactEmail)}`}>{contactEmail}</a></section>}<div className="footer-line"><span>{name}</span><a href="#top">Về đầu trang ↑</a></div></footer>
 </main>;
}
