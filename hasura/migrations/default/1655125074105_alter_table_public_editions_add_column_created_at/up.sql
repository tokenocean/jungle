alter table "public"."editions" add column "created_at" timestamptz
 not null default now();
