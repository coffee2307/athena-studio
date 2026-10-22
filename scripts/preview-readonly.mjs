import http from "node:http";
import {readFileSync} from "node:fs";
import {timingSafeEqual,createHash} from "node:crypto";

const PASSWORD=readFileSync(new URL("../.qa/preview-password.txt",import.meta.url),"utf8").trim();
const USER="athena";
const PORT=3184;
const failed=new Map();
const matches=(auth)=>{
 if(typeof auth!=="string"||!auth.startsWith("Basic "))return false;
 let raw;
 try{raw=Buffer.from(auth.slice(6),"base64").toString("utf8");}catch{return false;}
 const digest=v=>createHash("sha256").update(v).digest();
 return timingSafeEqual(digest(raw),digest(USER+":"+PASSWORD));
};
const agent=new http.Agent({keepAlive:true,keepAliveMsecs:10000,maxSockets:32,maxFreeSockets:8});
const server=http.createServer((req,res)=>{
 const ip=req.socket.remoteAddress||"unknown";
 const attempts=failed.get(ip);
 if(attempts && attempts.count>=20 && Date.now()-attempts.since<600000){
  res.writeHead(429,{"Retry-After":"600","Cache-Control":"no-store"});res.end("Too many attempts");return;
 }
 const auth=req.headers.authorization;
 if(!matches(auth)){
  const old=failed.get(ip);
  failed.set(ip,{since:old&&Date.now()-old.since<600000?old.since:Date.now(),count:(old&&Date.now()-old.since<600000?old.count:0)+1});
  res.writeHead(401,{"WWW-Authenticate":'Basic realm="Athena private mobile preview", charset="UTF-8"',"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"});
  res.end("Athena private preview: sign in with provided test credentials.");
  return;
 }
 failed.delete(ip);
 let pathname;
 try{pathname=new URL(req.url||"/","http://127.0.0.1").pathname;}catch{res.writeHead(400);res.end();return;}
 if(pathname==="/api"||pathname.startsWith("/api/")||pathname.startsWith("/_next/webpack-hmr")){
  res.writeHead(404,{"Cache-Control":"no-store","X-Robots-Tag":"noindex"});res.end("Not available in visual preview.");return;
 }
 if(req.method!=="GET"&&req.method!=="HEAD"){res.writeHead(405,{"Allow":"GET, HEAD","Cache-Control":"no-store","X-Robots-Tag":"noindex"});res.end("Read-only visual preview");return;}
 const staticAsset=pathname.startsWith("/_next/static/");
 const headers={...req.headers,host:"127.0.0.1:3182"};
 for(const key of ["connection","authorization","cookie","x-forwarded-host","x-forwarded-proto","x-forwarded-for","cf-connecting-ip","cf-ray"])delete headers[key];
 const forward=http.request({hostname:"127.0.0.1",port:3182,method:req.method,path:req.url,headers,timeout:20000,agent},up=>{
  const out={...up.headers,
   "cache-control":staticAsset&&(up.statusCode===200||up.statusCode===206)?"private, max-age=31536000, immutable":"private, no-store",
   "x-robots-tag":"noindex, nofollow, noarchive",
   "vary":staticAsset?"Accept-Encoding":[up.headers.vary,"Authorization"].filter(Boolean).join(", ")
  };
  delete out["set-cookie"];
  res.writeHead(up.statusCode||502,out);
  up.pipe(res);
 });
 forward.on("timeout",()=>forward.destroy(new Error("Upstream timeout")));
 forward.on("error",()=>{if(!res.headersSent){res.writeHead(502,{"Cache-Control":"no-store"});res.end("Preview temporarily unavailable");}else{res.destroy();}});
 req.pipe(forward);
});
server.listen(PORT,"127.0.0.1",()=>console.log("ATHENA_AUTHENTICATED_PREVIEW_READY http://127.0.0.1:"+PORT));