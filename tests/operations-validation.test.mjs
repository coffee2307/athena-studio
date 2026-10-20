import test from "node:test";
import assert from "node:assert/strict";
import {safeUuid,safeText,safeDate,allowedState,projectStatus,milestoneStatus,ticketStatus,formatDate} from "../lib/operations/models.ts";
test("operations validates UUIDs and prevents SQL-shaped IDs",()=>{
 assert.equal(safeUuid("11111111-1111-4111-8111-111111111111"),"11111111-1111-4111-8111-111111111111");
 for(const value of [null,"","../document","11111111-1111-4111-8111-111111111111' OR 1=1","not-a-uuid"])
  assert.equal(safeUuid(value),null);
});
test("status transitions only admit known values",()=>{
 assert.equal(allowedState("in_progress",projectStatus),"in_progress");
 assert.equal(allowedState("done",milestoneStatus),"done");
 assert.equal(allowedState("waiting_client",ticketStatus),"waiting_client");
 for(const payload of ["admin","closed; DROP TABLE","__proto__","toString",null]){
  assert.equal(allowedState(payload,projectStatus),null);
 }
});
test("project content rejects control sequences and overlong fields",()=>{
 assert.equal(safeText("  Nâng cấp website   ",3,150),"Nâng cấp website");
 assert.equal(safeText("A",3,150),null);
 assert.equal(safeText("x".repeat(151),3,150),null);
 assert.equal(safeText("Mật khẩu\u0000test",3,150),null);
 assert.equal(safeText("abc\nxyz",3,150),"abc\nxyz");
});
test("dates are real Gregorian dates and formatted in Vietnamese",()=>{
 assert.equal(safeDate("2026-02-29"),null);
 assert.equal(safeDate("2024-02-29"),"2024-02-29");
 assert.equal(safeDate("2026-10-20"),"2026-10-20");
 assert.equal(safeDate("2026-00-20"),null);
 assert.equal(safeDate("2026-13-20"),null);
 assert.equal(safeDate("2026-10-20';--"),null);
 assert.equal(formatDate("2026-10-20"),"20/10/2026");
});
