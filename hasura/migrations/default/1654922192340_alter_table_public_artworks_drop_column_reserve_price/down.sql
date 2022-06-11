alter table "public"."artworks" alter column "reserve_price" drop not null;
alter table "public"."artworks" add column "reserve_price" int8;
