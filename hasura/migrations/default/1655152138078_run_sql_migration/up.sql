CREATE OR REPLACE VIEW "public"."activelistings" AS 
 SELECT t.psbt,
    t.user_id,
    t.amount,
    t.edition_id,
    t.id,
    t.hash
   FROM (transactions t
     JOIN editions a ON ((t.edition_id = a.id)))
  WHERE ((t.type = 'listing'::text) AND (t.psbt = a.list_psbt));
