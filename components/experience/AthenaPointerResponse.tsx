"use client";
import {useEffect} from "react";
const selectors=".template-card-preview,.home-demo-picture,.dna-library-frame-media";
export function AthenaPointerResponse(){
 useEffect(()=>{
  if(matchMedia("(prefers-reduced-motion: reduce)").matches||matchMedia("(pointer: coarse)").matches)return;
  let frame=0;let pending:{node:HTMLElement;x:number;y:number}|null=null;
  const move=(event:PointerEvent)=>{
   const target=event.target instanceof Element?event.target.closest<HTMLElement>(selectors):null;
   if(!target)return;
   pending={node:target,x:event.clientX,y:event.clientY};
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    if(!pending)return;
    const {node,x,y}=pending;pending=null;
    const b=node.getBoundingClientRect();if(!b.width||!b.height)return;
    const nx=Math.max(-1,Math.min(1,((x-b.left)/b.width-.5)*2));
    const ny=Math.max(-1,Math.min(1,((y-b.top)/b.height-.5)*2));
    node.style.setProperty("--dna04-mx",((nx+1)*50).toFixed(1)+"%");
    node.style.setProperty("--dna04-my",((ny+1)*50).toFixed(1)+"%");
    node.style.setProperty("--dna04-rx",(-ny*3).toFixed(2)+"deg");
    node.style.setProperty("--dna04-ry",(nx*3).toFixed(2)+"deg");
   });
  };
  const out=(event:PointerEvent)=>{
   const node=event.target instanceof Element?event.target.closest<HTMLElement>(selectors):null;
   if(!node||node.contains(event.relatedTarget as Node))return;
   for(const name of ["--dna04-mx","--dna04-my","--dna04-rx","--dna04-ry"])node.style.removeProperty(name);
  };
  document.addEventListener("pointermove",move,{passive:true});
  document.addEventListener("pointerout",out,{passive:true});
  return()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerout",out);cancelAnimationFrame(frame)};
 },[]);
 return null;
}
