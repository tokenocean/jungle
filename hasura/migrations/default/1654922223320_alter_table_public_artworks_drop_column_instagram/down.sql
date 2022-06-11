alter table "public"."artworks" alter column "instagram" drop not null;
alter table "public"."artworks" add column "instagram" text;
