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
 const empty=formatPilotReport([]);
 assert.match(empty,/Chưa có kết quả kiểm tra hợp lệ/);
});
