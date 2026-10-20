import "server-only";
import {redirect} from "next/navigation";
import {authSettings} from "@/lib/auth/config";
export function operationsEnabled(){
 return authSettings().enabled&&process.env.ATHENA_OPERATIONS_ENABLED==="true";
}
export function requireOperations(){
 if(!operationsEnabled())redirect("/tai-khoan?notice=unavailable");
}
