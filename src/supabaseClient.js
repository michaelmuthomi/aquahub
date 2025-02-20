import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jdstqnxokxsqsodjrjxv.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkc3Rxbnhva3hzcXNvZGpyanh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTIyMTUsImV4cCI6MjA1NTYyODIxNX0.h08kfCtyJA8xKbUD0oAdEf2jYWKR09u4Yb3txivAPys"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
