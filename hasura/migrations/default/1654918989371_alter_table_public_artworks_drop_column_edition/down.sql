alter table "public"."artworks" alter column "edition" set default 1;
alter table "public"."artworks" alter column "edition" drop not null;
alter table "public"."artworks" add column "edition" int4;
