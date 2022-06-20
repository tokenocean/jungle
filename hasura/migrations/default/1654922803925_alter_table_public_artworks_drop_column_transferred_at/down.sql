alter table "public"."artworks" alter column "transferred_at" drop not null;
alter table "public"."artworks" add column "transferred_at" timestamptz;
