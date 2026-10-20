import type {AuthMailTransport,OtpPurpose} from "./types.ts";

/**
 * Deliberately conservative mail failover. If delivery to Gmail may already
 * have been accepted, never send another copy via SMTP.
 */
export function canFailoverFromGmail(reason:unknown):boolean{
 return reason instanceof Error&&[
  "ATHENA_MAIL_TOKEN_UNAVAILABLE",
  "ATHENA_MAIL_TOKEN_INVALID",
  "ATHENA_MAIL_AUTH_REJECTED",
  "ATHENA_MAIL_QUOTA"
 ].includes(reason.message);
}
export type TransportState={
 primarySkips:number;
 lastPrimaryFailure?:number;
};
export function resilientOtpTransport(
 primary:AuthMailTransport|undefined,
 secondary:AuthMailTransport|undefined,
 now:()=>number=Date.now
):AuthMailTransport&{state:()=>TransportState}{
 if(!primary&&!secondary)throw new Error("ATHENA_MAIL_NO_PROVIDER");
 let disabledUntil=0;
 let consecutive=0;
 let lastPrimaryFailure:number|undefined;
 const state=()=>({primarySkips:consecutive,lastPrimaryFailure});
 async function sendSecondary(email:string,otp:string,purpose:OtpPurpose){
  if(!secondary)throw new Error("ATHENA_MAIL_UNAVAILABLE");
  try{await secondary.send(email,otp,purpose);}
  catch{throw new Error("ATHENA_MAIL_UNAVAILABLE");}
 }
 return {
  state,
  async send(email,otp,purpose){
   if(!primary)return sendSecondary(email,otp,purpose);
   if(secondary&&now()<disabledUntil)return sendSecondary(email,otp,purpose);
   try{
    await primary.send(email,otp,purpose);
    consecutive=0;
    disabledUntil=0;
    return;
   }catch(error){
    // A timed-out POST or a 5xx may have accepted the OTP already.
    if(!canFailoverFromGmail(error))
     throw new Error("ATHENA_MAIL_UNAVAILABLE");
    consecutive=Math.min(consecutive+1,6);
    lastPrimaryFailure=now();
    disabledUntil=now()+Math.min(300_000,30_000*2**(consecutive-1));
    await sendSecondary(email,otp,purpose);
   }
  }
 };
}
