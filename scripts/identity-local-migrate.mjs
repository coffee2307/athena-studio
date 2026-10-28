/**
 * Safe local-only Better Auth migration helper.
 * Reads .env.local using the same Next env loader as the dev server.
 * Refuses CI/production/non-loopback origins/non-QA database paths.
 */
import {loadEnvConfig} from "@next/env";
import {mkdir} from "node:fs/promises";
import {dirname,join} from "node:path";
import {DatabaseSync} from "node:sqlite";
import {getMigrations} from "better-auth/db/migration";
import {standaloneIdentityConfig} from "../lib/identity/gate.ts";
import {createStandaloneAuth} from "../lib/identity/factory.ts";

if(process.env.CI==="true"||process.env.NODE_ENV==="production"){
 console.error("Identity migration is disabled outside local development.");
 process.exitCode=2;
}else{
 process.env.NODE_ENV="development";
 loadEnvConfig(process.cwd(),true);
 const settings=standaloneIdentityConfig();
 if(!settings){
  console.error("Local identity gates/configuration are not valid. No database was changed.");
  process.exitCode=2;
 }else{
  const absolute=join(process.cwd(),settings.databaseFile);
  // This helper cannot be used to point migrations at arbitrary filesystem paths.
  await mkdir(dirname(absolute),{recursive:true});
  const db=new DatabaseSync(absolute);
  try{
   db.exec("PRAGMA foreign_keys=ON");
   db.exec("PRAGMA journal_mode=WAL");
   const auth=createStandaloneAuth({...settings,database:db,mail:null});
   const plan=await getMigrations(auth.options);
   if(plan.unsafeChanges.length||plan.schemaProblems.length){
    throw new Error("Schema inspection found unsafe changes; manual review required.");
   }
   await plan.runMigrations();
   console.log("Local Better Auth schema verified in "+settings.databaseFile+" (no credentials printed).");
  }catch{
   console.error("Local identity migration failed. Do not delete the database; inspect schema before retrying.");
   process.exitCode=1;
  }finally{
   db.close();
  }
 }
}
