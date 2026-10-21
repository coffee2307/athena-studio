import test from "node:test";
import assert from "node:assert/strict";
import {classifyTransportError} from "../lib/sitepulse/core.mjs";
test("Transport diagnostic codes map to safe categories, never raw error messages",()=>{
 const examples=[
  ["CERT_HAS_EXPIRED","tls_certificate_error"],
  ["ERR_TLS_CERT_ALTNAME_INVALID","tls_certificate_error"],
  ["UNABLE_TO_VERIFY_LEAF_SIGNATURE","tls_certificate_error"],
  ["EPROTO","tls_handshake_error"],
  ["ERR_SSL_WRONG_VERSION_NUMBER","tls_handshake_error"],
  ["ECONNRESET","connection_reset"],
  ["ECONNREFUSED","connection_refused"],
  ["ETIMEDOUT","connection_timeout"],
  ["ESOCKETTIMEDOUT","connection_timeout"],
  ["ENETUNREACH","network_unreachable"],
  ["EHOSTUNREACH","network_unreachable"],
  ["ENOTFOUND","dns_failed"],
  ["EAI_AGAIN","dns_failed"]
 ];
 for(const [code,expectation] of examples){
  assert.equal(classifyTransportError({code,message:"Private path /secrets - " + code}),expectation);
 }
 assert.equal(classifyTransportError({code:"PRIVATE_SECRET",message:"customer@example.com"}),"connection_or_tls_error");
 assert.equal(classifyTransportError(null),"connection_or_tls_error");
});
