import type {Metadata} from "next";
import Link from "next/link";
export const metadata:Metadata={title:"Digital Creators — Immersive 3D | Athena Studio",description:"Bản demo Digital Creators với câu chuyện Rubik 3D, nét cọ và thành phố khối lắp ghép.",robots:{index:false,follow:false}};
type Props={searchParams:Promise<{embed?:string}>};
export default async function DigitalCreatorsDemo({searchParams}:Props){
 const {embed}=await searchParams;
 return <main className={"digital-creators-embed"+(embed==="1"?" is-embedded":"")} id="main-content">
  {embed!=="1"&&<div className="digital-creators-header"><div><span>ATHENA / DEMO 21</span><h1>Digital Creators</h1><p>Không gian sáng tạo số — trải nghiệm website tương tác 3D.</p></div><Link href="/services/web-development/templates">Trở về thư viện ↗</Link></div>}
  <iframe src="/immersive/digital-creators/index.html" title="Website Digital Creators với Rubik 3D, tranh và thành phố khối" loading="eager" allow="fullscreen" referrerPolicy="same-origin"/>
  {embed!=="1"&&<div className="digital-creators-credit">Website giới thiệu đề xuất CLB, các hoạt động và biểu mẫu chỉ mang tính mô phỏng. <a href="https://github.com/coffee2307/digital-creators" target="_blank" rel="noopener noreferrer">Nguồn dự án ↗</a></div>}
 </main>;
}