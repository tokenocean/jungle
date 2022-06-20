alter table "public"."artworks" add constraint "artworks_ticker_artist_id_key" unique ("ticker", "artist_id");
