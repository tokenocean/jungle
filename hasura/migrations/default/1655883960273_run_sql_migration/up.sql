delete from tags where artwork_id not in (select id from artworks);
