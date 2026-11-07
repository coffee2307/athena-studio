import fs from "node:fs";import path from "node:path";import ts from "typescript";
const root=process.cwd(),dict=JSON.parse(fs.readFileSync("lib/athena-language-en.json","utf8"));
const folders=["components/auth","components/account","components/home","components/layout","components/templates","components/contact","components/agency","components/immersive","app"];
const exclude=/[\\\/](?:template-demos|api|_components)[\\\/]/;
function collect(dir){
 const out=[];if(!fs.existsSync(dir))return out;
 for(const item of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,item.name);
  if(exclude.test(p))continue;
  if(item.isDirectory())out.push(...collect(p));
  else if(item.name.endsWith(".tsx"))out.push(p);
 }return out;
}
const candidates=new Map(),files=[];const vi=/[\u00c0-\u00ff\u0102-\u01b0\u1ea0-\u1ef9\u0110\u0111]/;
const idLike=/^(?:[#@/.:=_+*\-0-9 ]+|(?:[\w.]+\/){2,}[\w.]+)$/;
for(const folder of folders)for(const file of collect(folder)){
 const code=fs.readFileSync(file,"utf8");const ast=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 let count=0;
 function visit(n){
  let value=null,kind="";
  if(ts.isJsxText(n)){value=n.getText(ast).replace(/\s+/g," ").trim();kind="text";}
  else if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)){
   value=n.text.trim();kind=ts.isJsxAttribute(n.parent)?"attr":"string";
  }
  if(value&&value.length>=2&&value.length<600&&vi.test(value)&&!idLike.test(value)&&!dict[value]){
   if(!candidates.has(value))candidates.set(value,[]);
   const spans=candidates.get(value);
   if(spans.length<3)spans.push({file:file.replace(root+path.sep,""),kind,line:ast.getLineAndCharacterOfPosition(n.pos).line+1});
   count++;
  }
  ts.forEachChild(n,visit);
 }
 visit(ast);
 if(count)files.push({file:file.replace(root+path.sep,""),missing:count});
}
const data={counts:{unique:candidates.size,files:files.length},files:files.sort((a,b)=>b.missing-a.missing),strings:Object.fromEntries(candidates)};
fs.mkdirSync(".qa/athena-i18n-audit",{recursive:true});
fs.writeFileSync(".qa/athena-i18n-audit/source.json",JSON.stringify(data,null,2));
console.log("SOURCE_AUDIT",JSON.stringify(data.counts));
console.log("TOP_FILES",JSON.stringify(data.files.slice(0,38)));
console.log("AUTH_MISSING",JSON.stringify(Object.entries(data.strings).filter(([k,loc])=>loc.some(x=>x.file.includes("auth/"))).slice(0,45)));
