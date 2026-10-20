import test from "node:test";
import assert from "node:assert/strict";
import {resilientOtpTransport,canFailoverFromGmail} from "../lib/identity/mail-resilience.ts";
import {smtpOtpTransport} from "../lib/identity/smtp-core.ts";
import {gmailOtpTransport} from "../lib/identity/gmail-core.ts";
import {parseVpsIdentityConfig} from "../lib/identity/vps/config.ts";

const otp="038517",email="someone@example.test";
const settings={host:"smtp.example.test",port:587,sender:"security@example.test",username:"sender@example.test",password:"never-print-me"};
const vpsBase={
 ATHENA_VPS_IDENTITY_ENABLED:"true",
 ATHENA_VPS_RELEASE_APPROVED:"true",
 NODE_ENV:"production",
 NEXT_PUBLIC_SITE_URL:"https://athena.test",
 NEXT_PUBLIC_ATHENA_AUTH_ENABLED:"false",
 ATHENA_INDEPENDENT_AUTH_ENABLED:"false",
 ATHENA_VPS_AUTH_ORIGIN:"https://athena.test",
 ATHENA_VPS_PG_HOST:"postgres",
 ATHENA_VPS_PG_PORT:"5432",
 ATHENA_VPS_PG_DATABASE:"athena_identity",
 ATHENA_VPS_PG_USER:"athena_app",
 ATHENA_VPS_PG_PASSWORD_FILE:"/run/secrets/athena_pg_password",
 BETTER_AUTH_SECRET_FILE:"/run/secrets/athena_auth_secret",
 ATHENA_SMTP_ENABLED:"true",
 ATHENA_SMTP_HOST:"smtp.example.test",
 ATHENA_SMTP_PORT:"587",
 ATHENA_SMTP_SENDER:"security@example.test",
 ATHENA_SMTP_USERNAME:"sender@example.test",
 ATHENA_SMTP_PASSWORD_FILE:"/run/secrets/athena_smtp_password"
};
test("VPS SMTP opt-in is independent of Gmail, provider credentials never enter browser configuration",()=>{
 const cfg=parseVpsIdentityConfig(vpsBase);
 assert.equal(cfg?.smtp?.host,"smtp.example.test");
 assert.equal(cfg?.smtp?.port,587);
 assert.equal(cfg?.google,undefined);
 assert.equal(cfg?.gmail,undefined);
 for(const [name,bad] of [
  ["ATHENA_SMTP_PORT","25"],
  ["ATHENA_SMTP_PORT","1025"],
  ["ATHENA_SMTP_HOST","127.0.0.1"],
  ["ATHENA_SMTP_HOST","evil..example.com"],
  ["ATHENA_SMTP_HOST","localhost"],
  ["ATHENA_SMTP_SENDER","a\r\nBcc:evil@foo.test"],
  ["ATHENA_SMTP_USERNAME",""],
  ["ATHENA_SMTP_PASSWORD_FILE","/etc/passwd"],
  ["ATHENA_SMTP_HOST","metadata.google.internal"]
 ]){
  const env={...vpsBase,[name]:bad};
  assert.equal(parseVpsIdentityConfig(env),null,name);
 }
 const mismatch={...vpsBase,ATHENA_GMAIL_SENDER_ENABLED:"true",ATHENA_GMAIL_SENDER:"other@example.test",
  ATHENA_GMAIL_CLIENT_ID:"gmail-client-id",ATHENA_GMAIL_CLIENT_SECRET_FILE:"/run/secrets/athena_gmail_secret",
  ATHENA_GMAIL_REFRESH_TOKEN_FILE:"/run/secrets/athena_gmail_refresh"};
 assert.equal(parseVpsIdentityConfig(mismatch),null,"mail failover must use the same sender");
 assert.ok(parseVpsIdentityConfig({...mismatch,ATHENA_GMAIL_SENDER:vpsBase.ATHENA_SMTP_SENDER}));
 const disabled={...vpsBase,ATHENA_SMTP_ENABLED:"false"};
 assert.equal(parseVpsIdentityConfig(disabled),null);
});
test("SMTP OTP uses validated envelope and UTF-8 message; no retry on uncertain SMTP outcome",async()=>{
 const sent=[];
 const smtp=smtpOtpTransport(settings,{sendMail:async message=>{
  sent.push(message);
  return {accepted:[email]};
 }});
 await smtp.send(email,otp,"sign-in");
 assert.equal(sent.length,1);
 assert.equal(sent[0].to,email);
 assert.equal(sent[0].from.address,settings.sender);
 assert.match(sent[0].text,/038517/);
 assert.match(sent[0].subject,/đăng nhập/);
 await assert.rejects(smtp.send("victim@example.test\r\nBCC:attacker@example.test",otp,"sign-in"),/ATHENA_MAIL_INVALID_INPUT/);
 assert.equal(sent.length,1);
 const uncertain=smtpOtpTransport(settings,{sendMail:async()=>{
  throw Error("ECONNRESET private provider details");
 }});
 await assert.rejects(uncertain.send(email,otp,"sign-in"),e=>{
  assert.equal(e.message,"ATHENA_MAIL_UNCERTAIN");
  return true;
 });
});
test("Gmail definite pre-send rejection selects SMTP once; in-memory circuit breaker reduces quota pressure",async()=>{
 let primaryCalls=0,secondaryCalls=0,clock=1_000_000;
 const primary={async send(){primaryCalls++;if(primaryCalls===1)throw Error("ATHENA_MAIL_QUOTA");}};
 const secondary={async send(){secondaryCalls++;}};
 const send=resilientOtpTransport(primary,secondary,()=>clock);
 await send.send(email,otp,"sign-in");
 assert.equal(primaryCalls,1);
 assert.equal(secondaryCalls,1);
 assert.equal(send.state().primarySkips,1);
 clock+=20_000;
 await send.send(email,otp,"sign-in");
 assert.equal(primaryCalls,1,"skip Gmail during quota cooldown");
 assert.equal(secondaryCalls,2);
 clock+=10_001;
 await send.send(email,otp,"sign-in");
 assert.equal(primaryCalls,2);
 assert.equal(secondaryCalls,2);
 assert.equal(send.state().primarySkips,0);
});
test("No automatic failover when status is ambiguous; prevents duplicated OTP mail",async()=>{
 for(const message of ["ATHENA_MAIL_UNCERTAIN","ATHENA_MAIL_UNAVAILABLE","random failure"]){
  let secondaryCalls=0;
  const send=resilientOtpTransport({
   async send(){throw Error(message);}
  },{
   async send(){secondaryCalls++;}
  });
  await assert.rejects(send.send(email,otp,"sign-in"),/ATHENA_MAIL_UNAVAILABLE/);
  assert.equal(secondaryCalls,0,message);
  assert.equal(canFailoverFromGmail(Error(message)),false);
 }
 assert.equal(canFailoverFromGmail(Error("ATHENA_MAIL_TOKEN_INVALID")),true);
 assert.equal(canFailoverFromGmail(Error("ATHENA_MAIL_TOKEN_UNAVAILABLE")),true);
 assert.equal(canFailoverFromGmail(Error("ATHENA_MAIL_QUOTA")),true);
 assert.throws(()=>resilientOtpTransport(undefined,undefined),/ATHENA_MAIL_NO_PROVIDER/);
});
test("Gmail HTTP 500 after submit is uncertain and never triggers fallback",async()=>{
 let requests=0,smtpCalls=0;
 const gmail=gmailOtpTransport({
  sender:"security@example.test",clientId:"client-id",clientSecret:"client-secret",refreshToken:"refresh-token"
 },async()=>{requests++;
  if(requests===1)return new Response(JSON.stringify({access_token:"mock-token"}),{status:200});
  return new Response(JSON.stringify({error:"provider-busy"}),{status:500});
 });
 const sender=resilientOtpTransport(gmail,{async send(){smtpCalls++;}});
 await assert.rejects(sender.send(email,otp,"sign-in"),/ATHENA_MAIL_UNAVAILABLE/);
 assert.equal(requests,2);
 assert.equal(smtpCalls,0);
});
test("Gmail HTTP 429 explicit rejection falls back once without storing raw OTP",async()=>{
 let requests=0,smtpCalls=0;
 const gmail=gmailOtpTransport({
  sender:"security@example.test",clientId:"client-id",clientSecret:"client-secret",refreshToken:"refresh-token"
 },async()=>{requests++;
  if(requests===1)return new Response(JSON.stringify({access_token:"mock-token"}),{status:200});
  return new Response("rate_limited",{status:429});
 });
 const sender=resilientOtpTransport(gmail,{async send(target,code,purpose){
  assert.equal(target,email);
  assert.equal(code,otp);
  assert.equal(purpose,"sign-in");
  smtpCalls++;
 }});
 await sender.send(email,otp,"sign-in");
 assert.equal(requests,2);
 assert.equal(smtpCalls,1);
});
test("SMTP-only mode works with no Gmail OAuth and does not invent a fallback",async()=>{
 let sendCount=0;
 const sender=resilientOtpTransport(undefined,{
  async send(){sendCount++;}
 });
 await sender.send(email,otp,"sign-in");
 assert.equal(sendCount,1);
 const failure=resilientOtpTransport(undefined,{async send(){throw Error("private host details");}});
 await assert.rejects(failure.send(email,otp,"sign-in"),e=>{
  assert.equal(e.message,"ATHENA_MAIL_UNAVAILABLE");return true;
 });
});


test("PostgreSQL-backed Athena OTP survives a definite Gmail quota rejection via SMTP fallback",async()=>{
 const {PGlite}=await import("@electric-sql/pglite");
 const {PGLiteSocketServer}=await import("@electric-sql/pglite-socket");
 const {Pool}=await import("pg");
 const {getMigrations}=await import("better-auth/db/migration");
 const {createVpsIdentityAuth}=await import("../lib/identity/vps/factory.ts");
 const {readFile}=await import("node:fs/promises");
 const {createServer}=await import("node:net");
 const {randomBytes}=await import("node:crypto");
 const probe=createServer();
 await new Promise((resolve,reject)=>probe.once("error",reject).listen(0,"127.0.0.1",resolve));
 const port=probe.address().port;
 await new Promise(resolve=>probe.close(resolve));
 const db=await PGlite.create();
 const service=new PGLiteSocketServer({db,host:"127.0.0.1",port,maxConnections:3});
 let pool;
 try{
  await db.exec("CREATE ROLE athena_app");
  await db.exec(await readFile(new URL("../deploy/vps/migrations/001_better_auth.sql",import.meta.url),"utf8"));
  await db.exec(await readFile(new URL("../deploy/vps/migrations/002_workspace.sql",import.meta.url),"utf8"));
  await service.start();
  pool=new Pool({host:"127.0.0.1",port,user:"postgres",database:"postgres",password:"fake",max:2});
  const mail=[];
  const routed=resilientOtpTransport({
   async send(){throw Error("ATHENA_MAIL_QUOTA");}
  },{
   async send(target,code,purpose){mail.push({target,code,purpose});}
  });
  const auth=createVpsIdentityAuth({
   origin:"http://localhost:3000",secret:randomBytes(48).toString("base64url"),
   pool,mail:routed
  });
  const migrations=await getMigrations(auth.options);
  assert.deepEqual(migrations.toBeCreated,[]);
  const result=await auth.api.sendVerificationOTP({body:{email,type:"sign-in"}});
  assert.equal(result.success,true);
  assert.equal(mail.length,1);
  assert.equal(mail[0].target,email);
  assert.match(mail[0].code,/^\d{6}$/);
  const values=await pool.query('SELECT value FROM "verification"');
  assert.ok(values.rows.length>0&&values.rows.every(x=>!String(x.value).includes(mail[0].code)));
  const login=await auth.api.signInEmailOTP({body:{email,otp:mail[0].code}});
  assert.equal(login.user.emailVerified,true);
  assert.ok(login.token);
  await assert.rejects(auth.api.signInEmailOTP({body:{email,otp:mail[0].code}}));
 }finally{
  if(pool)await pool.end();
  await service.stop();
  await db.close();
 }
});


test("Gmail API refresh token is only exchanged once while short-lived access token remains valid",async()=>{
 let oauthCalls=0,sendCalls=0;
 const gmail=gmailOtpTransport({
  sender:"security@example.test",clientId:"client-id",clientSecret:"secret",refreshToken:"refresh"
 },async(url)=>{
  if(String(url).includes("oauth2.googleapis.com")){
   oauthCalls++;
   return new Response(JSON.stringify({access_token:"mock-access",expires_in:3600}),{status:200});
  }
  sendCalls++;
  return new Response(JSON.stringify({id:"gmail-message-"+sendCalls}),{status:200});
 });
 await gmail.send(email,otp,"sign-in");
 await gmail.send(email,"538206","sign-in");
 assert.equal(oauthCalls,1,"OAuth token cache saves repeated roundtrips");
 assert.equal(sendCalls,2,"each unique OTP is still sent once");
});
test("A definite Gmail 401 clears cached token and allows SMTP fallback only once",async()=>{
 let oauthCalls=0,sendCalls=0,fallbackCalls=0;
 const gmail=gmailOtpTransport({
  sender:"security@example.test",clientId:"client-id",clientSecret:"secret",refreshToken:"refresh"
 },async url=>{
  if(String(url).includes("oauth2.googleapis.com")){
   oauthCalls++;
   return new Response(JSON.stringify({access_token:"mock-access",expires_in:3600}),{status:200});
  }
  sendCalls++;
  return new Response("unauthorized",{status:401});
 });
 const backup=resilientOtpTransport(gmail,{async send(){fallbackCalls++;}});
 await backup.send(email,otp,"sign-in");
 assert.equal(fallbackCalls,1);
 assert.equal(sendCalls,1);
 assert.equal(oauthCalls,1);
 assert.equal(canFailoverFromGmail(Error("ATHENA_MAIL_AUTH_REJECTED")),true);
});


test("Concurrent OTP sends share one Gmail OAuth token refresh, not three",async()=>{
 let refreshes=0,sent=0;
 const gmail=gmailOtpTransport({
  sender:"security@example.test",clientId:"id",clientSecret:"secret",refreshToken:"refresh"
 },async url=>{
  if(String(url).includes("oauth2.googleapis.com")){
   refreshes++;
   await new Promise(resolve=>setTimeout(resolve,30));
   return new Response(JSON.stringify({access_token:"fresh-token",expires_in:3600}),{status:200});
  }
  sent++;
  return new Response(JSON.stringify({id:"mock-"+sent}),{status:200});
 });
 await Promise.all([
  gmail.send(email,"123456","sign-in"),
  gmail.send(email,"234567","sign-in"),
  gmail.send(email,"345678","sign-in")
 ]);
 assert.equal(refreshes,1);
 assert.equal(sent,3);
});
