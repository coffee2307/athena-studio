import {strict as assert} from "node:assert";
import {test} from "node:test";
import {safePreviewOrigin,extractStaticAssets,latencySummary,previewRoutes} from "../lib/preview-canary.mjs";

test("Canary accepts only local Basic Auth proxy or genuine quick tunnel origin",()=>{
 assert.equal(safePreviewOrigin("http://127.0.0.1:3184"),"http://127.0.0.1:3184");
 assert.equal(safePreviewOrigin("https://sample-name.trycloudflare.com"),"https://sample-name.trycloudflare.com");
 for(const bad of [
  "http://127.0.0.1:3182","http://localhost:3184","https://127.0.0.1:3184",
  "https://preview.example.com","https://fake.trycloudflare.com.attacker.net",
  "http://my.trycloudflare.com","file:///etc/hosts","https://user:pass@sample.trycloudflare.com",
  "https://sample.trycloudflare.com/other","https://sample.trycloudflare.com?token=secret",
  "","foo"
 ])assert.throws(()=>safePreviewOrigin(bad),bad);
});
test("Asset extraction deduplicates hashed CSS, JS, and preload fonts",()=>{
 const html='<link rel="stylesheet" href="/_next/static/css/style-123.css"/>'+
  '<link rel="stylesheet" href="/_next/static/css/style-123.css"/>'+
  '<script src="/_next/static/chunks/main-456.js"></script>'+
  '<link rel="preload" as="font" href="/_next/static/media/font-789.woff2"/>';
 assert.deepEqual(extractStaticAssets(html),{
  css:["/_next/static/css/style-123.css"],
  js:["/_next/static/chunks/main-456.js"],
  fonts:["/_next/static/media/font-789.woff2"]
 });
});
test("Reported p95 is a sampled statistic, never an uptime SLA",()=>{
 assert.deepEqual(latencySummary([]),{count:0,p50:null,p95:null,max:null});
 assert.deepEqual(latencySummary([3,6,15,7,100]),{count:5,p50:7,p95:100,max:100});
 assert.equal(latencySummary([1,Number.NaN,-5,2]).count,2);
 assert.ok(previewRoutes.includes("/contact"));
 assert.ok(!previewRoutes.some(x=>x.includes("/api/")));
});
