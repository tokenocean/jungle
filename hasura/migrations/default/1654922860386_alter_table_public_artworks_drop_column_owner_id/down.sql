alter table "public"."artworks"
  add constraint "artworks_owner_id_fkey"
  foreign key (owner_id)
  references "public"."users"
  (id) on update restrict on delete set null;
alter table "public"."artworks" alter column "owner_id" drop not null;
alter table "public"."artworks" add column "owner_id" uuid;
