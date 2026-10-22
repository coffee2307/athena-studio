import {spawn} from "node:child_process";
import {resolve} from "node:path";
const command=process.argv[2];
if(command!=="build"&&command!=="start"){
 console.error("Use: npm run preview:build OR npm run preview:start");
 process.exit(2);
}
const nextBin=resolve("node_modules/next/dist/bin/next");
const args=[nextBin,command,...(command==="start"?["-H","127.0.0.1","-p","3182"]:[])];
const child=spawn(process.execPath,args,{
 cwd:process.cwd(),
 env:{...process.env,ATHENA_NEXT_DIST_DIR:".next-preview"},
 stdio:"inherit",
 windowsHide:true
});
for(const signal of ["SIGTERM","SIGINT"]){
 process.on(signal,()=>child.kill(signal));
}
child.on("error",error=>{console.error(error.message);process.exitCode=1});
child.on("exit",(code,signal)=>{process.exitCode=code??(signal?1:0)});
