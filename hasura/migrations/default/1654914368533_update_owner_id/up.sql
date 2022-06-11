update editions set owner_id = (select owner_id from artworks where artworks.id = editions.artwork_id);
