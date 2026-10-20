/**
 * Explicit LOCAL-ONLY Athena Auth SQLite schema initialization.
 * No credentials, user profiles, tokens or sessions are created by this tool.
 * Usage (in a separately configured local shell):
 *   node --env-file=.env.local scripts/identity-local-init.mjs --initialize
 */
import {DatabaseSync} from "node:sqlite";
import {resolve} from "node:path";
import {randomBytes} from "node:crypto";
import {getMigrations} from "better-auth/db/migration";
import {standaloneIdentityConfig} from "../lib/identity/gate.ts";
import {createStandaloneAuth} from "../lib/identity/factory.ts";

const settings=standaloneIdentityConfig();
if(process.argv.length!==3||process.argv[2]!=="--initialize"||!settings){
 console.error("LOCAL_IDENTITY_INITIALIZATION_BLOCKED: require explicit local flags, provider, strong secret and --initialize");
 process.exit(1);
}
const dbFile=resolve(process.cwd(),settings.databaseFile);
const database=new DatabaseSync(dbFile);
try{
 database.exec("PRAGMA foreign_keys=ON;");
 database.exec("PRAGMA journal_mode=WAL;");
 // Offline migrations only. No real delivery transport or outbound requests.
 const auth=createStandaloneAuth({
  ...settings,secret:settings.secret||randomBytes(32).toString("base64url"),
  database,mail:null
 });
 const plan=await getMigrations(auth.options);
 if(plan.unsafeChanges.length||plan.schemaProblems.length)throw new Error("LOCAL_SCHEMA_UNSAFE");
 await plan.runMigrations();
 const required=["user","account","session","verification","rateLimit"];
 const tables=database.prepare("select name from sqlite_master where type='table'")
  .all().map(row=>row.name);
 if(required.some(name=>!tables.includes(name)))throw new Error("LOCAL_SCHEMA_INCOMPLETE");
 console.log(JSON.stringify({
  mode:"LOCAL_ONLY",migration:"APPLIED",tables:required.length,
  userCount:database.prepare('select count(*) as total from "user"').get().total,
  messagesSent:0
 }));
}catch{
 console.error("LOCAL_IDENTITY_INITIALIZATION_FAILED; database untouched by remote services.");
 process.exitCode=1;
}finally{database.close();}
