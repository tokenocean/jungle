alter table "public"."artworks" add constraint "artworks_bid_id_key" unique (bid_id);
alter table "public"."artworks"
  add constraint "artworks_bid_id_fkey"
  foreign key (bid_id)
  references "public"."transactions"
  (id) on update restrict on delete set null;
alter table "public"."artworks" alter column "bid_id" drop not null;
alter table "public"."artworks" add column "bid_id" uuid;
