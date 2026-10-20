/** Phase 8B: real A/B JWT read-only validation after authorized users and rows exist.
 * DOES NOT create users/workspaces/projects, or perform any writes.
 * JWT values and response bodies are never included in reports.
 */
import {fileURLToPath} from "node:url";
import path from "node:path";
import {validateLiveTarget} from "./phase8b-live-anon-readonly.mjs";
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function config(env){
 const target=validateLiveTarget(env);
 const users=[
  {tag:"A",jwt:env.ATHENA_A_JWT,userId:env.ATHENA_A_USER_ID,workspaceId:env.ATHENA_A_WORKSPACE_ID,projectId:env.ATHENA_A_PROJECT_ID},
  {tag:"B",jwt:env.ATHENA_B_JWT,userId:env.ATHENA_B_USER_ID,workspaceId:env.ATHENA_B_WORKSPACE_ID,projectId:env.ATHENA_B_PROJECT_ID}
 ];
 for(const u of users){
  if(typeof u.jwt!=="string"||u.jwt.split(".").length!==3||u.jwt.length<35)
   throw new Error("verified_test_jwts_required");
  if(!UUID.test(u.userId||"")||!UUID.test(u.workspaceId||""))
   throw new Error("verified_user_and_workspace_ids_required");
 }
 if(users[0].userId.toLowerCase()===users[1].userId.toLowerCase()||
    users[0].workspaceId.toLowerCase()===users[1].workspaceId.toLowerCase())
  throw new Error("A_and_B_must_be_distinct");
 const projectIds=users.map(x=>x.projectId);
 if(projectIds.some(Boolean)&&!projectIds.every(x=>UUID.test(x||"")))
  throw new Error("both_project_ids_required_or_neither");
 if(projectIds[0]&&projectIds[0].toLowerCase()===projectIds[1].toLowerCase())
  throw new Error("A_and_B_projects_must_be_distinct");
 return {target,users,withProjects:Boolean(projectIds[0])};
}
export async function runJwtABReadOnly(env,request=fetch){
 const {target,users,withProjects}=config(env);
 const headers=u=>({apikey:target.key,Authorization:`Bearer ${u.jwt}`,Accept:"application/json"});
 async function get(url,user){
  let response;
  try{
   response=await request(url,{method:"GET",headers:headers(user),redirect:"error",cache:"no-store",signal:AbortSignal.timeout(12000)});
  }catch{throw new Error("live_request_failed");}
  if(response.status!==200)throw new Error("auth_or_api_read_failed");
  try{return await response.json();}
  catch{throw new Error("invalid_json_from_provider");}
 }
 for(const u of users){
  const identity=await get(`${target.origin}/auth/v1/user`,u);
  if(!identity||identity.id!==u.userId)throw new Error("jwt_subject_mismatch");
  if(!identity.email_confirmed_at)throw new Error("auth_email_unverified");
 }

 async function compare(resource,id,owner,other){
  const url=`${target.origin}/rest/v1/${resource}?id=eq.${id}&select=id`;
  const own=await get(url,owner);
  const cross=await get(url,other);
  if(!Array.isArray(own)||own.length!==1||own[0]?.id!==id||
     !Array.isArray(cross)||cross.length!==0)
   throw new Error("tenant_read_isolation_failed");

 }
 for(let i=0;i<2;i++){
  await compare("athena_workspaces",users[i].workspaceId,users[i],users[1-i]);
  if(withProjects)await compare("athena_projects",users[i].projectId,users[i],users[1-i]);
 }
 return {
  track:"phase8b-real-jwt-ab-readonly",
  projectRef:target.ref,
  pass:true,
  verifiedAuthUsers:2,
  verifiedWorkspaceReads:4,
  verifiedProjectReads:withProjects?4:0,
  projectRowIsolationTested:withProjects,
  writesPerformed:false,
  storageIsolationTested:false,
  mutationsAndSpoofingTested:false,
  note:"Read-only tenant access proof, NOT full Phase 8B acceptance."
 };
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(!process.argv.includes("--allow-live-readonly")){
  console.error("NO_GO: explicit --allow-live-readonly required");process.exitCode=2;
 }else{
  try{console.log(JSON.stringify(await runJwtABReadOnly(process.env),null,2));}
  catch(e){console.error(`NO_GO: ${e.message}`);process.exitCode=1;}
 }
}
