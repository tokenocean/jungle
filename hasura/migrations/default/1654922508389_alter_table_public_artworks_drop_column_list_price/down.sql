alter table "public"."artworks" alter column "list_price" drop not null;
alter table "public"."artworks" add column "list_price" int8;
