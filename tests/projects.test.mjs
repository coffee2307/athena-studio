import test from "node:test";
import assert from "node:assert/strict";
import {projects,publicProjects,featuredProjects,getProjectBySlug} from "../data/projects.ts";

test("published portfolio entries have source and truthful provenance",()=>{
 assert.ok(publicProjects.length>=2);
 for(const project of publicProjects){
  assert.equal(project.visibility,"published");
  assert.match(project.sourceUrl, /^https:\/\/github\.com\/coffee2307\//);
  assert.ok(["founder","research","client"].includes(project.kind));
  assert.ok(project.responsibility.length>25);
  assert.ok(project.challenge.length>25);
  assert.ok(project.outcomeNote.length>25);
  assert.equal(project.gallery.every(item=>item.rightsVerified),true);
  assert.ok(project.evidenceNote.includes("repo")||project.evidenceNote.includes("README"));
 }
});
test("unverified Qrio cannot be seen as a published case study",()=>{
 assert.ok(projects.some(p=>p.slug==="qrio"&&p.visibility==="review"));
 assert.equal(getProjectBySlug("qrio"),undefined);
 assert.ok(!publicProjects.some(p=>p.slug==="qrio"));
});
test("every featured project is published and has unique slug",()=>{
 assert.equal(new Set(projects.map(p=>p.slug)).size,projects.length);
 assert.ok(featuredProjects.length>0);
 for(const p of featuredProjects) assert.ok(publicProjects.includes(p));
});
test("founder projects are never implicitly labeled delivered client work",()=>{
 assert.ok(publicProjects.every(p=>p.kind!=="client"));
 assert.ok(publicProjects.every(p=>p.status!=="đã bàn giao"));
});
