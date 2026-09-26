// Mock phase: driver accounts are admin-provisioned (see supabase/schema.sql
// `drivers` table), so there's no self-signup — this stand-in credential
// pair is what QA/demo logs in with until real auth is wired up.
export const MOCK_DRIVER_CREDENTIALS = {
  email: 'suresh.patil@tms.com',
  password: 'Driver@123',
};
