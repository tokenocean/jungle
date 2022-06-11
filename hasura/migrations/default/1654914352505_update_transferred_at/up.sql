update editions set transferred_at = (select transferred_at from artworks where artworks.id = editions.artwork_id);
