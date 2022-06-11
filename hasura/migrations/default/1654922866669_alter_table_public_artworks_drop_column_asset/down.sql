alter table "public"."artworks" add constraint "artworks_asset_key" unique (asset);
alter table "public"."artworks" alter column "asset" drop not null;
alter table "public"."artworks" add column "asset" text;
