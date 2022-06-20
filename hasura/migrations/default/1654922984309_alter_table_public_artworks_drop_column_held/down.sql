alter table "public"."artworks" alter column "held" set default ''singlesig'::text';
alter table "public"."artworks" alter column "held" drop not null;
alter table "public"."artworks" add column "held" text;
