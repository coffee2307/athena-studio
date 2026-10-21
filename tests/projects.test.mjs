import test from "node:test";
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {projects,publicProjects,featuredProjects,getProjectBySlug} from "../data/projects.ts";

test("published portfolio never exposes a source repository or nonapproved media",()=>{
 assert.ok(publicProjects.length>=2);
 for(const p of publicProjects){
  assert.equal(p.visibility,"published");
  assert.ok(!("sourceUrl" in p),`repository URL is not public case-study content: ${p.slug}`);
  assert.ok(["founder","research","client"].includes(p.kind));
  assert.ok(p.responsibility.length>25);
  assert.ok(p.challenge.length>25);
  assert.ok(p.outcomeNote.length>25);
  assert.ok(p.gallery.every(g=>g.rightsVerified&&g.alt.length>15&&g.caption.length>15));
 }
 const pham=getProjectBySlug("pham");
 assert.ok(pham.gallery.length>=3);
 assert.equal(pham.websiteUrl,"https://phamofficial.com/");
 for(const item of pham.gallery)assert.ok(existsSync("public"+item.src),item.src);
});
test("unverified Qrio must not appear publicly",()=>{
 assert.ok(projects.some(p=>p.slug==="qrio"&&p.visibility==="review"));
 assert.equal(getProjectBySlug("qrio"),undefined);
});
test("unique slugs and featured projects are published",()=>{
 assert.equal(new Set(projects.map(p=>p.slug)).size,projects.length);
 assert.ok(featuredProjects.length>0);
 for(const p of featuredProjects)assert.ok(publicProjects.includes(p));
});
test("founder work never misrepresented as delivered commercial client work",()=>{
 assert.ok(publicProjects.every(p=>p.kind!=="client"));
 assert.ok(publicProjects.every(p=>p.status!=="đã bàn giao"));
});
