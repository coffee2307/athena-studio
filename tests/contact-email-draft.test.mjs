import {strict as assert} from "node:assert";
import {test} from "node:test";
import {createInquiryEmailDraft} from "../lib/contact-email-draft.ts";

const valid={
 name:"Nguyễn Văn A",
 email:"a@example.com",
 service:"website-care",
 message:"Website tải chậm trên điện thoại, cần kiểm tra và cải thiện."
};
test("Fallback creates a real user-reviewed mailto draft with correctly encoded Vietnamese",()=>{
 const draft=createInquiryEmailDraft(valid,"coffee2307@gmail.com");
 const url=new URL(draft.href);
 assert.equal(url.protocol,"mailto:");
 assert.equal(url.pathname,"coffee2307@gmail.com");
 assert.match(url.searchParams.get("subject")||"",/Chăm sóc website/);
 assert.match(url.searchParams.get("body")||"",/Nguyễn Văn A/);
 assert.match(url.searchParams.get("body")||"",/chưa được gửi tự động/);
 assert.doesNotMatch(draft.href,/\n/);
});
test("Fallback refuses incomplete/invalid requests without making any network request",()=>{
 const bad=[
  {...valid,name:" "},{...valid,email:"not-an-email"},{...valid,service:"invalid"},
  {...valid,message:"quá ngắn"},{...valid,message:"X".repeat(4001)}
 ];
 for(const fields of bad)assert.throws(()=>createInquiryEmailDraft(fields,"coffee2307@gmail.com"));
});

test("Project brief keeps the selected template version, goal, optional budget and schedule in the reviewed email",()=>{
 const draft=createInquiryEmailDraft({...valid,service:"web-development",template:"Studio sáng tạo",templateSlug:"creative-studio",templateVersion:"1.0.0",projectGoal:"Giới thiệu portfolio và nhận yêu cầu tư vấn.",budget:"10-30m",timeline:"1-3-months"},"coffee2307@gmail.com");
 assert.match(draft.body,/creative-studio.*1\.0\.0/);
 assert.match(draft.body,/Giới thiệu portfolio và nhận yêu cầu tư vấn\./);
 assert.match(draft.body,/10–30 triệu/);
 assert.match(draft.body,/1–3 tháng/);
 assert.match(draft.body,/chưa được gửi tự động/);
});
test("Project brief never silently truncates a long customer message",()=>{
 assert.throws(()=>createInquiryEmailDraft({...valid,message:"A".repeat(3990),projectGoal:"Mục tiêu dài để kiểm tra giới hạn tổng nội dung dự án."},"coffee2307@gmail.com"),/4.000|quá dài/);
});
test("Project brief refuses unknown option values and control characters",()=>{
 for(const extra of [{budget:"unverified"},{timeline:"yesterday"},{projectGoal:"bad\u0000goal"}])
  assert.throws(()=>createInquiryEmailDraft({...valid,...extra},"coffee2307@gmail.com"));
});
