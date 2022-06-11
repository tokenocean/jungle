insert into editions (
artwork_id, 
edition, 
asset, 
list_price,
list_psbt,
asking_asset,
views,
slug,
bid_id,
address
) select 
id, 
edition, 
asset, 
list_price,
list_price_tx,
asking_asset,
views,
slug,
bid_id,
'unknown'
FROM artworks;
