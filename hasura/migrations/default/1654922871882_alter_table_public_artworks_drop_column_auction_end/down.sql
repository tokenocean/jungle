alter table "public"."artworks" alter column "auction_end" drop not null;
alter table "public"."artworks" add column "auction_end" timestamptz;
