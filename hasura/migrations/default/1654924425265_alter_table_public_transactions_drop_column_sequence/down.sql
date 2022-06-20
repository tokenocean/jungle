alter table "public"."transactions" alter column "sequence" set default nextval('transactions_sequence_seq'::regclass);
alter table "public"."transactions" alter column "sequence" drop not null;
alter table "public"."transactions" add column "sequence" int4;
