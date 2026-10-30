import {cp,mkdir,readdir,readFile,writeFile,lstat,realpath} from "node:fs/promises";
import {dirname,resolve,relative,join,sep,isAbsolute,basename} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const templatesRoot=join(root,"templates");
const registry=JSON.parse(await readFile(join(root,"data/templates.json"),"utf8"));
const supportedModules=new Set(["content","contact","catalog","commerce","auth","booking"]);
function usage(){return "Usage: node scripts/create-site.mjs --template <slug> --name <project-slug> --brand <brand-name> --out <path> [--modules content,contact] [--email hello@example.com]";}
function args(argv){const result={};const allowed=new Set(["template","name","brand","out","modules","email"]);for(let i=0;i<argv.length;i+=2){const key=argv[i].slice(2);if(!argv[i].startsWith("--")||!argv[i+1]||!allowed.has(key)||Object.hasOwn(result,key))throw Error(usage());result[key]=argv[i+1];}return result;}
function safeSlug(value){return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);}
async function canonical(path){try{return await realpath(path);}catch(error){if(error?.code!=="ENOENT")throw error;return join(await canonical(dirname(path)),basename(path));}}
async function walk(folder){const entries=await readdir(folder,{withFileTypes:true});const result=[];for(const entry of entries){const path=join(folder,entry.name);if(entry.isDirectory())result.push(...await walk(path));else result.push(path);}return result;}

if(process.argv.includes("--help")){console.log(usage());process.exit(0);}
const input=args(process.argv.slice(2));
const template=registry.find(item=>item.slug===input.template);
if(!template)throw Error(`Template không tồn tại: ${input.template||"(trống)"}`);
if(!safeSlug(input.name||""))throw Error("--name cần dùng chữ thường, số và dấu gạch nối.");
const brand=(input.brand||"").trim();if(brand.length<2||brand.length>100||/[\u0000-\u001f\u007f]/.test(brand))throw Error("--brand cần từ 2 đến 100 ký tự và không chứa ký tự điều khiển.");
const email=(input.email||"").trim();if(email&&(email.length>200||!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(email)))throw Error("--email cần là địa chỉ email hợp lệ.");
if(!input.out)throw Error("Thiếu --out. "+usage());
const selected=input.modules?input.modules.split(",").map(value=>value.trim()).filter(Boolean):template.modules;
if(new Set(selected).size!==selected.length||selected.some(module=>!supportedModules.has(module)||!template.modules.includes(module)))throw Error("--modules chỉ được chọn module duy nhất đã đăng ký cho mẫu này: "+template.modules.join(", "));
const output=resolve(process.cwd(),input.out);
const rel=relative(await realpath(root),await canonical(output));
if(rel===""||(!isAbsolute(rel)&&rel!==".."&&!rel.startsWith(".."+sep)))throw Error("Đường dẫn --out phải nằm ngoài repository Athena.");
try{const existing=await lstat(output);if(existing.isSymbolicLink()||!existing.isDirectory()||(await readdir(output)).length)throw Error("Thư mục đích đã tồn tại, là symlink hoặc không trống.");}catch(error){if(error?.code!=="ENOENT")throw error;}
await mkdir(dirname(output),{recursive:true});
const source=join(templatesRoot,template.slug);
await cp(source,output,{recursive:true,errorOnExist:true,force:false,filter:path=>!/(^|[\\/])(?:node_modules|\.next|\.git|test-results|\.qa)(?:[\\/]|$)/.test(path)});
const sitePath=join(output,"src/data/site.json");
const site=JSON.parse(await readFile(sitePath,"utf8"));
site.brand=brand;site.projectName=input.name;site.contactEmail=email;site.modules=selected;
await writeFile(sitePath,JSON.stringify(site,null,2)+"\n","utf8");
const manifestPath=join(output,"template.manifest.json");
const manifest=JSON.parse(await readFile(manifestPath,"utf8"));
Object.assign(manifest,{projectSlug:input.name,brand,modules:selected,database:"not-configured",variant:template.variant});
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+"\n","utf8");
const pkgPath=join(output,"package.json");
const pkg=JSON.parse(await readFile(pkgPath,"utf8"));pkg.name=input.name;
await writeFile(pkgPath,JSON.stringify(pkg,null,2)+"\n","utf8");
const lockPath=join(output,"package-lock.json");
const lock=JSON.parse(await readFile(lockPath,"utf8"));lock.name=input.name;lock.packages[""].name=input.name;
await writeFile(lockPath,JSON.stringify(lock,null,2)+"\n","utf8");
console.log(JSON.stringify({created:true,output,template:template.slug,templateVersion:template.version,compatibility:template.compatibility,modules:selected},null,2));
