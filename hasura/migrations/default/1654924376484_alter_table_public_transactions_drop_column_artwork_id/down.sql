alter table "public"."transactions"
  add constraint "transactions_artwork_id_fkey"
  foreign key (artwork_id)
  references "public"."artworks"
  (id) on update restrict on delete cascade;
alter table "public"."transactions" alter column "artwork_id" drop not null;
alter table "public"."transactions" add column "artwork_id" uuid;
