update users set fiats = '["USD", "EUR", "JPY", "GBP", "CAD", "AUD", "CNY"]' where fiats is null;
alter table "public"."users" alter column "fiats" set not null;
alter table "public"."users" alter column "fiats" set default '["USD", "EUR", "JPY", "GBP", "CAD", "AUD", "CNY"]';
