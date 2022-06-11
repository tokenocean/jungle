CREATE  INDEX "artworks_artist_id_ticker_key" on
  "public"."artworks" using btree ("artist_id", "ticker");
