alter table "public"."artworks" alter column "ticker" drop not null;
alter table "public"."artworks" add column "ticker" text;
