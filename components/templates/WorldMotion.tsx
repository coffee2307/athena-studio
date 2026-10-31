"use client";
import {useEffect} from "react";

/**
 * A single IntersectionObserver provides entry motion across the demo worlds.
 * It never runs a scroll handler and never animates the WebGL canvas or stage.
 * Content remains visible without JavaScript or when reduced motion is set.
 */
export function WorldMotion({slug,section}:{slug:string;section:string}){
 useEffect(()=>{
  const root=document.getElementById("world-top");
  if(!root || !("IntersectionObserver" in window))return;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(reduce.matches)return;
  const selectors=[
   ".world-home-intro-text",".world-section-heading",".world-work-card",
   ".world-service-row",".world-visual-essay .world-essay-copy",
   ".world-visual-essay .world-essay-photo",".world-closing h2",
   ".world-about-hero>div",".world-page-heading",".world-footer-identity",
   ".world-footer-column",".world-footer-bottom",
   ".signature-section-head",".signature-pets-grid>article",
   ".signature-industrial-grid>article",".signature-concert-intro",
   ".legacy-creative-intro",".legacy-saas-feature",".legacy-architecture-index",
   ".experience-section-head",".experience-product-grid>article",
   ".experience-platform-feature",".experience-story-excerpt",
   ".ix-manifesto>h2",".ix-series-heading",".ix-ending>h2"
  ].join(",");
  const nodes=Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(el=>!el.closest(".world-mobile-nav,.world-nav-scrim,.bv-cinematic-track"));
  const io=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const element=entry.target as HTMLElement;
    element.dataset.worldReveal="seen";
    io.unobserve(element);
   }
  },{threshold:.075,rootMargin:"0px 0px -48px 0px"});
  for(const [index,node] of nodes.entries()){
   if(node.getBoundingClientRect().top<window.innerHeight*.92){
    node.dataset.worldReveal="seen";
    continue;
   }
   node.style.setProperty("--world-motion-stagger",String(Math.min(index%4,3)*55)+"ms");
   node.dataset.worldReveal="pending";
   io.observe(node);
  }
  return()=>{io.disconnect();for(const node of nodes){delete node.dataset.worldReveal;node.style.removeProperty("--world-motion-stagger");}};
 },[slug,section]);
 return null;
}
