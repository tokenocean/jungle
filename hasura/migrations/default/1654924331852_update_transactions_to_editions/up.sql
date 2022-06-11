update transactions set edition_id = (select editions.id from editions where editions.artwork_id = transactions.artwork_id);
