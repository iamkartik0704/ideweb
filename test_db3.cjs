const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://wpwjskrboaxmrlfhyaiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwd2pza3Jib2F4bXJsZmh5YWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjcyNjMsImV4cCI6MjA5ODU0MzI2M30.4dSIX5pj4HhlGi2yeWTdiVPVr1XhJRB8sJrrhSJ_z_A';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from('shared_chats')
    .select('content')
    .eq('id', '6b3ba005-6c71-4ac8-8080-7de21a19a522')
    .single();
  console.log('DATA:', data);
  console.log('ERROR:', error);
}
test();