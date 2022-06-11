alter table "public"."artworks" alter column "cover_filename" drop not null;
alter table "public"."artworks" add column "cover_filename" text;
