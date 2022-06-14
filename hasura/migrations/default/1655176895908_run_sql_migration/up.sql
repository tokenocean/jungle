CREATE OR REPLACE FUNCTION public.trigger_update_tx_artwork()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE artwork_id INTEGER;
BEGIN
    IF NEW.edition_id IS NOT NULL THEN
        UPDATE transactions SET artwork_id = (SELECT artwork_id FROM editions WHERE id = NEW.edition_id) WHERE id = NEW.id;
    END IF;

  RETURN NEW;
END;
$function$;
