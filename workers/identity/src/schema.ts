import {
 sqliteTable,text,integer,index,uniqueIndex,check
} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

/**
 * Better Auth v1.7.12 schema, under Athena ownership.
 * Same logical tables as Phase 8C.2. This is NOT Supabase/Postgres RLS.
 * D1 database grants are NEVER exposed to the browser.
 */
export const user=sqliteTable("user",{
 id:text("id").primaryKey(),
 name:text("name").notNull(),
 email:text("email").notNull().unique(),
 emailVerified:integer("emailVerified",{mode:"boolean"}).notNull(),
 image:text("image"),
 createdAt:integer("createdAt",{mode:"timestamp_ms"}).notNull(),
 updatedAt:integer("updatedAt",{mode:"timestamp_ms"}).notNull()
});

export const session=sqliteTable("session",{
 id:text("id").primaryKey(),
 expiresAt:integer("expiresAt",{mode:"timestamp_ms"}).notNull(),
 token:text("token").notNull().unique(),
 createdAt:integer("createdAt",{mode:"timestamp_ms"}).notNull(),
 updatedAt:integer("updatedAt",{mode:"timestamp_ms"}).notNull(),
 ipAddress:text("ipAddress"),
 userAgent:text("userAgent"),
 userId:text("userId").notNull().references(()=>user.id,{onDelete:"cascade"})
},t=>[index("session_userId_idx").on(t.userId)]);

export const account=sqliteTable("account",{
 id:text("id").primaryKey(),
 accountId:text("accountId").notNull(),
 providerId:text("providerId").notNull(),
 userId:text("userId").notNull().references(()=>user.id,{onDelete:"cascade"}),
 accessToken:text("accessToken"),
 refreshToken:text("refreshToken"),
 idToken:text("idToken"),
 accessTokenExpiresAt:integer("accessTokenExpiresAt",{mode:"timestamp_ms"}),
 refreshTokenExpiresAt:integer("refreshTokenExpiresAt",{mode:"timestamp_ms"}),
 scope:text("scope"),
 password:text("password"),
 createdAt:integer("createdAt",{mode:"timestamp_ms"}).notNull(),
 updatedAt:integer("updatedAt",{mode:"timestamp_ms"}).notNull()
},t=>[index("account_userId_idx").on(t.userId)]);

export const verification=sqliteTable("verification",{
 id:text("id").primaryKey(),
 identifier:text("identifier").notNull(),
 value:text("value").notNull(),
 expiresAt:integer("expiresAt",{mode:"timestamp_ms"}).notNull(),
 createdAt:integer("createdAt",{mode:"timestamp_ms"}).notNull(),
 updatedAt:integer("updatedAt",{mode:"timestamp_ms"}).notNull()
},t=>[index("verification_identifier_idx").on(t.identifier)]);

export const rateLimit=sqliteTable("rateLimit",{
 id:text("id").primaryKey(),
 key:text("key").notNull().unique(),
 count:integer("count").notNull(),
 lastRequest:integer("lastRequest").notNull()
});

/**
 * Athena-owned tenant ACL, separate from the identity provider.
 * No tenant authority is ever derived from an OAuth account's email alone.
 */
export const workspace=sqliteTable("athena_workspace",{
 id:text("id").primaryKey(),
 title:text("title").notNull(),
 kind:text("kind",{enum:["studio","client"]}).notNull(),
 createdAt:integer("createdAt",{mode:"timestamp_ms"}).notNull()
},t=>[check("athena_workspace_kind_check",sql`${t.kind} in ('studio', 'client')`)]);

export const workspaceMembership=sqliteTable("athena_membership",{
 id:text("id").primaryKey(),
 workspaceId:text("workspaceId").notNull().references(()=>workspace.id,{onDelete:"cascade"}),
 userId:text("userId").notNull().references(()=>user.id,{onDelete:"cascade"}),
 role:text("role",{enum:["client","member","admin"]}).notNull(),
 createdAt:integer("createdAt",{mode:"timestamp_ms"}).notNull()
},t=>[
 index("athena_membership_user_idx").on(t.userId),
 index("athena_membership_workspace_idx").on(t.workspaceId),
 uniqueIndex("athena_membership_owner_unique").on(t.workspaceId,t.userId),
 check("athena_membership_role_check",sql`${t.role} in ('client', 'member', 'admin')`)
]);
