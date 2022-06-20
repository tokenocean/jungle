CREATE TRIGGER update_tx_artwork
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_tx_artwork();
