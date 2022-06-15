CREATE OR REPLACE FUNCTION public.artwork_sold(artwork_row artworks)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
SELECT EXISTS (
    SELECT 1
    FROM editions e
    WHERE e.artwork_id = artwork_row.id
    AND transferred_at IS NOT NULL
);
$function$;
