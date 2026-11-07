import {readdirSync,readFileSync} from "node:fs";
import {join} from "node:path";
const forbidden=String.fromCodePoint(0x2733);
const escapes=/\\u2733|&#(?:10035|x2733);/i;
const violations=[];
function scan(dir){for(const ent of readdirSync(dir,{withFileTypes:true})){const file=join(dir,ent.name);if(ent.isDirectory()){scan(file);continue;}if(!/\.(?:tsx?|jsx?|css|svg|json)$/.test(ent.name))continue;const s=readFileSync(file,"utf8");if(s.includes(forbidden)||escapes.test(s))violations.push(file);}}
for(const dir of ["app","components","data"]){scan(dir);}
if(violations.length){console.error("FORBIDDEN_U2733_IN_WEBSITE_UI\n"+violations.join("\n"));process.exit(1);}
console.log("DNA03 SYMBOL GATE PASS");
