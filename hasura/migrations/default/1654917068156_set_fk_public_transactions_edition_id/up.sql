alter table "public"."transactions"
  add constraint "transactions_edition_id_fkey"
  foreign key ("edition_id")
  references "public"."editions"
  ("id") on update restrict on delete cascade;
