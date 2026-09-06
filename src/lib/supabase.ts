import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://nhrktaneggpyhfqtcwbn.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocmt0YW5lZ2dweWhmcXRjd2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjY2NTcsImV4cCI6MjEwNDMwMjY1N30.zR-OAAwDW81J3drhYevYanzAtnewwqZFA3pl8OpYyv0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
