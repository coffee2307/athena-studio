import {test,expect} from "@playwright/test";
test("VPS-only workspace API fails closed without explicit release approval",async({request})=>{
 const response=await request.get("/api/athena/workspaces");
 expect(response.status()).toBe(503);
 expect(response.headers()["cache-control"]).toContain("no-store");
 const body=await response.json();
 expect(body.ok).toBe(false);
 expect(JSON.stringify(body)).not.toMatch(/token|pg_password|private_key|oauth_client_secret/i);
});
