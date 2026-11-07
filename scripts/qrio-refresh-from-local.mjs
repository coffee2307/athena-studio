import {readFileSync,writeFileSync,copyFileSync,mkdirSync,readdirSync} from "node:fs";
import {join} from "node:path";
const src=process.env.QRIO_SOURCE_DIR||"F:/qrio",dst="public/immersive/qrio";
const pages=["home","edit","scan","about","contact","terms","privacy","disclaimer"];
mkdirSync(dst+"/static/logo/favicon_io (3)",{recursive:true});
for(const p of pages){
 let text=readFileSync(join(src,p+".html"),"utf8");
 // Client-facing HTML only. No Flask application, database, .env or server scripts.
 text=text.replaceAll('/static/','/immersive/qrio/static/');
 text=text.replace(/<meta name="robots"\s+content="index,\s*follow"\s*\/?>/gi,'<meta name="robots" content="noindex,nofollow">');
 text=text.replace(/href="\/(terms|privacy|disclaimer|about|contact)"/g,'href="$1.html"');
 text=text.replace(/href="home\.html"/g,'href="index.html"');
 if(p==="home")text=text.replace(/<head>/i,'<head>\n  <meta name="robots" content="noindex,nofollow">');
 // Respect Athena VI/EN locale before the original Qrio app hydrates.
 text=text.replace(/<head>/i,'<head>\n  <script>try{const value=new URLSearchParams(location.search).get("lang");if(value==="vi"||value==="en")localStorage.setItem("qr_lang",value)}catch{}</script>');
 // Block calls to Qrio backend and emulate only basic QR rendering in the original
 // editor with a browser-local engine. Insert before inline scripts.
 if(p==="edit")text=text.replace(/<head>/i,'<head>\n  <script src="./qrcode.js"></script>\n  <script src="./local-api-bridge.js"></script>');
 if(p==="scan")text=text.replace(/<head>/i,'<head>\n  <meta name="robots" content="noindex,nofollow">\n  <script src="./local-api-bridge.js"></script>');
 if(p==="contact")text=text.replace(/<head>/i,'<head>\n  <meta name="robots" content="noindex,nofollow">\n  <script src="./local-api-bridge.js"></script>');
 if(!text.includes("noindex,nofollow"))text=text.replace(/<head>/i,'<head>\n  <meta name="robots" content="noindex,nofollow">');
 const target=p==="home"?"index.html":p+".html";
 writeFileSync(join(dst,target),text,"utf8");
 if(p==="home")writeFileSync(join(dst,"home.html"),text,"utf8");
 console.log("COPIED_PUBLIC_FRONTEND",target,text.length);
}
const logoSrc=join(src,"static/logo"),logoDst=join(dst,"static/logo");
for(const name of readdirSync(logoSrc,{withFileTypes:true})){
 if(name.isFile()){copyFileSync(join(logoSrc,name.name),join(logoDst,name.name));}
 else if(name.isDirectory()&&name.name==="favicon_io (3)"){
  for(const child of readdirSync(join(logoSrc,name.name),{withFileTypes:true})){
   if(child.isFile())copyFileSync(join(logoSrc,name.name,child.name),join(logoDst,name.name,child.name));
  }
 }
}
console.log("FRONTEND_MIRROR_COMPLETE");
