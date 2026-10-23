import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {expectedOAuthCallback,matchesIdentityOrigin,oauthErrorAdvice} from "../lib/identity/oauth-diagnostics.ts";
import {standaloneIdentityConfig} from "../lib/identity/gate.ts";
const origin="http://127.0.0.1:3182";
test("Better Auth GitHub callback uses actual Athena basePath, not /api/auth",()=>{
 assert.equal(expectedOAuthCallback(origin,"github"),origin+"/api/identity/callback/github");
 assert.equal(expectedOAuthCallback(origin,"google"),origin+"/api/identity/callback/google");
 assert.throws(()=>expectedOAuthCallback(origin+"/path","github"));
});
test("OAuth origin guard rejects localhost versus loopback, different port and non-origin inputs",()=>{
 assert.equal(matchesIdentityOrigin(origin,origin),true);
 for(const invalid of ["http://localhost:3182","http://127.0.0.1:3000",origin+"/login","https://127.0.0.1:3182","https://evil.example"]){
  assert.equal(matchesIdentityOrigin(origin,invalid),false,invalid);
 }
});
test("OAuth failures are actionable while tokens and credentials stay out of UI",()=>{
 for(const code of ["invalid_code","state_not_found","state_mismatch","state_security_mismatch","account_not_linked","oauth_provider_not_found","email_not_verified","unable_to_create_session"]){
  const message=oauthErrorAdvice(code);
  assert.ok(message.length>25,code);assert.doesNotMatch(message,/client_secret\s*[:=]|authorization code=[a-z0-9]+/i);
 }
 assert.match(oauthErrorAdvice("unknown_error"),/OAuth chưa hoàn tất/);
});
test("Local identity accepts a GitHub-only configuration without requiring password login",()=>{
 const settings=standaloneIdentityConfig({
  NODE_ENV:"development",ATHENA_INDEPENDENT_AUTH_ENABLED:"true",ATHENA_IDENTITY_LOCAL_ONLY:"true",
  NEXT_PUBLIC_SITE_URL:origin,BETTER_AUTH_SECRET:"a".repeat(48),
  ATHENA_IDENTITY_DB_PATH:".qa/oauth-contract.sqlite",
  ATHENA_GITHUB_OAUTH_CLIENT_ID:"dummy-github-client",
  ATHENA_GITHUB_OAUTH_CLIENT_SECRET:"dummy-github-secret"
 });
 assert.ok(settings?.github);
 assert.equal(settings.localPassword,undefined);
 assert.equal(settings.origin,origin);
});
test("OAuth sign-in UI exposes only configured identity and no implicit GitHub repository access",async()=>{
 const login=await readFile(new URL("../app/login/page.tsx",import.meta.url),"utf8");
 const signup=await readFile(new URL("../app/signup/page.tsx",import.meta.url),"utf8");
 const client=await readFile(new URL("../components/auth/LocalPasswordAuth.tsx",import.meta.url),"utf8");
 const factory=await readFile(new URL("../lib/identity/factory.ts",import.meta.url),"utf8");
 assert.match(login,/identity\.localPassword\|\|identity\.github\|\|identity\.google/);
 assert.match(signup,/identity\.localPassword\|\|identity\.github\|\|identity\.google/);
 assert.match(client,/matchesIdentityOrigin\(expectedOrigin,window\.location\.origin\)/);
 assert.match(client,/errorCallbackURL:"\/login"/);
 assert.match(factory,/accountLinking:\{enabled:false\}/);
});
