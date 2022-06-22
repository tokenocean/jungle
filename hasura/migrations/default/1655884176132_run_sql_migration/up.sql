update artworks set bid_id = null where bid_id not in (select id from transactions);
