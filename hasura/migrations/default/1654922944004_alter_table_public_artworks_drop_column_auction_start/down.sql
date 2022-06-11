alter table "public"."artworks" alter column "auction_start" drop not null;
alter table "public"."artworks" add column "auction_start" timestamptz;
