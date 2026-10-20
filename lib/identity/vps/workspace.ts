import type {Pool} from "pg";
export type WorkspaceForUser={
 id:string;title:string;kind:"studio"|"client";role:"admin"|"member"|"client";
};
/** Only server-attested Better Auth subject ID is eligible. Never take user_id from query/body. */
export async function listOwnedWorkspaces(
 pool:Pick<Pool,"query">,verifiedUserId:string
):Promise<WorkspaceForUser[]>{
 if(!verifiedUserId||verifiedUserId.length>128||/[\u0000-\u001f]/.test(verifiedUserId))
  throw new Error("INVALID_IDENTITY_SUBJECT");
 const query=[
  "SELECT w.id,w.title,w.kind,m.role",
  "FROM athena_membership m",
  "JOIN athena_workspace w ON w.id=m.workspace_id",
  "WHERE m.user_id=$1",
  "ORDER BY w.created_at DESC,w.id ASC",
  "LIMIT 50"
 ].join(" ");
 const result=await pool.query<WorkspaceForUser>(query,[verifiedUserId]);
 return result.rows;
}
