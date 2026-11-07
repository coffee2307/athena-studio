"use client";
import {createContext,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from "react";
import translations from "@/lib/athena-language-en.json";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";

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
function translateDynamicLabel(key:string):string|undefined{
 let match:RegExpExecArray|null;
 if((match=/^Có thể thử lại sau (\d+)s$/.exec(key)))return "Try again in "+match[1]+"s";
 if((match=/^Tham gia ngày (.+)$/.exec(key)))return "Member since "+match[1];
 if((match=/^Xem trước website (.+)$/.exec(key)))return "Website preview: "+(en[match[1]]??match[1]);
 if((match=/^Xem demo (.+)$/.exec(key)))return "View demo: "+(en[match[1]]??match[1]);
 if((match=/^Giao diện mẫu (.+)$/.exec(key)))return "Template preview: "+(en[match[1]]??match[1]);
 if((match=/^Chọn bản xem trước (.+)$/.exec(key)))return "Select preview: "+(en[match[1]]??match[1]);
 if((match=/^(?:Ảnh chụp giao diện website|Ảnh chụp website mẫu) (.+)$/.exec(key)))return "Website screenshot: "+(en[match[1]]??match[1]);
 if((match=/^(?:Website preview:|Demo website:) (.+)$/.exec(key)))return "Demo website: "+(en[match[1]]??match[1]);
 if((match=/^Tiếp tục với (Google|GitHub)( \(chưa kết nối\))?$/.exec(key)))return "Continue with "+match[1]+(match[2]?" (not connected)":"");
 if((match=/^Tiếp tục bằng (Google|GitHub)$/.exec(key)))return "Continue with "+match[1];
 if((match=/^Chưa cấu hình ứng dụng OAuth (Google|GitHub)$/.exec(key)))return match[1]+" OAuth app not configured";
 if((match=/^(.+?) (—|[|]) Athena Studio$/.exec(key))){
  const title=en[match[1].trim()];if(title)return title+" "+match[2]+" Athena Studio";
 }
 return undefined;
}
function translateLiteral(raw:string,lang:AthenaLanguage){
 const key=raw.trim();
 if(!key)return raw;
 const translated=lang==="en"?(en[key]??translateDynamicLabel(key)):undefined;
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
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!open)return;
  const close=(event:PointerEvent)=>{if(ref.current&&!ref.current.contains(event.target as Node))setOpen(false);};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false);};
  document.addEventListener("pointerdown",close);
  document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",close);document.removeEventListener("keydown",escape);};
 },[open]);
 return <div ref={ref} className="athena-language-switch" data-athena-no-translate>
  <button type="button" className="athena-language-trigger" aria-label={language==="vi"?"Chọn ngôn ngữ":"Choose language"} aria-haspopup="menu" aria-controls="athena-language-options" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>
   <FontAwesomeIcon icon={faGlobe} aria-hidden="true"/><span className="athena-language-current">{language.toUpperCase()}</span>
  </button>
  {open&&<div id="athena-language-options" className="athena-language-options" role="menu" aria-label="Language">
   <button type="button" role="menuitemradio" lang="vi" aria-checked={language==="vi"} onClick={()=>{setLanguage("vi");setOpen(false);}}>Tiếng Việt <span>VI</span></button>
   <button type="button" role="menuitemradio" lang="en" aria-checked={language==="en"} onClick={()=>{setLanguage("en");setOpen(false);}}>English <span>EN</span></button>
  </div>}
 </div>;
}
