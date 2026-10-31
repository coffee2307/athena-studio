/**
 * Source fidelity for Digital Creators:
 * the export must be a real standalone Vite/React/Three.js app,
 * not a generic Next.js template.
 * --apply: copy verified owner project sources into independent export folder
 * --check: verify export against the canonical vendored source without mutating.
 * Does not modify vendor, running demos or production.
 */
import {cpSync,existsSync,mkdirSync,readFileSync,rmSync,writeFileSync,readdirSync} from "node:fs";
import {createHash} from "node:crypto";
import {join,relative,resolve,dirname} from "node:path";
const root=resolve(import.meta.dirname,"..");
const canonical=join(root,"vendor/digital-creators");
const target=join(root,"templates/digital-creators");
const apply=process.argv.includes("--apply");
const listed=["src","index.html","vite.config.ts","tsconfig.json","package.json",".gitignore"];
const digest=path=>createHash("sha256").update(readFileSync(path)).digest("hex");
const walk=path=>!existsSync(path)?[]:readdirSync(path,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(join(path,x.name)):[join(path,x.name)]);
const sourceSitePath=join(target,"src/data/site.json");
const previousSite=existsSync(sourceSitePath)?readFileSync(sourceSitePath,"utf8"):null;
if(apply){
 for(const p of listed){
  const from=join(canonical,p),to=join(target,p);
  if(!existsSync(from))throw Error("Missing Digital Creators canonical source "+p);
  rmSync(to,{recursive:true,force:true});
  cpSync(from,to,{recursive:true,force:true});
 }
 const targetPublic=join(target,"public");
 mkdirSync(targetPublic,{recursive:true});
 cpSync(join(canonical,"public"),targetPublic,{recursive:true,force:true});
 if(previousSite){
  mkdirSync(dirname(sourceSitePath),{recursive:true});
  writeFileSync(sourceSitePath,previousSite);
 }
 for(const name of ["next-env.d.ts","next.config.ts"])rmSync(join(target,name),{force:true});
 const pkgFile=join(target,"package.json"),pkg=JSON.parse(readFileSync(pkgFile,"utf8"));
 pkg.name="athena-template-digital-creators";
 writeFileSync(pkgFile,JSON.stringify(pkg,null,2)+"\n");
 const manifestFile=join(target,"template.manifest.json");
 const manifest=JSON.parse(readFileSync(manifestFile,"utf8"));
 manifest.status="sovereign-native-vite";
 manifest.fidelity="native React/Three.js app copied from owner project, verified with source-sha check";
 manifest.runtime="vite";
 manifest.version="0.2.0";
 writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+"\n");
 writeFileSync(join(target,"README.md"),"# Digital Creators — Independent Vite source\n\nThis is the native Digital Creators interactive website (Rubik 3D, brush illustration, LEGO city), not a generic Next.js scaffold. Site interface belongs to this project only.\n\nRun: `npm ci`, `npm run build`, then `npm run preview`. Default deployment base is `/`. Hash routes work with static hosting. External fonts may require a network connection. No production deployment is performed by this export.\n\nThe original owner project remains at `vendor/digital-creators` inside Athena. To update this exported project, run `node scripts/sovereign-digital-creators-sync.mjs --apply` from Athena root, then regenerate its package lock. `--check` blocks accidental drift. The project's design copy is authored and is not automatically replaced by a changed `site.brand` in the generic scaffolder.\n\nSee `public/ASSET-SOURCES.md` and upstream provenance.\n");
 console.log("DIGITAL_CREATORS_APPLIED native Vite source; run npm install --package-lock-only --prefix templates/digital-creators");
}
const problems=[];
for(const entry of listed){
 const from=join(canonical,entry),to=join(target,entry);
 const files=entry==="src"?walk(from):[from];
 for(const f of files){
  const rel=relative(from,f);
  const dest=entry==="src"?join(to,rel):to;
  if(!existsSync(dest)){problems.push("missing "+relative(root,dest));continue;}
  if(entry==="package.json"){
   const src=JSON.parse(readFileSync(f,"utf8")),actual=JSON.parse(readFileSync(dest,"utf8"));
   delete src.name;delete actual.name;
   if(JSON.stringify(src)!==JSON.stringify(actual))problems.push("package dependencies changed");
  }else if(digest(f)!==digest(dest))problems.push("source differs "+relative(root,dest));
 }
}
for(const f of walk(join(canonical,"public"))){
 const dest=join(target,"public",relative(join(canonical,"public"),f));
 if(!existsSync(dest)||digest(dest)!==digest(f))problems.push("asset differs "+relative(root,dest));
}
const pj=JSON.parse(readFileSync(join(target,"package.json"),"utf8"));
const m=JSON.parse(readFileSync(join(target,"template.manifest.json"),"utf8"));
if(!pj.scripts?.build?.includes("vite"))problems.push("native build must be Vite");
if(m.runtime!=="vite"||m.status!=="sovereign-native-vite")problems.push("manifest does not declare Vite export");
for(const name of ["next-env.d.ts","next.config.ts"]){
 if(existsSync(join(target,name)))problems.push("legacy Next.js scaffold remains: "+name);
}
console.log("DIGITAL_CREATORS_PARITY",JSON.stringify({sourceFiles:walk(join(canonical,"src")).length,publicAssets:walk(join(canonical,"public")).length,problems}));
if(problems.length)process.exitCode=1;
