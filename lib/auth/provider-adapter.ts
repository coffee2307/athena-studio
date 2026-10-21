"use client";
import {browserAuthClient} from "@/lib/auth/browser";
import type {IdentityPort} from "@/lib/core/auth/core";

/** Supabase is an adapter, not Athena's business/UX contract. */
export function supabaseIdentityAdapter():IdentityPort{
 const client=browserAuthClient();
 return {
  async login(email,password){
   const {data,error}=await client.auth.signInWithPassword({email,password});
   if(error)throw error;
   // A provider session without a confirmed email does not satisfy Athena's gate.
   if(!data.session||!data.user||!data.user.email_confirmed_at){
    if(data.session)await client.auth.signOut({scope:"local"});
    throw {code:"email_not_confirmed"};
   }
  },
  async signup(email,password,fullName,redirectTo){
   const {data,error}=await client.auth.signUp({email,password,options:{
    data:{full_name:fullName},emailRedirectTo:redirectTo
   }});
   if(error)throw error;
   // Autoconfirm must never silently override Athena's explicit verification policy.
   if(data.session){
    await client.auth.signOut({scope:"local"});
    throw {code:"identity_policy_block"};
   }
   if(!data.user)throw {code:"identity_policy_block"};
  },
  async forgot(email,redirectTo){
   const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo});
   if(error)throw error;
  },
  async password(password){
   const {error}=await client.auth.updateUser({password});
   if(error)throw error;
   await client.auth.signOut({scope:"local"});
  },
  async google(redirectTo){
   const {data,error}=await client.auth.signInWithOAuth({provider:"google",options:{redirectTo}});
   if(error)throw error;
   if(!data?.url)throw {code:"identity_policy_block"};
  }
 };
}
