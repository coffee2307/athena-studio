import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import sharp from "sharp";

const read=path=>readFileSync(path);
const versions=JSON.parse(read("data/template-preview-versions.json").toString());

test("Fashion 3D covers for default, VI and EN are fresh and consistent",async()=>{
 for(const key of ["fashion-archive","fashion-archive-vi","fashion-archive-en"]){
  const file="public/template-previews/"+key+".jpg";
  const bytes=read(file);
  const hash=createHash("sha256").update(bytes).digest("hex").slice(0,16);
  assert.equal(versions[key],hash,key+" stale browser cache version");
  const {data,info}=await sharp(bytes).extract({left:1050,top:350,width:650,height:500}).raw().toBuffer({resolveWithObject:true});
  let figurePixels=0;
  for(let i=0;i<data.length;i+=info.channels){
   if(data[i]<215&&data[i+1]<205&&data[i+2]<195)figurePixels++;
  }
  assert.ok(figurePixels>30000,key+" missing rendered fashion model in hero cover ("+figurePixels+")");
 }
 assert.deepEqual(read("public/template-previews/fashion-archive.jpg"),read("public/template-previews/fashion-archive-vi.jpg"),"Default cover should mirror VI model cover");
});

test("Preview pipelines wait for WebGL and retain language-specific cache keys",()=>{
 const localized=read("scripts/capture-template-locales-prod.mjs").toString();
 const defaultPipeline=read("scripts/sovereign-refresh-previews.mjs").toString();
 const workflow=read(".github/workflows/template-previews-auto.yml").toString();
 assert.match(localized,/data-active-model="pose-floor"\]\[data-model-state="ready"/);
 assert.match(localized,/versions\["fashion-archive"\]=hash/);
 assert.match(defaultPipeline,/slug\+"-vi"/);
 assert.match(defaultPipeline,/slug\+"-en"/);
 assert.match(workflow,/Refresh VI\/EN covers for changed templates/);
 assert.match(workflow,/ONLY_SLUGS:/);
});
