(function(){
 const excluded=["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"];
 const rootPath="/immersive/digital-creators/";
 const locale=new URLSearchParams(location.search).get("lang");
 let language=locale==="en"||locale==="vi"?locale:"vi";
 if(locale!=="en"&&locale!=="vi"){try{language=localStorage.getItem("athena-studio-language")==="en"?"en":"vi"}catch{}}
 document.documentElement.lang=language;
 document.documentElement.dataset.templateLanguage=language;
 const attrs=["placeholder","aria-label","title","alt"];
 const cache=new WeakMap();
 const attrCache=new WeakMap();
 fetch(rootPath+"locale-data.json").then(r=>r.ok?r.json():Promise.reject(Error("Missing language data"))).then(data=>{
  const dict=data[language]||{};
  const t=s=>{
   const key=s.trim();
   if(!key||!dict[key]||dict[key]===key)return s;
   return s.slice(0,s.indexOf(key))+dict[key]+s.slice(s.indexOf(key)+key.length);
  };
  const edit=(node)=>{
   if(node.nodeType===3){
    const el=node.parentElement;
    if(!el||el.closest("script,style,noscript,svg,pre,code"))return;
    const old=cache.get(node),source=old&&old.rendered===node.data?old.source:node.data;
    const result=t(source);if(result!==node.data)node.data=result;
    cache.set(node,{source,rendered:result});return;
   }
   if(node.nodeType!==1)return;
   const el=node;
   if(el.matches("script,style,noscript,svg,pre,code"))return;
   let records=attrCache.get(el);if(!records){records=new Map();attrCache.set(el,records);}
   for(const a of attrs){
    const v=el.getAttribute(a);if(v===null)continue;
    const old=records.get(a),source=old&&old.rendered===v?old.source:v;
    const result=t(source);if(result!==v)el.setAttribute(a,result);
    records.set(a,{source,rendered:result});
   }
  };
  const visit=(parent)=>{
   edit(parent);
   if(parent.nodeType!==1&&parent.nodeType!==9)return;
   if(parent.matches&&parent.matches("script,style,noscript,svg,pre,code"))return;
   const walker=document.createTreeWalker(parent,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
   let n;while(n=walker.nextNode())edit(n);
  };
  visit(document.body);
  const pending=new Set();let raf=0;
  const observer=new MutationObserver(records=>{
   for(const r of records){
    if(r.type==="childList")r.addedNodes.forEach(n=>pending.add(n));else pending.add(r.target);
   }
   if(pending.size&&!raf)raf=requestAnimationFrame(()=>{
    raf=0;const nodes=[...pending];pending.clear();
    for(const n of nodes)if(n.isConnected)visit(n);
   });
  });
  observer.observe(document.body,{subtree:true,characterData:true,childList:true,attributes:true,attributeFilter:attrs});
  addEventListener("storage",e=>{
   if(e.key!=="athena-studio-language"||!["en","vi"].includes(e.newValue))return;
   const u=new URL(location.href);u.searchParams.set("lang",e.newValue);location.replace(u.toString());
  });
 }).catch(e=>console.warn("[Digital Creators locale]",e.message));
})();
