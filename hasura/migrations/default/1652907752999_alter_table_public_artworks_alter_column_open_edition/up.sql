update artworks set open_edition = false;
alter table "public"."artworks" alter column "open_edition" set not null;
