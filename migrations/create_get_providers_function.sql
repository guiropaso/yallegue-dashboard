-- Create a function in the public schema to query the private schema view
-- This function uses SECURITY DEFINER to run with elevated privileges
-- allowing it to access objects in the private schema

CREATE OR REPLACE FUNCTION public.get_providers_admin_view()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  dui text,
  whatsapp text,
  has_fixed_job boolean,
  registration_step integer,
  is_approved boolean,
  email text,
  areas text[],
  years_experience integer,
  description text,
  dui_front_url text,
  dui_back_url text,
  police_record_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.first_name,
    v.last_name,
    v.dui,
    v.whatsapp,
    v.has_fixed_job,
    v.registration_step,
    v.is_approved,
    v.email,
    v.areas,
    v.years_experience,
    v.description,
    v.dui_front_url,
    v.dui_back_url,
    v.police_record_url
  FROM private.providers_admin_view v
  ORDER BY v.id DESC;
END;
$$;

-- Grant execute permission to authenticated users (or service role)
-- Since we're using service role key in API routes, this is for safety
-- You can also restrict this further if needed
GRANT EXECUTE ON FUNCTION public.get_providers_admin_view() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_providers_admin_view() TO service_role;

-- Optional: Add a comment for documentation
COMMENT ON FUNCTION public.get_providers_admin_view() IS 
  'Retrieves all provider data from the private schema view. Accessible only via API routes using service role key.';

