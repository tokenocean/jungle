CREATE OR REPLACE VIEW "public"."activebids" AS 
 SELECT t.psbt,
    t.user_id,
    t.amount,
    t.edition_id,
    t.id,
    t.hash,
    t.type
   FROM (transactions t
     JOIN editions e ON ((t.edition_id = e.id)))
  WHERE (((t.type = 'bid'::text) OR (t.type = 'auction'::text)) AND ((e.transferred_at IS NULL) OR (t.created_at > e.transferred_at)));