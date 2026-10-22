export type ProjectRole="owner"|"admin"|"member"|"viewer";
export type Principal={id:string;roles:readonly ProjectRole[]};
export interface IdentityPort{
 getCurrentPrincipal():Promise<Principal|null>;
 can(principal:Principal,action:string,resource:{type:string;ownerId?:string}):Promise<boolean>;
}
