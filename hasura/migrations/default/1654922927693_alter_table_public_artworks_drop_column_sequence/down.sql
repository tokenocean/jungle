alter table "public"."artworks" alter column "sequence" drop not null;
alter table "public"."artworks" add column "sequence" int4;
