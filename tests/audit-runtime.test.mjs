import {strict as assert} from "node:assert";
import {test} from "node:test";
import {classifyAudit,auditCommand} from "../scripts/audit-runtime.mjs";

test("A completed clean npm security audit passes",()=>{
 assert.equal(classifyAudit(0,"found 0 vulnerabilities"),"pass");
});
test("High/critical vulnerabilities never pass and are never misclassified as service outages",()=>{
 assert.equal(classifyAudit(1,"3 vulnerabilities (1 moderate, 2 high)"),"failure");
 assert.equal(classifyAudit(1,"npm warn audit 503 Service Unavailable\n2 vulnerabilities (2 high)"),"failure");
});
test("Only specifically identified transient registry outages can retry",()=>{
 for(const message of [
  "npm warn audit 503 Service Unavailable - POST https://registry.npmjs.org/-/npm/v1/security/advisories/bulk",
  "npm warn audit 429 Too Many Requests",
  "npm error audit endpoint returned an error",
  "npm error code ETIMEDOUT",
  "npm warn audit 502 Bad Gateway"
 ])assert.equal(classifyAudit(1,message),"transient",message);
});
test("Unknown npm errors and incomplete reports fail closed",()=>{
 for(const message of [
  "npm error Invalid package lock",
  "npm error Unexpected audit JSON",
  "",
  "npm error audit unable to calculate dependencies"
 ])assert.equal(classifyAudit(1,message),"failure",message);
});
test("Audits production dependencies at the high severity threshold and does not skip auditing",()=>{
 const [program,args]=auditCommand();
 assert.ok(program);
 assert.ok(args.includes("audit"));
 assert.ok(args.includes("--omit=dev"));
 assert.ok(args.includes("--audit-level=high"));
 assert.ok(!args.includes("--offline"));
 assert.ok(!args.includes("--no-audit"));
});
