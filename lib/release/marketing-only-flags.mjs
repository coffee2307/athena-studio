/** Production A is a read-only marketing release. None of these feature
 * toggles may be true in the deployment environment, even if local QA enables them. */
export const MARKETING_ONLY_DISABLED_FLAGS=Object.freeze([
 "NEXT_PUBLIC_ATHENA_AUTH_ENABLED",
 "NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED",
 "ATHENA_INDEPENDENT_AUTH_ENABLED",
 "ATHENA_IDENTITY_LOCAL_ONLY",
 "ATHENA_LOCAL_PASSWORD_AUTH_ENABLED",
 "ATHENA_VPS_IDENTITY_ENABLED",
 "ATHENA_VPS_RELEASE_APPROVED",
 "ATHENA_GMAIL_SENDER_ENABLED",
 "ATHENA_SMTP_ENABLED",
 "ATHENA_OPERATIONS_ENABLED",
 "ATHENA_SITEPULSE_ENABLED"
]);

export function enabledNonMarketingFlags(env=process.env){
 return MARKETING_ONLY_DISABLED_FLAGS.filter(key=>env[key]==="true");
}
