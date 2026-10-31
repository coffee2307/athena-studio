/** One-time visual policy migration; use --check in CI to reject regressions. */
import {readFileSync,writeFileSync,readdirSync} from "node:fs";
import {join,resolve} from "node:path";

const root=resolve(import.meta.dirname,"..");
const directories=["app","components","vendor/digital-creators/src"];
const check=process.argv.includes("--check");
const failures=[];
let changed=0;
function visit(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  const full=join(dir,entry.name);
  if(entry.isDirectory()){visit(full);continue;}
  if(!/\.(tsx?|jsx?)$/.test(entry.name))continue;
  let source=readFileSync(full,"utf8");
  let next=source;
  if(entry.name==="Icon.tsx"&&full.includes(join("components","ui"))){
   next=next.replace('"arrow-right"|"arrow-up-right"','"arrow-right"');
   next=next.replace(/^ "arrow-up-right":.*\r?\n/m,"");
  }else{
   next=next.replaceAll("arrow-up-right","arrow-right");
   next=next.replaceAll("ArrowUpRight","ArrowRight");
   next=next.replace(/import\s*\{([^}]*)\}\s*from\s*(["'])lucide-react\2/g,(_match,contents,quote)=>{
    const parts=contents.split(",").map(part=>part.trim()).filter(Boolean);
    return "import { "+[...new Set(parts)].join(", ")+" } from "+quote+"lucide-react"+quote;
   });
  }
  if(next!==source){changed++;if(!check)writeFileSync(full,next,"utf8");}
  if(next.includes(String.fromCharCode(0x2197))||next.includes("ArrowUpRight")||next.includes("arrow-up-right"))failures.push(full);
 }
}
for(const dir of directories)visit(join(root,dir));
if(check&&changed)failures.push(changed+" files still use the deprecated northeast icon");
console.log(JSON.stringify({check,changed,failures}));
if(failures.length)process.exitCode=1;
