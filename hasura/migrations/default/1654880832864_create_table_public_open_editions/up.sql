CREATE TABLE "public"."open_editions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "artwork_id" uuid NOT NULL, "psbt" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON UPDATE restrict ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
