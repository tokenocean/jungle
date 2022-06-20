alter table "public"."editions" alter column "slug" drop not null;
alter table "public"."editions" add column "slug" text;
