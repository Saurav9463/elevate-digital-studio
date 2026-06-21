-- Grant EXECUTE privilege on public.has_role function to public, anon, and authenticated roles.
-- This is required because RLS policies execute in the caller's context, meaning the querying role
-- (anon or authenticated) must have EXECUTE permission on any function called within the USING/WITH CHECK clauses.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO PUBLIC, anon, authenticated;
