alter table "public"."royalty_recipients" drop constraint "royalty_recipients_edition_id_fkey",
  add constraint "royalty_recipients_artwork_id_fkey"
  foreign key ("edition_id")
  references "public"."artworks"
  ("id") on update cascade on delete cascade;
