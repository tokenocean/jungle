alter table "public"."artworks" add constraint "artworks_redeem_code_key" unique (redeem_code);
alter table "public"."artworks" alter column "redeem_code" drop not null;
alter table "public"."artworks" add column "redeem_code" text;
