import {spawnSync} from "node:child_process";
import {mkdir,readFile,writeFile,access} from "node:fs/promises";
import path from "node:path";
const base=process.argv[2]||"http://127.0.0.1:3199";
const dir=path.resolve(".lighthouse");
await mkdir(dir,{recursive:true});
const launcher=path.resolve("node_modules/lighthouse/cli/index.js");
const configurations=[
 {name:"desktop-home",route:"/",preset:"desktop"},
 {name:"mobile-home",route:"/",preset:"mobile"},
 {name:"mobile-portfolio",route:"/du-an",preset:"mobile"}
];
const result=[];
for(const item of configurations){
 const file=path.join(dir,item.name+".json");
 const args=[launcher,new URL(item.route,base).toString(),
  "--only-categories=performance,accessibility,best-practices,seo",
  "--output=json","--output-path="+file,"--quiet","--max-wait-for-load=45000",
  "--chrome-flags=--headless=new --disable-gpu --no-sandbox",
  ...(item.preset==="desktop"?["--preset=desktop"]:[])
 ];
 const env={...process.env};
 if(process.platform==="win32"&&!env.CHROME_PATH){
  const chrome="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  try{await access(chrome);env.CHROME_PATH=chrome;}catch{}
 }
 const processResult=spawnSync(process.execPath,args,{cwd:process.cwd(),stdio:"inherit",env,timeout:150000});
 if(processResult.status!==0)throw Error("Lighthouse failed: "+item.name+" code "+processResult.status);
 const report=JSON.parse(await readFile(file,"utf8"));
 const audit=report.audits||{},categories=report.categories||{};
 const summary={
  sample:item.name,url:new URL(item.route,base).toString(),fetchTime:report.fetchTime,
  scores:Object.fromEntries(["performance","accessibility","best-practices","seo"].map(k=>[k,Math.round((categories[k]?.score||0)*100)])),
  metrics:{lcpMs:audit["largest-contentful-paint"]?.numericValue??null,
   cls:audit["cumulative-layout-shift"]?.numericValue??null,
   tbtMs:audit["total-blocking-time"]?.numericValue??null,
   fcpMs:audit["first-contentful-paint"]?.numericValue??null,
   speedIndexMs:audit["speed-index"]?.numericValue??null
  },
  opportunities:Object.values(audit).filter(v=>v&&typeof v==="object"&&v.score!==null&&v.score<0.9&&
   ["opportunity","diagnostic"].includes(v.details?.type||""))
    .map(v=>({id:v.id,title:v.title,displayValue:v.displayValue})).slice(0,15)
 };
 result.push(summary);
 console.log(JSON.stringify(summary,null,2));
}
await writeFile(path.join(dir,"summary.json"),JSON.stringify({environment:"Local Windows Chrome Lighthouse emulated lab; not p75 RUM",result},null,2));
