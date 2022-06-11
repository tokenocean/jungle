alter table "public"."artworks" alter column "auction_tx" drop not null;
alter table "public"."artworks" add column "auction_tx" text;
