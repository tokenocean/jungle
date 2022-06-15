alter table transactions disable trigger cancel_bid;
update transactions set edition_id = (select editions.id from editions where editions.artwork_id = transactions.artwork_id);
alter table transactions enable trigger cancel_bid;
