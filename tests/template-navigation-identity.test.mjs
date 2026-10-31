import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {join,resolve} from "node:path";

const root=resolve(import.meta.dirname,"..");
const templates=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8"));
const source=readFileSync(join(root,"data/world-navigation-identities.ts"),"utf8");
const styles=readFileSync(join(root,"app/template-navigation-identities.css"),"utf8");
const entries=[...source.matchAll(/^ "([^"]+)":\{name:"([^"]+)",bars:([23]),headline:/gm)];
test("21 template types have independently named navigation presentation contracts",()=>{
 assert.equal(templates.length,21);
 assert.equal(entries.length,21);
 const slugs=templates.map(item=>item.slug);
 assert.deepEqual(new Set(entries.map(item=>item[1])),new Set(slugs));
 assert.equal(new Set(entries.map(item=>item[2])).size,21);
 assert.equal(entries.filter(item=>item[3]==="2").length,9);
 assert.equal(entries.filter(item=>item[3]==="3").length,12);
 assert.ok(!source.includes("glyph:"),"No decorative navigation symbol fields");
 const worldSource=readFileSync(join(root,"components/templates/WorldSite.tsx"),"utf8");
 assert.match(worldSource,/className="world-toggle-bars"/);
 assert.doesNotMatch(worldSource,/world-toggle-glyph|world-toggle-label/);
 const digitalSource=readFileSync(join(root,"vendor/digital-creators/src/App.tsx"),"utf8");
 assert.match(digitalSource,/className="dc-menu-bars"/);
 assert.doesNotMatch(digitalSource,/dc-constellation-glyph|dc-constellation-label/);
 for(const [,slug,variant] of entries){
  if(slug!=="digital-creators"){
   assert.match(styles,new RegExp('data-nav-style="'+variant+'"'),'Missing distinct layout for '+slug);
  }else{
   assert.equal(variant,"digital-creators-native");
  }
 }
});
test("no repeated northeast-arrow glyph remains in Athena application source",()=>{
 const folders=["app","components","data","lib"];
 let examined=0;
 const scan=(dir)=>{
  for(const item of readdirSync(dir,{withFileTypes:true})){
   const path=join(dir,item.name);
   if(item.isDirectory())scan(path);
   else if(/\.(tsx?|jsx?|css)$/.test(path)){
    examined++;
    assert.equal(readFileSync(path,"utf8").includes(String.fromCharCode(0x2197)),false,path);
   }
  }
 };
 folders.forEach(folder=>scan(join(root,folder)));
 assert.ok(examined>100);
});
