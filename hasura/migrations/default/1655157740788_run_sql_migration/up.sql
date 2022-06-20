CREATE OR REPLACE FUNCTION public.trigger_set_transferred_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.owner_id <> OLD.owner_id THEN
    NEW.list_price = null;
    NEW.list_psbt = null;
    NEW.bid_id = null;
    NEW.transferred_at = NOW();
  END IF;
  RETURN NEW;
END;
$function$;
