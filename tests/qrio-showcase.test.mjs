import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
const read=p=>readFileSync(p,"utf8");
const registry=JSON.parse(read("data/templates.json"));
const versions=JSON.parse(read("data/template-preview-versions.json"));

test("original Qrio HTML/CSS and native project selection replace the invented QR Studio landing",()=>{
 const qrio=registry.find(x=>x.slug==="saas-product");
 assert.equal(registry.length,15);
 assert.ok(qrio?.title.startsWith("Qrio"));
 assert.equal(qrio.industry,"Phần mềm");
 assert.equal(qrio.reference.license,"Owner project");
 assert.ok(qrio.reference.url.endsWith("/Qrio"));
 assert.equal(qrio.demoPath,"/template-demos/saas-product");
 const home=read("public/immersive/qrio/index.html");
 assert.match(home,/class="hero-title"/);
 assert.match(home,/id="project-modal"/);
 assert.match(home,/id="project-choice-qr"/);
 assert.match(home,/id="project-choice-ticket"/);
 assert.match(home,/createQrProjectAndGo/);
 assert.match(home,/\/immersive\/qrio\/static\/logo\/logo\.png/);
 assert.match(home,/noindex,nofollow/);
 assert.doesNotMatch(home,/<h1 id="hero-title">/);
 assert.equal(read("public/immersive/qrio/home.html"),home);
 const editor=read("public/immersive/qrio/edit.html");
 assert.match(editor,/function generateQR\(\)/);
 assert.match(editor,/class="qr-base"/);
 assert.match(editor,/local-api-bridge\.js/);
 assert.match(editor,/qrcode\.js/);
 const demo=read("components/sovereign/SovereignDemoRoute.tsx");
 assert.match(demo,/redirect\("\/immersive\/qrio\/index\.html"\)/);
 assert.match(read("components/templates/TemplateDemoModal.tsx"),/\/immersive\/qrio\/index\.html/);
});
test("public Qrio frontend is isolated from Flask, customer data and payment APIs",()=>{
 const bridge=read("public/immersive/qrio/local-api-bridge.js");
 assert.match(bridge,/api\/generate/);
 assert.match(bridge,/qrcode\(0,ecc\)/);
 assert.match(bridge,/input\.pathname\.startsWith\("\/api\/"\)/);
 assert.match(bridge,/VietQR cần kết nối API ngân hàng/);
 assert.match(read("next.config.ts"),/source:"\/immersive\/qrio\/:path\*"/);
 assert.match(read("public/immersive/qrio/CREDITS.md"),/client-facing HTML/);
 assert.match(read("public/immersive/qrio/ticket-create.html"),/Chức năng vé đang ở hệ thống Qrio gốc/);
 for(const forbidden of ["app.py","admin.py","admin_dashboard.html",".env","data/orders.db","payment.py"]){
  assert.equal(existsSync("public/immersive/qrio/"+forbidden),false,"private backend exposed: "+forbidden);
 }
 assert.ok(statSync("public/immersive/qrio/qrcode.js").size>15000);
});
test("Qrio original VI/EN cover images and full native gallery are versioned",()=>{
 for(const key of ["saas-product","saas-product-vi","saas-product-en"]){
  const bytes=readFileSync("public/template-previews/"+key+".jpg");
  assert.ok(bytes.length>25000);
  assert.equal(createHash("sha256").update(bytes).digest("hex").slice(0,16),versions[key]);
 }
 for(let i=1;i<=5;i++)assert.ok(statSync("public/immersive/qrio/image-"+i+".jpg").size>20000);
 assert.match(read("scripts/capture-template-locales-prod.mjs"),/isQrio/);
 assert.match(read("scripts/capture-template-locales-prod.mjs"),/\.hero-title/);
 assert.match(read("scripts/template-preview-changed.mjs"),/public\/immersive\/qrio/);
});
