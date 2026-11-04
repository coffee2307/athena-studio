"use client";
import {createContext,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from "react";
import translations from "@/lib/athena-language-en.json";

export type AthenaLanguage="vi"|"en";
const storageKey="athena-studio-language";
type LanguageContext={language:AthenaLanguage;setLanguage:(next:AthenaLanguage)=>void};
const Context=createContext<LanguageContext|null>(null);
export function useAthenaLanguage(){
 const ctx=useContext(Context);
 if(!ctx)throw new Error("AthenaLanguageProvider required");
 return ctx;
}
const en=translations as Record<string,string>;
const attrNames=["placeholder","aria-label","title","alt"] as const;
type Memo={source:string;last:string};
const textMemo=new WeakMap<Text,Memo>();
const attrMemo=new WeakMap<Element,Map<string,Memo>>();
function translateLiteral(raw:string,lang:AthenaLanguage){
 const key=raw.trim();
 if(!key)return raw;
 const translated=lang==="en"?en[key]:undefined;
 if(!translated||translated===key)return raw;
 return raw.slice(0,raw.indexOf(key))+translated+raw.slice(raw.indexOf(key)+key.length);
}
function translateNode(text:Text,lang:AthenaLanguage){
 const parent=text.parentElement;
 if(!parent||parent.closest("script,style,noscript,pre,code,svg,[data-athena-no-translate],.template-demo-main"))return;
 const current=text.data,previous=textMemo.get(text);
 const source=previous&&current===previous.last?previous.source:current;
 const next=translateLiteral(source,lang);
 if(next!==current)text.data=next;
 textMemo.set(text,{source,last:next});
}
function translateElement(element:Element,lang:AthenaLanguage){
 if(element.closest("[data-athena-no-translate],.template-demo-main"))return;
 let cache=attrMemo.get(element);
 if(!cache){cache=new Map();attrMemo.set(element,cache);}
 for(const key of attrNames){
  const value=element.getAttribute(key);
  if(value===null)continue;
  const previous=cache.get(key);
  const source=previous&&value===previous.last?previous.source:value;
  const next=translateLiteral(source,lang);
  if(next!==value)element.setAttribute(key,next);
  cache.set(key,{source,last:next});
 }
}
function translateSubtree(root:Node,lang:AthenaLanguage){
 if(root.nodeType===Node.TEXT_NODE){translateNode(root as Text,lang);return;}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 const element=root as Element;
 if(element.matches?.("[data-athena-no-translate],.template-demo-main"))return;
 if(element.nodeType===Node.ELEMENT_NODE)translateElement(element,lang);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
 let node:Node|null;
 while((node=walker.nextNode())){
  if(node.nodeType===Node.TEXT_NODE)translateNode(node as Text,lang);
  else translateElement(node as Element,lang);
 }
}
export function AthenaLanguageProvider({children}:{children:ReactNode}){
 const [language,setLanguage]=useState<AthenaLanguage>("vi");
 const languageRef=useRef<AthenaLanguage>("vi");
 const value=useMemo(()=>({language,setLanguage}),[language]);
 useEffect(()=>{
  try{const stored=window.localStorage.getItem(storageKey);if(stored==="en"||stored==="vi")setLanguage(stored);}catch{}
  const sync=(event:StorageEvent)=>{if(event.key===storageKey&&(event.newValue==="en"||event.newValue==="vi"))setLanguage(event.newValue);};
  window.addEventListener("storage",sync);
  return()=>window.removeEventListener("storage",sync);
 },[]);
 useEffect(()=>{
  languageRef.current=language;
  document.documentElement.lang=language;
  document.documentElement.dataset.athenaLanguage=language;
  try{window.localStorage.setItem(storageKey,language);}catch{}
  let frame=0;
  const pending=new Set<Node>();
  translateSubtree(document.body,language);
  const translate=()=>{
   frame=0;
   const nodes=[...pending];pending.clear();
   for(const node of nodes)if(node.isConnected)translateSubtree(node,languageRef.current);
  };
  const observer=new MutationObserver(records=>{
   for(const record of records){
    if(record.type==="childList")record.addedNodes.forEach(node=>pending.add(node));
    else pending.add(record.target);
   }
   if(pending.size&&!frame)frame=requestAnimationFrame(translate);
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:[...attrNames]});
  return()=>{observer.disconnect();pending.clear();if(frame)cancelAnimationFrame(frame);};
 },[language]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function AthenaLanguageSwitch(){
 const {language,setLanguage}=useAthenaLanguage();
 return <div className="athena-language-switch" role="group" aria-label={language==="vi"?"Ngôn ngữ hiển thị":"Display language"} data-athena-no-translate>
  <button type="button" lang="vi" aria-label="Tiếng Việt" aria-pressed={language==="vi"} onClick={()=>setLanguage("vi")}>VI</button>
  <span aria-hidden="true">/</span>
  <button type="button" lang="en" aria-label="English" aria-pressed={language==="en"} onClick={()=>setLanguage("en")}>EN</button>
 </div>;
}
