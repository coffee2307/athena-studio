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
