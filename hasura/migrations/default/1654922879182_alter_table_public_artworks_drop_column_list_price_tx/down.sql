alter table "public"."artworks" alter column "list_price_tx" drop not null;
alter table "public"."artworks" add column "list_price_tx" text;
