alter table "public"."artworks" alter column "views" set default 0;
alter table "public"."artworks" alter column "views" drop not null;
alter table "public"."artworks" add column "views" int4;
