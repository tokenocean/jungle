-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- update artworks set bid_id = null where bid_id not in (select id from transactions);