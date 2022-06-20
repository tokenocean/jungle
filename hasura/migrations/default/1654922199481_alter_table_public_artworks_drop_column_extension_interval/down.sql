alter table "public"."artworks" alter column "extension_interval" drop not null;
alter table "public"."artworks" add column "extension_interval" int4;
