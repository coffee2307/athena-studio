import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const read=p=>readFileSync(p,"utf8");
const registry=JSON.parse(read("data/templates.json"));
const versions=JSON.parse(read("data/template-preview-versions.json"));

test("the original Qrio product replaces the public software slot without leaking its private Flask application",()=>{
 const qrio=registry.find(x=>x.slug==="saas-product");
 assert.equal(registry.length,15);
 assert.ok(qrio?.title.startsWith("Qrio"),"software listing must display Qrio");
 assert.equal(qrio.industry,"Phần mềm");
 assert.ok(qrio.description.includes("QR"));
 assert.ok(qrio.reference.url.endsWith("/Qrio"));
 assert.equal(qrio.reference.license,"Owner project");
 assert.ok(qrio.features.some(v=>v.includes("không kết nối API")));
 assert.equal(qrio.demoPath,"/template-demos/saas-product","stable route still exists");
 const route=read("components/sovereign/SovereignDemoRoute.tsx");
 assert.match(route,/slug==="saas-product"/);
 assert.match(route,/redirect\("\/immersive\/qrio\/index\.html"\)/);
 const config=read("next.config.ts");
 assert.match(config,/source:"\/immersive\/qrio\/:path\*"/,"Qrio frame route must be scoped");
 assert.match(config,/X-Frame-Options",value:"SAMEORIGIN"/,"Qrio only iframe scope must be SAMEORIGIN");
 const modal=read("components/templates/TemplateDemoModal.tsx");
 const mobile=read("components/templates/TemplateGallery.tsx");
 assert.match(modal,/\/immersive\/qrio\/index\.html/);
 assert.match(mobile,/\/immersive\/qrio\/index\.html/);
 for(const forbidden of ["app.py","admin.py","ticket-create.html","admin_dashboard.html",".env","data/orders.db","payment.py"]){
  assert.equal(existsSync("public/immersive/qrio/"+forbidden),false,"private Qrio source leaked: "+forbidden);
 }
});
test("Qrio browser demo is self-contained, interactive and explicitly does not serve ticket/payment APIs",()=>{
 const html=read("public/immersive/qrio/index.html");
 const script=read("public/immersive/qrio/app.js");
 const credits=read("public/immersive/qrio/CREDITS.md");
 assert.match(html,/id="qr-canvas"/);
 assert.match(html,/id="download-png"/);
 assert.match(html,/id="download-svg"/);
 assert.match(html,/noindex,nofollow/);
 assert.match(html,/qrcode\.js/);
 assert.match(script,/qrcode\(0,ecc.value\)/);
 assert.match(script,/TextEncoder/);
 assert.doesNotMatch(script,/fetch\s*\(|XMLHttpRequest|sendBeacon/i);
 assert.match(credits,/private/);
 assert.match(credits,/MIT/);
 assert.ok(statSync("public/immersive/qrio/qrcode.js").size>15000);
});
test("the Qrio card and all 5 gallery images have real, versioned public assets",()=>{
 for(const key of ["saas-product","saas-product-vi","saas-product-en"]){
  const bytes=readFileSync("public/template-previews/"+key+".jpg");
  assert.ok(bytes.length>25000);
  assert.equal(createHash("sha256").update(bytes).digest("hex").slice(0,16),versions[key]);
 }
 for(let i=1;i<=5;i++)assert.ok(statSync("public/immersive/qrio/image-"+i+".jpg").size>15000);
 const capture=read("scripts/capture-template-locales-prod.mjs");
 assert.match(capture,/isQrio/);
 assert.match(capture,/qr-canvas/);
 assert.match(read("scripts/template-preview-changed.mjs"),/public\/immersive\/qrio/);
 assert.match(read(".github/workflows/template-previews-auto.yml"),/public\/immersive\/qrio\/\*\*/);
});
