import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,join} from "node:path";
import {spawnSync} from "node:child_process";
const root=resolve(import.meta.dirname,"..");
const load=path=>readFileSync(join(root,path),"utf8");
test("Sovereign registry describes exactly the canonical 15 template slugs",()=>{
 const templates=JSON.parse(load("data/templates.json")).map(x=>x.slug);
 const registry=[...load("data/sovereign-site-registry.ts").matchAll(/^ "([^"]+)":\{stage:"([^"]+)",archetype:"([^"]+)",owner:"([^"]+)"\}/gm)];
 assert.equal(registry.length,15);
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
 assert.doesNotMatch(router,/LegacyWorldSiteAdapter/);
});
test("Auto Showroom owns its full site renderer and cinematic controls",()=>{
 const route=load("components/sovereign/SovereignDemoRoute.tsx");
 const implementation=load("components/sovereign/sovereign-renderers.ts");
 const own=load("templates/auto-showroom/src/components/Site.tsx");
 assert.doesNotMatch(route,/LegacyWorldSiteAdapter/);
 assert.match(implementation,/AutoShowroomSite/);
 assert.match(own,/CinematicExperience/);
 assert.match(own,/AutoShowroomSubpages/);
 assert.match(own,/BlackVelocityMotion/);
 assert.doesNotMatch(own,/@\/components\/templates\//);
});
test("P0/P1 structural audit reports existing design debt without falsely claiming 21 designs",()=>{
 const r=spawnSync(process.execPath,[join(root,"scripts/sovereign-audit.mjs"),"--check"],{cwd:root,encoding:"utf8"});
 assert.equal(r.status,0,r.stdout+"\n"+r.stderr);
 assert.match(r.stdout,/"legacy":0/);
 assert.match(r.stdout,/"native-static":0/);
 assert.match(r.stdout,/"sovereign":15/);
});
