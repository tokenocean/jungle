alter table "public"."artworks" alter column "max_extensions" drop not null;
alter table "public"."artworks" add column "max_extensions" int4;
