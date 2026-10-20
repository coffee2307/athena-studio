/** Athena Phase 8B: LIVE, read-only anonymous boundary checks.
 * No users, tokens, writes, seeds, signups or storage changes.
 * A PASS is NOT evidence of real JWT A/B tenant isolation.
 */
export const PROTECTED_TABLES=Object.freeze([
  "athena_inquiries","athena_profiles","athena_workspaces",
  "athena_memberships","athena_projects","athena_milestones",
  "athena_tickets","athena_ticket_messages","athena_documents",
  "athena_notifications","athena_audit_events"
]);
const REF_PATTERN=/^[a-z]{20}$/;
const BLOCKED=new Set([401,403,404]);
export function validateLiveTarget(env){
  const ref=env.ATHENA_STAGING_PROJECT_REF;
  const raw=env.NEXT_PUBLIC_SUPABASE_URL;
  const key=env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!REF_PATTERN.test(ref||""))throw new Error("missing_or_invalid_staging_project_ref");
  if(typeof raw!=="string"||raw!==`https://${ref}.supabase.co`)
    throw new Error("staging_project_url_mismatch");
  if(typeof key!=="string"||!key.startsWith("sb_publishable_")||key.length<24)
    throw new Error("missing_publishable_key");
  if(env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED==="true"||
     env.NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED==="true"||
     env.ATHENA_OPERATIONS_ENABLED==="true"||
     env.ATHENA_SITEPULSE_ENABLED==="true")
    throw new Error("public_features_must_remain_disabled");
  return {ref,origin:raw,key};
}
export async function runLiveAnonReadOnly(env, request=fetch){
  const {ref,origin,key}=validateLiveTarget(env);
  const headers={apikey:key,Accept:"application/json"};
  const result=[];
  for(const table of PROTECTED_TABLES){
    const url=`${origin}/rest/v1/${table}?select=*&limit=1`;
    let status="network_error";
    for(let attempt=0;attempt<2;attempt++){
      try{
        const res=await request(url,{method:"GET",headers,signal:AbortSignal.timeout(12000),redirect:"error",cache:"no-store"});
        status=res.status;
        break;
      }catch{ /* transient network error; never log secrets or response bodies */ }
    }
    result.push({resource:table,status,blocked:BLOCKED.has(status)});
  }
  const allBlocked=result.every(x=>x.blocked);
  return {
    track:"phase8b-live-anonymous-readonly",
    projectRef:ref,
    checkedResources:result.length,
    blockedResources:result.filter(x=>x.blocked).length,
    pass:allBlocked,
    results:result,
    realAuthUsersCreated:false,
    realJwtABIsolationTested:false,
    writesPerformed:false,
    caution:"401/403/404 means denied/not exposed, not proof of per-tenant RLS. Real JWT A/B with authorized accounts is still required."
  };
}
if(process.argv[1]&&import.meta.url===new URL(`file:///${process.argv[1].replaceAll("\\","/")}`).href){
  if(!process.argv.includes("--allow-live-readonly")){
    console.error("NO_GO: add --allow-live-readonly to acknowledge real HTTP GET requests");
    process.exitCode=2;
  }else{
    try{
      const report=await runLiveAnonReadOnly(process.env);
      console.log(JSON.stringify(report,null,2));
      if(!report.pass)process.exitCode=1;
    }catch(e){
      console.error(`NO_GO: ${e.message}`);
      process.exitCode=2;
    }
  }
}
