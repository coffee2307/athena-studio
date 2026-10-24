"use client";

import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useRef, useState} from "react";
import {ImmersiveScene} from "@/components/immersive/ImmersiveScene";

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
    kicker: "14 / AUTOMOTIVE MOTION",
    title: "Chuyển động\ntrước cả bánh xe.",
    intro: "Một mẫu xe concept nguyên bản trong phòng trưng bày kỹ thuật số.",
    image: "/template-demos/auto-showroom/image-5.jpg",
    chapters: [
      {eyebrow: "01 — ÁNH SÁNG", title: "Một đường nét đầu tiên.", description: "Ánh sáng di chuyển trên bề mặt thân xe trong không gian tối, nhấn mạnh hình dáng nguyên khối.", detail: "Light · Silhouette"},
      {eyebrow: "02 — THIẾT KẾ", title: "Hình khối có chủ đích.", description: "Màu sơn chuyển thành bạc khói, phần mui và bề mặt xe thay đổi khi góc nhìn dịch chuyển.", detail: "Bodywork · Design"},
      {eyebrow: "03 — HIỆU NĂNG", title: "Khác biệt từ chi tiết.", description: "Chuyển sang sắc đỏ thể thao và thay đổi chi tiết ngoại thất để khám phá biến thể hiệu năng.", detail: "Performance · Form"},
    ],
  },
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));

export function ImmersiveJourney({slug}: {slug: World}) {
  const story = stories[slug];
  const [chapter, setChapter] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [progress, setProgress] = useState(0);
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
      setProgress(previous => Math.abs(previous - current) >= 0.004 ? current : previous);
      setChapter(Math.min(2, Math.floor(current * 3)));
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
  }, []);

  const jump = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.getBoundingClientRect().top + window.scrollY +
      Math.max(1, track.offsetHeight - window.innerHeight) * (index / 3 + 0.025);
    // Native immediate scroll removes asynchronous smooth-scroll races and
    // preserves deterministic chapter/camera state on low-end devices.
    window.scrollTo({top: target, behavior: "instant"});
  }, []);

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
        <ImmersiveScene slug={slug} preset={chapter} enabled={enabled} scrollRootId={rootId}/>
        <div className="journey-vignette" aria-hidden="true"/>
        <div className="journey-frame-corner journey-frame-corner-tl"/>
        <div className="journey-frame-corner journey-frame-corner-br"/>
        <div className="journey-stage-head"><span>IMMERSIVE STUDY / {story.brand}</span>
          <button type="button" aria-pressed={enabled ? "true" : "false"} aria-label={enabled ? "TẮT 3D" : "BẬT 3D"} onClick={() => setEnabled(value => !value)}>{enabled ? "TẮT 3D" : "BẬT 3D"}</button>
        </div>
        <div className="journey-stage-foot" aria-hidden="true">
          <span>SCROLL / DISCOVER</span>
          <div className="journey-progress"><div style={{transform: "scaleX(" + progress.toFixed(4) + ")"}}/></div>
          <span>{String(chapter + 1).padStart(2,"0")} / 03</span>
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
      <span>END OF STUDY / 03</span>
      <h2>Thiết kế để được trải nghiệm.</h2>
      <p>Đây là mô hình 3D tương tác thử nghiệm của Athena Studio. Các thành phần và chức năng thương mại chỉ mang tính minh họa.</p>
      <div><Link href={"/template-demos/" + slug}>Trở lại website mẫu ↗</Link><Link href={"/contact?service=web-development&template=" + slug}>Yêu cầu tùy biến ↗</Link></div>
    </section>
  </main>;
}
