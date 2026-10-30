import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import ts from "typescript";

// Import the same pure TypeScript math actually used by the scene.
const path=resolve("lib/showroom-orbit.ts");
const source=readFileSync(path,"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const orbit=await import("data:text/javascript;base64,"+Buffer.from(js).toString("base64"));
const approx=(actual,expected,tol=1e-8)=>assert.ok(Math.abs(actual-expected)<tol,actual+" != "+expected);
test("three or thirty completed drag revolutions cannot enter cinematic camera state",()=>{
 for(const rounds of [3,30,-3,-30]){
  const current=orbit.wrapOrbit(.72+rounds*2*Math.PI+1.17);
  const delta=orbit.shortestOrbitDelta(current,orbit.CHAPTER_YAWS[1]);
  assert.ok(Math.abs(delta)<=Math.PI+1e-10);
  const midpoint=orbit.interpolateOrbit(current,orbit.CHAPTER_YAWS[1],.5);
  assert.ok(Math.abs(orbit.shortestOrbitDelta(current,midpoint))<=Math.PI/2+.0001);
  const done=orbit.scrollTransition(current,orbit.CHAPTER_YAWS[1],0,.25,.25);
  approx(orbit.shortestOrbitDelta(done,orbit.CHAPTER_YAWS[1]),0);
 }
});
test("five authored camera targets coincide with visible chapter milestones",()=>{
 for(let i=0;i<5;i++)approx(orbit.shortestOrbitDelta(orbit.narrativeOrbit(i/4),orbit.CHAPTER_YAWS[i]),0);
 for(let i=1;i<5;i++)assert.ok(Math.abs(orbit.shortestOrbitDelta(orbit.CHAPTER_YAWS[i-1],orbit.CHAPTER_YAWS[i]))<=Math.PI);
});
test("scroll down and reverse always select the nearest keyframe in that direction",()=>{
 assert.equal(orbit.nextScrollChapter(0,1),1);
 assert.equal(orbit.nextScrollChapter(.1,1),1);
 assert.equal(orbit.nextScrollChapter(.3,1),2);
 assert.equal(orbit.nextScrollChapter(.6,-1),2);
 assert.equal(orbit.nextScrollChapter(.3,-1),1);
 assert.equal(orbit.nextScrollChapter(0,-1),0);
});
test("canonical narrative camera is reversible at arbitrary scroll positions",()=>{
 for(const p of [.01,.12,.18,.24,.37,.48,.51,.74,.88,.99]){
  const a=orbit.narrativeOrbit(p);
  approx(orbit.shortestOrbitDelta(a,orbit.narrativeOrbit(p)),0);
 }
});
