"use client";
import {useEffect} from "react";
/** Black Velocity's own editorial reveal system. Never transforms the 3D canvas. */
export function BlackVelocityMotion({section}:{section:string}){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('[data-world="auto-showroom"]');
  if(!root||!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const items=Array.from(root.querySelectorAll<HTMLElement>(".ix-manifesto>h2,.ix-series-heading,.ix-ending>h2,.bv-mobile-scene>h2,.bv-mobile-scene>p"));
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){(entry.target as HTMLElement).dataset.bvReveal="seen";observer.unobserve(entry.target)}},{threshold:.12,rootMargin:"0px 0px -32px 0px"});
  for(const item of items){if(item.getBoundingClientRect().top<innerHeight*.88){item.dataset.bvReveal="seen";continue;}item.dataset.bvReveal="pending";observer.observe(item);}
  return()=>{observer.disconnect();for(const item of items)delete item.dataset.bvReveal};
 },[section]);
 return null;
}