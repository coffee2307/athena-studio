from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
cli=root/'scripts/create-site.mjs'
s=cli.read_text(encoding='utf-8')
s=s.replace('async function walk(folder){const entries=await readdir(folder,{withFileTypes:true});const result=[];for(const entry of entries){const path=join(folder,entry.name);if(entry.isDirectory())result.push(...await walk(path));else result.push(path);}return result;}\n','')
cli.write_text(s,encoding='utf-8')
test='''import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,join} from "node:path";
const root=resolve(import.meta.dirname,"..");
const config=JSON.parse(readFileSync(join(root,"src/data/site.json"),"utf8"));
test("template has standalone metadata, routes and local images",()=>{
 assert.ok(config.slug);
 assert.ok(config.brand);
 assert.ok(Array.isArray(config.images)&&config.images.length>0);
 for(const url of config.images)assert.equal(existsSync(join(root,"public",url.slice(1))),true,"Missing local asset "+url);
 assert.ok(existsSync(join(root,"src/app/page.tsx")));
 assert.ok(existsSync(join(root,"src/app/[section]/page.tsx")));
});
'''
for d in sorted((root/'templates').iterdir()):
 if not d.is_dir() or not (d/'package.json').is_file():continue
 nextc=d/'next.config.ts'
 z=nextc.read_text(encoding='utf-8').replace('output:"standalone"','output:"standalone",poweredByHeader:false')
 nextc.write_text(z,encoding='utf-8')
 p=d/'package.json'
 o=json.loads(p.read_text(encoding='utf-8'))
 o['scripts']['test:unit']='node --test tests/*.test.mjs'
 p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 (d/'tests').mkdir(exist_ok=True)
 (d/'tests/template-contract.test.mjs').write_text(test,encoding='utf-8')
 lock=d/'package-lock.json'
 a=json.loads(lock.read_text(encoding='utf-8'))
 # package-lock only contains dependency metadata; scripts need no change
 lock.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(d.name)
