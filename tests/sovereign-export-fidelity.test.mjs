import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {resolve,join} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
const root=resolve(import.meta.dirname,"..");
const slugs=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8")).map(x=>x.slug);
const migrated=slugs.filter(x=>x!=="digital-creators"&&x!=="auto-showroom");
const read=path=>readFileSync(join(root,path),"utf8");
test("13 Next.js website exports own scoped visual components and editable brand identities",()=>{
 assert.equal(migrated.length,13);
 const digests=[];
 for(const slug of migrated){
  const path="templates/"+slug+"/src/";
  const body=read(path+"components/Site.tsx");
  const config=JSON.parse(read(path+"data/site.json"));
  assert.ok(config.brand&&config.brand.length>=2,slug+" must have a real design-identity default");
  assert.match(body,/site\.brand/,slug+" must display the configured brand");
  assert.doesNotMatch(body,/from\s+["']@\/components\/templates\/(?:WorldSite|WorldExperiencePages|WorldMotion)["']/,slug+" must not reuse Athena shared UI");
  const css=body.match(/import\s+\w+\s+from\s+["']\.\/([^"']+\.module\.css)["']/)?.[1];
  assert.ok(css&&existsSync(join(root,path+"components/"+css)),slug+" must own its style module");
  assert.ok(!existsSync(join(root,path+"app/globals.css")),slug+" must not retain old generic global shell");
  digests.push(createHash("sha256").update(body).digest("hex"));
 }
 assert.equal(new Set(digests).size,13,"all 13 website source trees must be different");
});
test("Digital Creators is genuinely exported as native Vite app with source-asset parity",()=>{
 const base=join(root,"templates/digital-creators");
 const pkg=JSON.parse(readFileSync(join(base,"package.json"),"utf8"));
 const manifest=JSON.parse(readFileSync(join(base,"template.manifest.json"),"utf8"));
 assert.match(pkg.scripts?.build||"",/vite build/);
 assert.equal(manifest.status,"sovereign-native-vite");
 assert.ok(!existsSync(join(base,"next.config.ts")));
 assert.ok(!existsSync(join(base,"src/components/Site.tsx")));
 const check=spawnSync(process.execPath,[join(root,"scripts/sovereign-digital-creators-sync.mjs"),"--check"],{cwd:root,encoding:"utf8",timeout:20000});
 assert.equal(check.status,0,check.stdout+"\n"+check.stderr);
});
test("export scaffolder preserves unique template UI and custom brand for customers",()=>{
 const base=mkdtempSync(join(tmpdir(),"athena-sovereign-qa-"));
 try{
  for(const slug of ["creative-studio","modern-corporate","commerce-standard","fashion-archive"]){
   const out=join(base,slug+"-client");
   const brand="Thương Hiệu Mới "+slug;
   const run=spawnSync(process.execPath,[join(root,"scripts/create-site.mjs"),"--template",slug,"--name",slug+"-client","--brand",brand,"--out",out],{cwd:root,encoding:"utf8",timeout:30000});
   assert.equal(run.status,0,slug+" scaffold failed: "+run.stdout+"\n"+run.stderr);
   const data=JSON.parse(readFileSync(join(out,"src/data/site.json"),"utf8"));
   assert.equal(data.brand,brand);
   const body=readFileSync(join(out,"src/components/Site.tsx"),"utf8");
   assert.match(body,/site\.brand/,slug+" generated wordmark must use custom brand data");
   assert.ok(!body.includes("WorldSite"),slug+" export cannot fall back to shared UI");
   assert.ok(existsSync(join(out,"package-lock.json")));
  }
 } finally {rmSync(base,{recursive:true,force:true});}
});
