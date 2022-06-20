alter table "public"."comments" drop constraint "comments_artwork_id_fkey";
update comments set edition_id = (select id from editions where editions.artwork_id = comments.edition_id);
alter table comments add constraint "comments_edition_id_fkey"
  foreign key ("edition_id")
  references "public"."editions"
  ("id") on update restrict on delete cascade;
