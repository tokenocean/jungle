alter table "public"."artworks" alter column "asking_asset" drop not null;
alter table "public"."artworks" add column "asking_asset" text;
