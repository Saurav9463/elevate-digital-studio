-- Revoke execute on SECURITY DEFINER functions from anon/authenticated/public.
-- handle_new_user and update_updated_at_column are only invoked by triggers.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies; policies run with the row owner's privileges,
-- so revoking from anon/authenticated/public is safe while still allowing policy use.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Replace the always-true lead INSERT policy with a basic input-bound check
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND length(message) BETWEEN 1 AND 5000
    AND (company IS NULL OR length(company) <= 200)
    AND (phone IS NULL OR length(phone) <= 40)
    AND (service IS NULL OR length(service) <= 80)
  );