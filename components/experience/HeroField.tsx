"use client";

import Image from "next/image";
import { type PointerEvent, useRef } from "react";

export function HeroField() {
  const root = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      root.current?.style.setProperty("--field-x", (x * 23).toFixed(2) + "px");
      root.current?.style.setProperty("--field-y", (y * 18).toFixed(2) + "px");
    });
  }
  function reset() {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    root.current?.style.setProperty("--field-x", "0px");
    root.current?.style.setProperty("--field-y", "0px");
  }

  return (
    <div className="intelligence-field" ref={root} onPointerMove={move} onPointerLeave={reset}
      role="img" aria-label="Đồ họa chuyển động lấy cảm hứng từ đôi mắt cú Athena và các đường hội tụ.">
      <div className="field-scan field-scan-a" aria-hidden="true" />
      <div className="field-scan field-scan-b" aria-hidden="true" />
      <svg viewBox="0 0 850 780" className="field-lines" role="presentation" aria-hidden="true" fill="none">
        <circle cx="425" cy="390" r="289" className="field-guide"/>
        <circle cx="425" cy="390" r="197" className="field-guide field-guide-dash"/>
        <circle cx="425" cy="390" r="363" className="field-outer"/>
        <path d="M38 390H812M425 3V777" className="field-axis"/>
        <path d="M70 255C235 255 255 366 425 390C595 366 615 255 780 255" className="field-arc field-arc-one"/>
        <path d="M70 525C235 525 255 414 425 390C595 414 615 525 780 525" className="field-arc field-arc-two"/>
        <path d="M126 121C254 183 319 276 425 390C531 276 596 183 724 121" className="field-secondary"/>
        <path d="M126 659C254 597 319 504 425 390C531 504 596 597 724 659" className="field-secondary"/>
        <g className="field-nodes">
          <circle cx="70" cy="255" r="3" /><circle cx="780" cy="255" r="3"/>
          <circle cx="70" cy="525" r="3" /><circle cx="780" cy="525" r="3"/>
          <circle cx="425" cy="101" r="3" /><circle cx="425" cy="679" r="3"/>
          <circle cx="136" cy="390" r="3" /><circle cx="714" cy="390" r="3"/>
        </g>
      </svg>
      <div className="field-emblem">
        <div className="emblem-circle">
          <Image src="/branding/logo-symbol-black.svg" alt="" width={430} height={430} priority className="field-owl"/>
        </div>
        <span className="field-coordinate field-coordinate-tl" aria-hidden="true">01 / QUAN SÁT</span>
        <span className="field-coordinate field-coordinate-br" aria-hidden="true">02 / KIẾN TẠO</span>
      </div>
      <div className="field-side-note" aria-hidden="true">HÌNH THÁI / CHUYỂN ĐỘNG / TƯ DUY</div>
      <span className="field-cross field-cross-one" aria-hidden="true">+</span>
      <span className="field-cross field-cross-two" aria-hidden="true">+</span>
      <span className="field-cross field-cross-three" aria-hidden="true">+</span>
    </div>
  );
}
