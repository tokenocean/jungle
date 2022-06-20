alter table "public"."artworks" drop constraint "artworks_slug_key";
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

update artworks a set slug = (select slug from artworks b where a.title = b.title and a.artist_id = b.artist_id and b.edition = 1 order by created_at desc limit 1);
