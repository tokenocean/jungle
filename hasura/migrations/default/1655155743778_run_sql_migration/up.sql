CREATE TRIGGER set_transferred_at BEFORE UPDATE ON public.editions FOR EACH ROW EXECUTE FUNCTION public.trigger_set_transferred_at();
