CREATE OR REPLACE FUNCTION public.trigger_extend_auction()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE bid INTEGER;
BEGIN
  UPDATE auctions SET auction_end = GREATEST(NOW() + interval '15 minutes', auction_end) WHERE edition_id = NEW.edition_id AND NEW.type = 'bid' AND auction_end is not null AND auction_end > now() AND auction_start < NOW();
  RETURN NEW;
END;
$function$;
