import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const cli=join(root,"scripts/create-site.mjs");
test("scaffolder creates an isolated site and refuses unregistered modules or overwrite",async()=>{
 const folder=await mkdtemp(join(tmpdir(),"athena-scaffold-"));
 try{
  const output=join(folder,"client-site");
  execFileSync(process.execPath,[cli,"--template","creative-studio","--name","client-site","--brand","Client Brand","--out",output],{cwd:root,stdio:"pipe"});
  const config=await readFile(join(output,"src/config/site.ts"),"utf8");
  const manifest=JSON.parse(await readFile(join(output,"project.manifest.json"),"utf8"));
  assert.match(config,/Client Brand/);
  assert.match(config,/variant:"portfolio"/);
  assert.equal(manifest.variant,"portfolio");
  assert.deepEqual(manifest.modules,["content","contact"]);
  assert.equal(manifest.database,"not-configured");
  assert.throws(()=>execFileSync(process.execPath,[cli,"--template","creative-studio","--name","bad-site","--brand","Bad Site","--out",join(folder,"bad-site"),"--modules","booking"],{cwd:root,stdio:"pipe"}));
  assert.throws(()=>execFileSync(process.execPath,[cli,"--template","creative-studio","--name","client-site","--brand","Client Brand","--out",output],{cwd:root,stdio:"pipe"}));
 }finally{await rm(folder,{recursive:true,force:true});}
});

test("scaffolder never writes inside a dot-prefixed repository path",async()=>{
 const output=join(root,"..athena-test-output");
 try{
  assert.throws(()=>execFileSync(process.execPath,[cli,"--template","creative-studio","--name","safe-site","--brand","Safe Brand","--out",output],{cwd:root,stdio:"pipe"}));
 }finally{await rm(output,{recursive:true,force:true});}
});
test("brand token literals survive generation and unknown flags are refused",async()=>{
 const folder=await mkdtemp(join(tmpdir(),"athena-literal-"));
 try{
  const brand='Brand __TEMPLATE_SLUG__ "Q" \\ Atelier';
  execFileSync(process.execPath,[cli,"--template","modern-corporate","--name","literal-site","--brand",brand,"--out",join(folder,"site")],{cwd:root,stdio:"pipe"});
  const manifest=JSON.parse(await readFile(join(folder,"site/project.manifest.json"),"utf8"));
  assert.equal(manifest.brand,brand);
  assert.throws(()=>execFileSync(process.execPath,[cli,"--template","creative-studio","--name","bad-flag","--brand","Safe Brand","--out",join(folder,"bad"),"--unknown","yes"],{cwd:root,stdio:"pipe"}));
 }finally{await rm(folder,{recursive:true,force:true});}
});

test("scaffolder safely serializes a configured contact email as a source literal",async()=>{
 const folder=await mkdtemp(join(tmpdir(),"athena-email-"));
 try{
  const output=join(folder,"site");
  execFileSync(process.execPath,[cli,"--template","creative-studio","--name","email-site","--brand","Email Studio","--out",output,"--email","coffee@example.com"],{cwd:root,stdio:"pipe"});
  const config=await readFile(join(output,"src/config/site.ts"),"utf8");
  assert.match(config,/contactEmail:"coffee@example\.com"/);
  assert.throws(()=>execFileSync(process.execPath,[cli,"--template","creative-studio","--name","bad-email","--brand","Email Studio","--out",join(folder,"bad"),"--email",'coffee";process.exit(1);//@example.com'],{cwd:root,stdio:"pipe"}));
 }finally{await rm(folder,{recursive:true,force:true});}
});
