-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- insert into auctions (
-- edition_id,
-- auction_start,
-- auction_end,
-- reserve,
-- max_extensions,
-- extension_interval,
-- psbt,
-- release_psbt,
-- bid_increment
-- )
-- select
-- editions.id,
-- artworks.auction_start,
-- artworks.auction_end,
-- artworks.reserve_price,
-- artworks.max_extensions,
-- artworks.extension_interval,
-- artworks.auction_tx,
-- artworks.auction_release_tx,
-- artworks.bid_increment
-- from artworks join editions on artworks.id = editions.artwork_id
-- where artworks.auction_start is not null
-- and artworks.auction_end is not null;
