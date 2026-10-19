import test from "node:test";
import assert from "node:assert/strict";
import {parseInquiry,escapeHtml,formatMail} from "../lib/inquiry/validation.ts";
const valid={
 name:"  Nguyễn Văn An ",email:"HELLO@example.com",company:"ATHENA",
 service:"web-development",message:"Tôi muốn thiết kế website chuyên nghiệp cho cửa hàng mới.",website:"",captcha:"sample-token",consent:true
};
test("contact request normalized and validated",()=>{
 const x=parseInquiry(valid);assert.equal(x.ok,true);
 if(x.ok){assert.equal(x.value.name,"Nguyễn Văn An");assert.equal(x.value.email,"hello@example.com");assert.equal(x.value.consent,true);}
});
test("customer privacy opt-in is mandatory",()=>{
 const x=parseInquiry({...valid,consent:false});assert.equal(x.ok,false);
});
test("known services only and valid message length",()=>{
 assert.equal(parseInquiry({...valid,service:"bogus"}).ok,false);
 assert.equal(parseInquiry({...valid,message:"short"}).ok,false);
 assert.equal(parseInquiry({...valid,email:"invalid"}).ok,false);
 assert.equal(parseInquiry({...valid,name:"A"}).ok,false);
});
test("malformed and overlong data is rejected",()=>{
 assert.equal(parseInquiry([]).ok,false);
 assert.equal(parseInquiry(null).ok,false);
 assert.equal(parseInquiry({...valid,name:"A".repeat(101)}).ok,false);
 assert.equal(parseInquiry({...valid,message:"A".repeat(4001)}).ok,false);
 assert.equal(parseInquiry({...valid,name:"OK\u0000bad"}).ok,false);
});
test("email template escapes untrusted HTML and includes saved reference",()=>{
 const item=parseInquiry({...valid,message:"Tôi muốn <script>alert(1)</script> có hệ thống <đơn hàng>."});
 assert.equal(item.ok,true);
 if(item.ok){
 const html=formatMail(item.value,"db-reference");
 assert.match(html,/db-reference/);assert.doesNotMatch(html,/<script>/);
 assert.match(html,/&lt;script&gt;/);assert.match(html,/Yêu cầu tư vấn mới/);
 }
 assert.equal(escapeHtml("<a>&\"'"),"&lt;a&gt;&amp;&quot;&#39;");
});
