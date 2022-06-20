CREATE OR REPLACE FUNCTION public.trigger_check_bid()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE bid INTEGER;
DECLARE bid_increment INTEGER;
DECLARE reserve INTEGER;
DECLARE auction_end TIMESTAMP;
BEGIN
    IF NEW.type = 'bid' THEN
        SELECT transactions.amount
        FROM transactions
        JOIN editions ON transactions.edition_id = editions.id
        WHERE transactions.edition_id = NEW.edition_id
        AND transactions.type = 'bid'
        AND (transactions.created_at > editions.transferred_at
        OR editions.transferred_at IS NULL)
        ORDER BY amount DESC
        LIMIT 1
        INTO bid;
        
        SELECT auctions.bid_increment, auctions.auction_end, auctions.reserve
        FROM auctions
        WHERE edition_id = NEW.edition_id 
        AND auctions.auction_start < NOW() 
        AND auctions.auction_end >= NOW() 
        LIMIT 1
        INTO bid_increment, auction_end, reserve;

      IF NEW.amount < reserve OR (bid is not null AND auction_end >= NOW() AND NEW.amount < (bid + bid_increment)) THEN
          RAISE EXCEPTION USING ERRCODE='22000', MESSAGE=format('Bid of %s below minimum bid of %s', NEW.amount, GREATEST(reserve, bid + bid_increment));
      END IF;
    END IF;

  RETURN NEW;
END;
$function$;
