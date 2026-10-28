"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useRef, useState} from "react";
import {WorldScene} from "@/components/immersive/WorldScene";
import {ModelAttribution} from "@/components/immersive/ModelAttribution";

type World = "creative-studio" | "architecture-studio" | "auto-showroom";
type Chapter = {eyebrow: string; title: string; description: string; detail: string};
type Story = {brand: string; kicker: string; title: string; intro: string; image: string; chapters: readonly Chapter[]};

const stories: Record<World, Story> = {
  "creative-studio": {
    brand: "SORA / STUDIO",
    kicker: "01 / SPATIAL GALLERY",
    title: "Một ý tưởng.\nBa chiều không gian.",
    intro: "Không gian triển lãm số, nơi hình khối, chuyển động và nhận diện giao nhau.",
    image: "/template-demos/creative-studio/image-1.jpg",
    chapters: [
      {eyebrow: "01 — HÌNH KHỐI", title: "Ngôn ngữ của hình.", description: "Các vòng điêu khắc nổi trong không gian. Quan sát ánh sáng đi qua vật liệu và cách chuyển động tạo nên bản sắc.", detail: "Identity · Shape · Material"},
      {eyebrow: "02 — BỐ CỤC", title: "Thay đổi điểm nhìn.", description: "Kéo xuống để mô hình chuyển thành cấu trúc mới. Góc máy tiến gần, tiết lộ mối quan hệ giữa các khối hình.", detail: "Composition · Perspective"},
      {eyebrow: "03 — CHUYỂN ĐỘNG", title: "Sáng tạo có nhịp điệu.", description: "Hình khối và ánh sáng biến đổi theo từng chương. Từ phác thảo đến một trải nghiệm thương hiệu có chiều sâu.", detail: "Motion · Interaction"},
    ],
  },
  "architecture-studio": {
    brand: "MỘC / ARCHITECTURE",
    kicker: "09 / SPATIAL STUDY",
    title: "Không gian\nđược kể bằng ánh sáng.",
    intro: "Một mô hình kiến trúc tương tác: quan sát tổng thể, mở công trình và khám phá kết cấu.",
    image: "/template-demos/architecture-studio/image-5.jpg",
    chapters: [
      {eyebrow: "01 — TỔNG THỂ", title: "Tỷ lệ và cân bằng.", description: "Một công trình có mái, sàn, cột và khối bao che. Góc nhìn được dựng trong không gian 3D thực.", detail: "Mass · Proportion"},
      {eyebrow: "02 — MỞ KHÔNG GIAN", title: "Lớp không gian ẩn.", description: "Mái nâng lên, lớp mặt đứng rời khỏi công trình. Các thành phần cấu trúc được trình bày theo tiến trình.", detail: "Reveal · Circulation"},
      {eyebrow: "03 — KẾT CẤU", title: "Từng chi tiết tạo nên tổng thể.", description: "Phân lớp cấu tạo để dễ hình dung cách sàn, cột và vật liệu liên kết với nhau.", detail: "Structure · Material"},
    ],
  },
  "auto-showroom": {
    brand: "VELAR / CONCEPT",
    kicker: "BLACK VELOCITY / FIVE PERSPECTIVES",
    title: "PRECISION\nIN MOTION.",
    intro: "Năm góc nhìn về một nghiên cứu siêu xe đen–cam: bề mặt carbon, tỷ lệ thấp và khí động học. Cuộn hoặc chọn từng chương để điều khiển camera.",
    image: "/template-demos/auto-showroom/image-5.jpg",
    chapters: [
      {eyebrow: "01 — THE REVEAL", title: "Born for the edge.", description: "Chiếc McLaren concept xuất hiện qua những vệt sáng studio tiết chế, phô bày tỷ lệ tổng thể và đường viền khí động học.", detail: "Silhouette · Studio lighting"},
      {eyebrow: "02 — SIDE PROFILE", title: "A line of intent.", description: "Quan sát thân xe thấp và dài từ một góc nhìn mới. Kéo để xoay xe, hoặc tiếp tục cuộn để đi sâu vào hình khối.", detail: "Proportion · Motion"},
      {eyebrow: "03 — MATERIAL STUDY", title: "Every surface counts.", description: "Camera tiến lại gần để thấy bề mặt graphite, các chi tiết carbon, bánh xe và ánh sáng phản xạ trên vật liệu gốc.", detail: "Graphite · Carbon · Detail"},
      {eyebrow: "04 — AERODYNAMICS", title: "Built around airflow.", description: "Đổi điểm nhìn để khám phá cánh gió, những đường dẫn khí và kết cấu phần thân sau của mô hình.", detail: "Aero · Rear profile"},
      {eyebrow: "05 — YOUR PERSPECTIVE", title: "Take another look.", description: "Trở lại góc toàn xe. Xoay để khám phá, chuyển sang trang bộ sưu tập hoặc xem trải nghiệm liên hệ giả lập.", detail: "Explore · Discover"},
    ],
  },
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));

export function ImmersiveJourney({slug}: {slug: World}) {
  const story = stories[slug];
  const chapterCount=story.chapters.length;
  const [chapter, setChapter] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const rootId = "athena-journey-" + slug;
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const extent = Math.max(1, rect.height - window.innerHeight);
      const current = clamp(-rect.top / extent);
      // Avoid rerendering the entire Three.js scene / React story tree per scroll.
      // Keep the progress meter and camera anchored to the same scroll snapshot.
      if(progressFillRef.current)progressFillRef.current.style.transform = "scaleX(" + current.toFixed(5) + ")";
      setChapter(Math.min(chapterCount-1, Math.floor(current * chapterCount)));
    };
    const schedule = () => {if (!raf) raf = requestAnimationFrame(update);};
    update();
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapterCount]);

  const jump = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.getBoundingClientRect().top + window.scrollY +
      Math.max(1, track.offsetHeight - window.innerHeight) * (index / chapterCount + 0.005);
    // Native immediate scroll removes asynchronous smooth-scroll races and
    // preserves deterministic chapter/camera state on low-end devices.
    window.scrollTo({top: target, behavior: "instant"});
  }, [chapterCount]);

  return <main id="main-content" className={"athena-journey athena-journey-" + slug}>
    <div className="journey-topline">
      <Link href={"/template-demos/" + slug} aria-label="Quay lại website mẫu">← TRỞ VỀ WEBSITE MẪU</Link>
      <span>ATHENA / IMMERSIVE WORLDS</span>
    </div>
    <section className="journey-intro" aria-labelledby="journey-title">
      <div><span>{story.kicker}</span><h1 id="journey-title">{story.title}</h1></div>
      <p>{story.intro}</p>
      <a href={"#" + rootId} className="journey-enter">BẮT ĐẦU KHÁM PHÁ <span aria-hidden="true">↓</span></a>
    </section>
    <section className="journey-scroll" ref={trackRef} id={rootId} aria-label="Hành trình 3D theo cuộn trang">
      <div className="journey-stage">
        <div className="journey-backdrop"><Image src={story.image} alt="" fill priority sizes="100vw"/></div>
        <WorldScene slug={slug} preset={chapter} enabled={enabled} scrollRootId={rootId} onRequestFallback={()=>setEnabled(false)}/>
        <div className="journey-vignette" aria-hidden="true"/>
        <div className="journey-frame-corner journey-frame-corner-tl"/>
        <div className="journey-frame-corner journey-frame-corner-br"/>
        <div className="journey-stage-head"><span>IMMERSIVE STUDY / {story.brand}</span>
          <button type="button" aria-pressed={enabled ? "true" : "false"} aria-label={enabled ? "TẮT 3D" : "BẬT 3D"} onClick={() => setEnabled(value => !value)}>{enabled ? "TẮT 3D" : "BẬT 3D"}</button>
        </div>
        <div className="journey-stage-foot" aria-hidden="true">
          <span>SCROLL / DISCOVER</span>
          <div className="journey-progress"><div ref={progressFillRef} style={{transform:"scaleX(0)"}}/></div>
          <span>{String(chapter + 1).padStart(2,"0")} / {String(chapterCount).padStart(2,"0")}</span>
        </div>
        <div className="journey-chapter-nav" role="group" aria-label="Di chuyển giữa các chương">
          {story.chapters.map((item, index) =>
            <button key={item.eyebrow} type="button" aria-label={"Đến chương " + (index + 1)} aria-current={chapter === index ? "step" : undefined}
              onClick={() => jump(index)}><span>{String(index + 1).padStart(2,"0")}</span></button>)}
        </div>
      </div>
      <div className="journey-steps">
        {story.chapters.map((item,index)=><section className="journey-step" key={item.eyebrow} aria-label={item.eyebrow}>
          <div className={"journey-step-copy" + (chapter === index ? " is-current" : "")}>
            <span>{item.eyebrow}</span><h2>{item.title}</h2><p>{item.description}</p>
            <small>{item.detail}</small>
          </div>
        </section>)}
      </div>
    </section>
    <section className="journey-outro">
      <span>END OF STUDY / {String(chapterCount).padStart(2,"0")}</span>
      <h2>{slug==="auto-showroom"?"YOUR NEXT PERSPECTIVE.":"Thiết kế để được trải nghiệm."}</h2>
      <p>Đây là mô hình 3D tương tác thử nghiệm của Athena Studio. Các thành phần và chức năng thương mại chỉ mang tính minh họa.</p>
      {slug==="auto-showroom"&&<ModelAttribution/>}
      <div><Link href={"/template-demos/" + slug}>Trở lại website mẫu ↗</Link><Link href={"/contact?service=web-development&template=" + slug}>Yêu cầu tùy biến ↗</Link></div>
    </section>
  </main>;
}
