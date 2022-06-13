CREATE OR REPLACE FUNCTION public.artwork_transactions(artwork_row artworks)
 RETURNS transactions
 LANGUAGE sql
 STABLE
AS $function$
SELECT transactions.* FROM transactions JOIN editions ON transactions.edition_id = editions.id WHERE editions.artwork_id = artwork_row.id
$function$;
