import "server-only";
import path from "node:path";
import {DatabaseSync} from "node:sqlite";
import {createStandaloneAuth} from "@/lib/identity/factory";
import {standaloneIdentityConfig} from "@/lib/identity/gate";
import {gmailOtpTransport,gmailSecretsFromEnv} from "@/lib/identity/gmail";
type Instance=ReturnType<typeof createStandaloneAuth>;
let instance:Instance|null=null;
/**
 * LOCAL-ONLY proof of concept, no Supabase Auth. Never deploy a local SQLite
 * file to serverless hosting: migrate to persistent hosted DB before go-live.
 */
export function standaloneAuth():Instance|null{
 const settings=standaloneIdentityConfig();
 if(!settings)return null;
 if(instance)return instance;
 const gmail=gmailSecretsFromEnv();
 const database=new DatabaseSync(path.join(process.cwd(),settings.databaseFile));
 database.exec("PRAGMA foreign_keys=ON;");
 database.exec("PRAGMA journal_mode=WAL;");
 instance=createStandaloneAuth({...settings,database,mail:gmail?gmailOtpTransport(gmail):null});
 return instance;
}
