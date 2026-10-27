import {copyFileSync,existsSync,mkdirSync} from "node:fs";
import {join} from "node:path";

const source=join(process.cwd(),"node_modules","three","examples","jsm","libs","draco");
const target=join(process.cwd(),"public","draco");
const files=["draco_wasm_wrapper.js","draco_decoder.wasm","draco_decoder.js"];
if(!existsSync(source)){
 console.error("Three.js Draco decoder is missing from node_modules.");
 process.exit(1);
}
mkdirSync(target,{recursive:true});
for(const file of files){
 const src=join(source,file);
 if(!existsSync(src)){console.error("Missing Draco file:",file);process.exitCode=1;continue;}
 copyFileSync(src,join(target,file));
 console.log("Self-hosted Draco decoder:",file);
}
