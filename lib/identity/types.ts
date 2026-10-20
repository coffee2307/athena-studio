export type OtpPurpose="sign-in"|"email-verification"|"forget-password"|"change-email";
export interface AuthMailTransport{
 send(email:string,otp:string,purpose:OtpPurpose):Promise<void>;
}
