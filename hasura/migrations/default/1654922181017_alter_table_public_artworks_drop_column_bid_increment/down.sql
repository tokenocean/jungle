alter table "public"."artworks" alter column "bid_increment" set default 10000;
alter table "public"."artworks" alter column "bid_increment" drop not null;
alter table "public"."artworks" add column "bid_increment" int4;
