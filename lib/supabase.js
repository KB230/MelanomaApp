import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://gkbuxhtrtanohppnqowf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYnV4aHRydGFub2hwcG5xb3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNTg0OTgsImV4cCI6MjA0MTgzNDQ5OH0.opNbdEVe2NUmrltKcN8UVhy6jo-JlpOSNAWQub1W40k';
// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
});
  
