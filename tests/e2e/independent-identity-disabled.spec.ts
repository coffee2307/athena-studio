import {test,expect} from "@playwright/test";

test("Independent Athena Identity remains disabled by default and never leaks auth secrets",async({request})=>{
 for(const method of ["GET","POST"]){
  const path=method==="GET"
   ?"/api/identity/get-session":"/api/identity/email-otp/send-verification-otp";
  const response=await request.fetch(path,{
   method,
   ...(method==="POST"?{data:{email:"test@example.org",type:"sign-in"}}:{})
  });
  expect(response.status()).toBe(503);
  expect(response.headers()["cache-control"]).toContain("no-store");
  const body=await response.json();
  expect(body.ok).toBe(false);
  expect(JSON.stringify(body)).not.toMatch(/supabase|service[_-]?role|client[_-]?secret|refresh[_-]?token/i);
 }
});

test("Identity Lab is not reachable when independent auth is disabled",async({page})=>{
 const response=await page.goto("/identity-lab");
 expect(response?.status()).toBe(404);
 await expect(page.getByText("Truy cập đơn giản.")).toHaveCount(0);
});
