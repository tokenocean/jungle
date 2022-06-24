alter table "public"."tags"
  add constraint "tags_artwork_id_fkey"
  foreign key ("artwork_id")
  references "public"."artworks"
  ("id") on update restrict on delete cascade;
