alter table "public"."artworks" alter column "package_content" drop not null;
alter table "public"."artworks" add column "package_content" text;
