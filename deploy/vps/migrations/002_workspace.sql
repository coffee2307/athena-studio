-- Athena-owned PostgreSQL authorization tables. Apply AFTER 001_better_auth.sql.
-- No end-user can modify membership via any public route.
-- Auth tables are accessed only through the private API using athena_app role.
CREATE TABLE athena_workspace (
 id text PRIMARY KEY CHECK(length(id) BETWEEN 8 AND 128),
 title text NOT NULL CHECK(length(title) BETWEEN 1 AND 160),
 kind text NOT NULL CHECK(kind IN ('studio','client')),
 created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE athena_membership (
 id text PRIMARY KEY CHECK(length(id) BETWEEN 8 AND 128),
 workspace_id text NOT NULL REFERENCES athena_workspace(id) ON DELETE CASCADE,
 user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 role text NOT NULL CHECK(role IN ('client','member','admin')),
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT athena_membership_workspace_user UNIQUE(workspace_id,user_id)
);

CREATE INDEX athena_membership_by_user ON athena_membership(user_id,workspace_id);
CREATE INDEX athena_membership_by_workspace ON athena_membership(workspace_id);

-- Runtime role receives DML, not ownership, DDL or database superuser privileges.
GRANT USAGE ON SCHEMA public TO athena_app;
GRANT SELECT,INSERT,UPDATE,DELETE ON "user","account","session","verification","rateLimit" TO athena_app;
GRANT SELECT ON athena_workspace,athena_membership TO athena_app;
-- Only a separately audited admin operation can add, change or remove roles.
-- No GRANT INSERT/UPDATE/DELETE on Athena membership/workspace to the web app.
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
