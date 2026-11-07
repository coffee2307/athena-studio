import test from "node:test";
import assert from "node:assert/strict";
import {MARKETING_ONLY_DISABLED_FLAGS,enabledNonMarketingFlags} from "../lib/release/marketing-only-flags.mjs";

test("public marketing release must keep independent and password auth offline",()=>{
 assert.ok(MARKETING_ONLY_DISABLED_FLAGS.includes("ATHENA_INDEPENDENT_AUTH_ENABLED"));
 assert.ok(MARKETING_ONLY_DISABLED_FLAGS.includes("ATHENA_LOCAL_PASSWORD_AUTH_ENABLED"));
 assert.ok(MARKETING_ONLY_DISABLED_FLAGS.includes("ATHENA_IDENTITY_LOCAL_ONLY"));
 assert.deepEqual(enabledNonMarketingFlags({}),[]);
 for(const key of MARKETING_ONLY_DISABLED_FLAGS){
  assert.deepEqual(enabledNonMarketingFlags({[key]:"true"}),[key],key);
  assert.deepEqual(enabledNonMarketingFlags({[key]:"false"}),[],key);
 }
});

test("all non-marketing feature switches are reported when accidentally activated",()=>{
 const env=Object.fromEntries(MARKETING_ONLY_DISABLED_FLAGS.map(key=>[key,"true"]));
 assert.deepEqual(enabledNonMarketingFlags(env),MARKETING_ONLY_DISABLED_FLAGS);
});
