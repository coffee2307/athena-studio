import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,join} from "node:path";
import {spawnSync} from "node:child_process";
const root=resolve(import.meta.dirname,"..");
const load=path=>readFileSync(join(root,path),"utf8");
test("Sovereign registry describes exactly the canonical 21 template slugs",()=>{
 const templates=JSON.parse(load("data/templates.json")).map(x=>x.slug);
 const registry=[...load("data/sovereign-site-registry.ts").matchAll(/^ "([^"]+)":\{stage:"([^"]+)",archetype:"([^"]+)",owner:"([^"]+)"\}/gm)];
 assert.equal(registry.length,21);
 assert.deepEqual(registry.map(x=>x[1]).sort(),templates.sort());
 assert.ok(registry.every(x=>["legacy","native-static","sovereign"].includes(x[2])));
 assert.ok(registry.every(x=>x[3].length>3&&x[4].length>1));
});
test("No public template route directly renders the legacy WorldSite shell",()=>{
 for(const p of ["app/template-demos/[slug]/page.tsx","app/template-demos/[slug]/[section]/page.tsx","app/template-demos/[slug]/work/[item]/page.tsx"]){
  const source=load(p);
  assert.match(source,/SovereignDemoRoute/,p);
  assert.doesNotMatch(source,/from ["']@\/components\/templates\/WorldSite["']/,p);
 }
 const router=load("components/sovereign/SovereignDemoRoute.tsx");
 assert.doesNotMatch(router,/from ["']@\/components\/templates\/WorldSite["']/);
 assert.match(router,/sovereignRenderers/);
 assert.match(router,/LegacyWorldSiteAdapter/);
});
test("Only the explicitly isolated compatibility adapter can import the shared WorldSite",()=>{
 const source=load("components/sovereign/LegacyWorldSiteAdapter.tsx");
 assert.match(source,/from ["']@\/components\/templates\/WorldSite["']/);
 const implementation=load("components/sovereign/sovereign-renderers.ts");
 assert.doesNotMatch(implementation,/from ["']@\/components\/templates\/WorldSite["']/);
 assert.doesNotMatch(implementation,/^import.*(?:WorldMotion|WorldExperiencePages).*$/m);
});
test("P0/P1 structural audit reports existing design debt without falsely claiming 21 designs",()=>{
 const r=spawnSync(process.execPath,[join(root,"scripts/sovereign-audit.mjs"),"--check"],{cwd:root,encoding:"utf8"});
 assert.equal(r.status,0,r.stdout+"\n"+r.stderr);
 assert.match(r.stdout,/"legacy":20/);
 assert.match(r.stdout,/"native-static":1/);
 assert.match(r.stdout,/"sovereign":0/);
});
