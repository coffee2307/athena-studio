import {createHash} from "node:crypto";

/**
 * A model supplied for private QA is not automatically licensed for public
 * redistribution. Keep the production decision tied to the exact asset hash,
 * a documented grant and a separate owner sign-off.
 */
export function modelPublicationRights({asset,attribution,ownerApproved=false}){
 const lines=String(attribution||"");
 const field=name=>{
  const value=lines.match(new RegExp(`^\\s*[-*]\\s*${name}:\\s*(.+?)\\s*$`,"im"))?.[1]?.trim()||"";
  return value&&!/^(?:none|unknown|unverified|pending|tbd|n\/a)$/i.test(value)?value:null;
 };
 const recordedHash=field("SHA-256");
 const currentHash=asset?createHash("sha256").update(asset).digest("hex"):null;
 const rightsHolder=field("Rights holder");
 const redistributionBasis=field("Public redistribution basis");
 const evidenceReference=field("Approval evidence reference");
 const unresolved=/no established author\/license|verify redistribution rights|not verified for public distribution/i.test(lines);
 const allowed=Boolean(ownerApproved&&currentHash&&recordedHash===currentHash&&
  rightsHolder&&redistributionBasis&&evidenceReference&&!unresolved);
 return {allowed,hashMatches:Boolean(currentHash&&recordedHash===currentHash),
  hasRightsRecord:Boolean(rightsHolder&&redistributionBasis&&evidenceReference&&!unresolved),
  ownerApproved:Boolean(ownerApproved)};
}
