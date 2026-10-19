"use client";

import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";

const REVEAL_SELECTORS=[
 ".reveal",
 ".section-heading",
 ".section-index",
 ".intro-content",
 ".directory-row",
 ".offer-card",
 ".case-card",
 ".case-story-row",
 ".case-facts > div",
 ".product-copy",
 ".product-visual",
 ".method-item",
 ".legal-cards > a",
 ".legal-content > h2",
 ".legal-content > p",
 ".contact-box",
 ".studio-values > article",
 ".footer-statement",
 ".closing-inner > h2"
].join(",");

export function ExperienceEffects(){
 const cursorRef=useRef<HTMLDivElement>(null);
 const progressRef=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 useEffect(()=>{
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine=window.matchMedia("(hover: hover) and (pointer: fine)");
  const html=document.documentElement;
  const main=document.getElementById("main-content");
  let frame=0,scrollFrame=0;
  let io:IntersectionObserver|undefined;
  let mutations:MutationObserver|undefined;
  const observed=new WeakSet<Element>();

  const configure=()=>{
   io?.disconnect();
   mutations?.disconnect();
   html.classList.remove("reveal-ready");
   if(reduce.matches||!("IntersectionObserver" in window)||!main)return;

   io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
     if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      io?.unobserve(entry.target);
     }
    });
   },{threshold:.08,rootMargin:"0px 0px -44px 0px"});

   const scan=()=>{
    const nodes=main.querySelectorAll<HTMLElement>(REVEAL_SELECTORS);
    let i=0;
    nodes.forEach(node=>{
     if(observed.has(node))return;
     observed.add(node);
     node.classList.add("reveal");
     const bounding=node.getBoundingClientRect();
     // Elements already in view should appear immediately; below-the-fold elements
     // are observed and animate on entry. No content is hidden until JS is ready.
     if(bounding.top < window.innerHeight*.75){
      node.classList.add("is-visible");
     }else{
      node.style.setProperty("--reveal-delay",String((i%4)*85)+"ms");
      io?.observe(node);
     }
     i++;
    });
   };
   scan();
   html.classList.add("reveal-ready");
   mutations=new MutationObserver(scan);
   mutations.observe(main,{subtree:true,childList:true});
  };

  const onProgress=()=>{
   if(scrollFrame)return;
   scrollFrame=requestAnimationFrame(()=>{
    scrollFrame=0;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const fraction=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    progressRef.current?.style.setProperty("transform",`scaleX(${fraction.toFixed(4)})`);
   });
  };

  const onPointer=(e:PointerEvent)=>{
   if(!fine.matches||reduce.matches||!cursorRef.current)return;
   cancelAnimationFrame(frame);
   const x=e.clientX,y=e.clientY;
   frame=requestAnimationFrame(()=>{
    if(!cursorRef.current)return;
    cursorRef.current.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    cursorRef.current.classList.add("cursor-visible");
    cursorRef.current.classList.toggle("cursor-active",e.target instanceof Element&&Boolean(e.target.closest("a,button,input,textarea,select")));
   });
  };

  configure();
  onProgress();
  window.addEventListener("scroll",onProgress,{passive:true});
  window.addEventListener("resize",onProgress,{passive:true});
  document.addEventListener("pointermove",onPointer,{passive:true});
  reduce.addEventListener("change",configure);
  return()=>{
   io?.disconnect();mutations?.disconnect();
   html.classList.remove("reveal-ready");
   cancelAnimationFrame(frame);cancelAnimationFrame(scrollFrame);
   window.removeEventListener("scroll",onProgress);
   window.removeEventListener("resize",onProgress);
   document.removeEventListener("pointermove",onPointer);
   reduce.removeEventListener("change",configure);
  };
 },[pathname]);
 return <>
  <div className="scroll-progress" ref={progressRef} aria-hidden="true"/>
  <div ref={cursorRef} className="athena-cursor" aria-hidden="true"/>
 </>;
}
