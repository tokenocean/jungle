alter table "public"."transactions" alter column "artwork_id" drop not null;
alter table "public"."transactions" add column "artwork_id" int4;
