UPDATE transactions SET artwork_id = (select artwork_id from editions where editions.id = transactions.edition_id);
