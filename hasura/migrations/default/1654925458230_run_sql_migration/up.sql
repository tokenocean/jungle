CREATE OR REPLACE FUNCTION public.edition_has_royalty(edition_row editions)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
    SELECT EXISTS(
        SELECT 1 FROM public.royalty_recipients
            WHERE edition_id = edition_row.id
    );
$function$;
