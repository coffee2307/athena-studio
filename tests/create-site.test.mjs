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
