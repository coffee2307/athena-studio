import {cp,mkdir,readdir,readFile,writeFile,lstat,realpath} from "node:fs/promises";
import {dirname,resolve,relative,join,sep,isAbsolute,basename} from "node:path";
import {fileURLToPath} from "node:url";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const starter=join(root,"starter/web-foundation");
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
await cp(starter,output,{recursive:true,errorOnExist:true,force:false});
const safeBrand=brand.replaceAll("\\","\\\\").replaceAll('"','\\"');
const replacements={"__PROJECT_NAME__":input.name,"__PROJECT_SLUG__":input.name,"__BRAND_NAME__":safeBrand,"__TEMPLATE_SLUG__":template.slug,"__TEMPLATE_VARIANT__":template.variant,"__TEMPLATE_VERSION__":template.version,"__CONTACT_EMAIL_JSON__":JSON.stringify(email),"__MODULES_JSON__":JSON.stringify(selected)};
for(const path of await walk(output)){
 const original=await readFile(path,"utf8");
 const next=original.replace(/__(?:PROJECT_NAME|PROJECT_SLUG|BRAND_NAME|TEMPLATE_SLUG|TEMPLATE_VARIANT|TEMPLATE_VERSION|CONTACT_EMAIL_JSON|MODULES_JSON)__/g,token=>replacements[token]);
 if(next!==original)await writeFile(path,next,"utf8");
}
console.log(JSON.stringify({created:true,output,template:template.slug,templateVersion:template.version,compatibility:template.compatibility,modules:selected},null,2));
