alter table "public"."royalty_recipients" drop constraint "royalty_recipients_artwork_id_fkey";
update royalty_recipients set edition_id = (select id from editions where editions.artwork_id = royalty_recipients.edition_id);
alter table "public"."royalty_recipients"
  add constraint "royalty_recipients_edition_id_fkey"
  foreign key ("edition_id")
  references "public"."editions"
  ("id") on update cascade on delete cascade;
