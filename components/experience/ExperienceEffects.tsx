"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
export function ExperienceEffects(){
 const cursorRef=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 useEffect(()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine=window.matchMedia("(hover: hover) and (pointer: fine)");
  const doc=document.documentElement;
  let frame=0;
  const observers:IntersectionObserver[]=[];
  if(!reduced.matches&&"IntersectionObserver" in window){
   const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target);}});},{threshold:.07,rootMargin:"0px 0px 40px 0px"});
   document.querySelectorAll(".reveal").forEach(node=>{node.classList.remove("is-visible");observer.observe(node);});
   observers.push(observer);
   doc.classList.add("reveal-ready");
  }
  const move=(e:PointerEvent)=>{
   if(!fine.matches||reduced.matches||!cursorRef.current)return;
   cancelAnimationFrame(frame);
   const x=e.clientX,y=e.clientY;
   frame=requestAnimationFrame(()=>{if(!cursorRef.current)return;cursorRef.current.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    cursorRef.current.classList.add("cursor-visible");
    cursorRef.current.classList.toggle("cursor-active",e.target instanceof Element&&Boolean(e.target.closest("a,button,input,textarea,select")));
   });
  };
  document.addEventListener("pointermove",move,{passive:true});
  return()=>{observers.forEach(o=>o.disconnect());doc.classList.remove("reveal-ready");cancelAnimationFrame(frame);document.removeEventListener("pointermove",move);};
 },[pathname]);
 return <div ref={cursorRef} className="athena-cursor" aria-hidden="true"/>;
}
