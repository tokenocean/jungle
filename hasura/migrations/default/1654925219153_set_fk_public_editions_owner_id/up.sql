alter table "public"."editions"
  add constraint "editions_owner_id_fkey"
  foreign key ("owner_id")
  references "public"."users"
  ("id") on update restrict on delete set null;
