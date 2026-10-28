import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {modelPublicationRights} from "../lib/release/model-rights.mjs";

const asset=Buffer.from("synthetic model fixture");
const sha=createHash("sha256").update(asset).digest("hex");
const verified=[
 `- SHA-256: ${sha}`,
 "- Rights holder: Artist Example",
 "- Public redistribution basis: Direct nonexclusive written license",
 "- Approval evidence reference: private/asset-consent-2026-10"
].join("\n");

test("Production model rights require a matching asset hash and explicit owner approval",()=>{
 assert.equal(modelPublicationRights({asset,attribution:verified}).allowed,false);
 assert.equal(modelPublicationRights({asset,attribution:verified,ownerApproved:true}).allowed,true);
 assert.equal(modelPublicationRights({asset:Buffer.from("changed"),attribution:verified,ownerApproved:true}).allowed,false);
});

test("Missing rights, generic approval and unresolved attribution never permit release",()=>{
 assert.equal(modelPublicationRights({asset,attribution:"",ownerApproved:true}).allowed,false);
 assert.equal(modelPublicationRights({asset:null,attribution:verified,ownerApproved:true}).allowed,false);
 assert.equal(modelPublicationRights({asset,attribution:verified+"\n- No established author/license",ownerApproved:true}).allowed,false);
 assert.equal(modelPublicationRights({asset,attribution:verified.replace("Artist Example","Unknown"),ownerApproved:true}).allowed,false);
});

test("User-supplied McLaren P1 is attributed under CC BY with recorded provenance",()=>{
 const currentAsset=readFileSync(new URL("../public/models/mclaren.glb",import.meta.url));
 const currentAttribution=readFileSync(new URL("../public/models/ATTRIBUTION.md",import.meta.url),"utf8");
 assert.match(currentAttribution,/vecarz \(@heynic\)/);
 assert.match(currentAttribution,/creativecommons\.org\/licenses\/by\/4\.0/);
 const result=modelPublicationRights({asset:currentAsset,attribution:currentAttribution,ownerApproved:true});
 assert.equal(result.hashMatches,true);
 assert.equal(result.hasRightsRecord,true);
 assert.equal(result.allowed,true);
});
