CREATE TRIGGER "set_transferred_at"
BEFORE UPDATE ON "public"."artworks"
FOR EACH ROW EXECUTE FUNCTION trigger_set_transferred_at();
