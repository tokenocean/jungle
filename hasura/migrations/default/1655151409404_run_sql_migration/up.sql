delete from artworks where edition > 1;
alter table "public"."artworks" drop column "edition" cascade;
