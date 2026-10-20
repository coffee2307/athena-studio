import test from "node:test";
import assert from "node:assert/strict";
import {formatPilotReport} from "../scripts/sitepulse-report.mjs";
test("SitePulse Vietnamese report is explicitly sample-based and includes no fake SLA",()=>{
 const report=formatPilotReport([
  {id:"website-a",label:"Unexpected injected | columns",checkedAt:"2026-10-20T01:00:00.000Z",state:"up"},
  {id:"website-a",checkedAt:"2026-10-20T02:00:00.000Z",state:"down"},
  {id:"website-a",checkedAt:"2026-10-20T03:00:00.000Z",state:"down"}
 ]);
 assert.match(report,/Báo cáo quan sát nội bộ/);
 assert.match(report,/KHÔNG phải cam kết/);
 assert.match(report,/33\.3%/);
 assert.match(report,/website-a/);
 assert.doesNotMatch(report,/Unexpected injected/);
 const multiple=formatPilotReport([{pilotId:"pilot-a",id:"same",checkedAt:"2026-10-20T10:00:00Z",state:"up"}, {pilotId:"pilot-b",id:"same",checkedAt:"2026-10-20T11:00:00Z",state:"down"}]);
 assert.match(multiple,/pilot-a/);assert.match(multiple,/pilot-b/);
 assert.match(multiple,/100\.0%/);assert.match(multiple,/0\.0%/);
 const empty=formatPilotReport([]);
 assert.match(empty,/Chưa có kết quả kiểm tra hợp lệ/);
});
