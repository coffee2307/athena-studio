#!/usr/bin/env node
import {createHash} from "node:crypto";
import {createReadStream} from "node:fs";
import {lstat,readdir,readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ARCHIVE=/^athena-identity-(\d{8})T(\d{6})Z-([A-Za-z0-9]+)\.age$/;
const DEFAULT_MAX_AGE_HOURS=36;

async function sha256(file){
 const hash=createHash("sha256");
 for await(const chunk of createReadStream(file))hash.update(chunk);
 return hash.digest("hex");
}
function archiveTime(name){
 const match=ARCHIVE.exec(name);
 if(!match)return null;
 const day=match[1],time=match[2];
 const value=Date.parse(day.slice(0,4)+"-"+day.slice(4,6)+"-"+day.slice(6,8)+"T"+time.slice(0,2)+":"+time.slice(2,4)+":"+time.slice(4,6)+"Z");
 if(!Number.isFinite(value))return null;
 const parsed=new Date(value);
 return parsed.getUTCFullYear()===Number(day.slice(0,4))&&parsed.getUTCMonth()+1===Number(day.slice(4,6))&&parsed.getUTCDate()===Number(day.slice(6,8))&&parsed.getUTCHours()===Number(time.slice(0,2))&&parsed.getUTCMinutes()===Number(time.slice(2,4))&&parsed.getUTCSeconds()===Number(time.slice(4,6))?value:null;
}
export async function inspectBackupDirectory(directory,{now=Date.now(),maxAgeHours=DEFAULT_MAX_AGE_HOURS}={}){
 if(!Number.isFinite(maxAgeHours)||maxAgeHours<1||maxAgeHours>24*31)throw new Error("Invalid maximum backup age");
 const dirStat=await lstat(directory);
 if(!dirStat.isDirectory()||dirStat.isSymbolicLink())throw new Error("Backup path must be a real directory");
 const entries=await readdir(directory,{withFileTypes:true});
 let partial=false,unverifiedArchives=0;
 const valid=[];
 for(const entry of entries){
  if(entry.name.endsWith(".age.part")){partial=true;continue;}
  if(!entry.name.endsWith(".age"))continue;
  if(!ARCHIVE.test(entry.name)){unverifiedArchives++;continue;}
  const timestamp=archiveTime(entry.name);
  if(timestamp===null){unverifiedArchives++;continue;}
  const archive=path.join(directory,entry.name);
  const signature=archive+".sha256";
  try{
   const [archiveStat,manifestStat,manifest]=await Promise.all([lstat(archive),lstat(signature),readFile(signature,"utf8")]);
   if(!archiveStat.isFile()||archiveStat.isSymbolicLink()||archiveStat.size===0||!manifestStat.isFile()||manifestStat.isSymbolicLink()||manifestStat.size>512){unverifiedArchives++;continue;}
   const expected=await sha256(archive)+"  "+entry.name+"\n";
   if(manifest!==expected){unverifiedArchives++;continue;}
   valid.push({timestamp});
  }catch{unverifiedArchives++;/* Ignore details; report only aggregate status. */}
 }
 valid.sort((a,b)=>b.timestamp-a.timestamp);
 const latest=valid[0]?.timestamp??null;
 const ageMs=latest===null?null:now-latest;
 const stale=latest===null||ageMs< -5*60_000||ageMs>maxAgeHours*60*60_000;
 return {status:partial||stale||unverifiedArchives>0?"attention":"ok",validArchives:valid.length,unverifiedArchives,latestAgeHours:ageMs===null?null:Math.round(ageMs/36_000)/100,partialArchive:partial,stale};
}
async function main(){
 const directory=process.env.ATHENA_BACKUP_DIR;
 if(!directory){process.stderr.write("ATHENA_BACKUP_DIR is required\n");process.exitCode=2;return;}
 const maxAgeHours=Number(process.env.ATHENA_BACKUP_MAX_AGE_HOURS||DEFAULT_MAX_AGE_HOURS);
 try{
  const status=await inspectBackupDirectory(directory,{maxAgeHours});
  process.stdout.write(JSON.stringify(status)+"\n");
  if(status.status!=="ok")process.exitCode=1;
 }catch{
  process.stderr.write("Backup status unavailable; check path permissions and configuration\n");
  process.exitCode=2;
 }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
