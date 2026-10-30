import Image from "next/image";
import Link from "next/link";
export function AthenaHeroStage(){
 return <div className="dna-hero-art" aria-label="Những giao diện website mẫu thực tế do Athena thiết kế">
  <div className="dna-hero-glow" aria-hidden="true"/>
  <div className="dna-hero-window dna-hero-window-primary">
   <div className="dna-hero-browser"><span><i/><i/><i/></span><small>creative-studio / preview</small></div>
   <div className="dna-hero-window-picture"><Image src="/template-previews/creative-studio.jpg" alt="Bản xem trước website Creative Studio" fill priority sizes="(max-width:760px) 90vw, 42vw" style={{objectFit:"contain",objectPosition:"center top"}}/></div>
  </div>
  <div className="dna-hero-window dna-hero-window-secondary" aria-hidden="true">
   <div className="dna-hero-browser"><span><i/><i/><i/></span><small>site / design</small></div>
   <div className="dna-hero-window-picture"><Image src="/template-previews/fashion-archive.jpg" alt="" fill sizes="(max-width:760px) 35vw, 18vw" style={{objectFit:"cover",objectPosition:"center top"}}/></div>
  </div>
  <div className="dna-hero-art-bottom"><span>CONCEPT → EXPERIENCE</span><Link href="/services/web-development/templates">Xem website mẫu <span aria-hidden="true">→</span></Link></div>
 </div>;
}
