"use client";
import {useEffect,type ReactNode} from "react";
import localeData from "@/data/template-locales.json";

type Locale="vi"|"en";
const excluded=new Set(["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"]);
const dictionary=localeData as {vi:Record<string,string>;en:Record<string,string>};
const storageKey="athena-studio-language";
const attrs=["placeholder","aria-label","title","alt","aria-description"] as const;
type Saved={original:string;rendered:string};

function useTemplateLocale(slug:string){
 useEffect(()=>{
  if(excluded.has(slug))return;
  const root=document.querySelector<HTMLElement>(".template-demo-main");
  if(!root)return;
  const query=new URLSearchParams(window.location.search).get("lang");
  let lang:Locale=query==="vi"||query==="en"?query:"vi";
  if(query!=="vi"&&query!=="en"){
   try{const value=localStorage.getItem(storageKey);if(value==="vi"||value==="en")lang=value;}catch{}
  }
  root.lang=lang;root.dataset.templateLanguage=lang;
  document.documentElement.lang=lang;
  const entries=dictionary[lang];
  const nodeMemo=new WeakMap<Text,Saved>();
  const attrMemo=new WeakMap<Element,Map<string,Saved>>();
  const text=(source:string)=>{
   const trimmed=source.trim();
   if(!trimmed)return source;
   const target=entries[trimmed];
   if(!target||target===trimmed)return source;
   const offset=source.indexOf(trimmed);
   return source.slice(0,offset)+target+source.slice(offset+trimmed.length);
  };
  function translateText(node:Text){
   const parent=node.parentElement;
   if(!parent||parent.closest("script,style,noscript,svg,code,pre,[data-template-no-translate]"))return;
   const current=node.data,old=nodeMemo.get(node);
   const original=old&&old.rendered===current?old.original:current;
   const translated=text(original);
   if(translated!==current)node.data=translated;
   nodeMemo.set(node,{original,rendered:translated});
  }
  function translateElement(el:Element){
   if(el.matches("script,style,noscript,svg,code,pre,[data-template-no-translate]")||el.closest("[data-template-no-translate]"))return;
   let memo=attrMemo.get(el);if(!memo){memo=new Map();attrMemo.set(el,memo);}
   for(const attr of attrs){
    const current=el.getAttribute(attr);if(current===null)continue;
    const old=memo.get(attr);
    const original=old&&old.rendered===current?old.original:current;
    const translated=text(original);
    if(translated!==current)el.setAttribute(attr,translated);
    memo.set(attr,{original,rendered:translated});
   }
  }
  function scan(parent:Node){
   if(parent.nodeType===Node.TEXT_NODE){translateText(parent as Text);return;}
   if(parent.nodeType!==Node.ELEMENT_NODE&&parent.nodeType!==Node.DOCUMENT_NODE)return;
   const element=parent as Element;
   if(element.matches?.("script,style,noscript,svg,code,pre,[data-template-no-translate]"))return;
   if(parent.nodeType===Node.ELEMENT_NODE)translateElement(element);
   const walker=document.createTreeWalker(parent,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
   let node:Node|null;
   while((node=walker.nextNode())){
    if(node.nodeType===Node.TEXT_NODE)translateText(node as Text);
    else translateElement(node as Element);
   }
  }
  scan(root);
  let raf=0;const queue=new Set<Node>();
  const flush=()=>{
   raf=0;const changes=Array.from(queue);queue.clear();
   for(const node of changes)if(node.isConnected)scan(node);
  };
  const observer=new MutationObserver(records=>{
   for(const entry of records){
    if(entry.type==="childList")entry.addedNodes.forEach(node=>queue.add(node));
    else queue.add(entry.target);
   }
   if(queue.size&&!raf)raf=requestAnimationFrame(flush);
  });
  observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:[...attrs]});
  // If Athena changes language in another window, synchronize this preview.
  const onStorage=(event:StorageEvent)=>{
   if(event.key!==storageKey||!["vi","en"].includes(event.newValue??""))return;
   const next=event.newValue as Locale;
   const url=new URL(window.location.href);url.searchParams.set("lang",next);
   window.location.replace(url.toString());
  };
  window.addEventListener("storage",onStorage);
  return()=>{observer.disconnect();window.removeEventListener("storage",onStorage);if(raf)cancelAnimationFrame(raf);};
 },[slug]);
}
export function TemplateLocaleBridge({slug,children}:{slug:string;children:ReactNode}){
 useTemplateLocale(slug);
 return <>{children}</>;
}
