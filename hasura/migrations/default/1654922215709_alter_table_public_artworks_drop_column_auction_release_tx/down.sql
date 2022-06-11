alter table "public"."artworks" alter column "auction_release_tx" drop not null;
alter table "public"."artworks" add column "auction_release_tx" text;
