const url = 'https://wpwjskrboaxmrlfhyaiw.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwd2pza3Jib2F4bXJsZmh5YWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjcyNjMsImV4cCI6MjA5ODU0MzI2M30.4dSIX5pj4HhlGi2yeWTdiVPVr1XhJRB8sJrrhSJ_z_A';
fetch(url).then(r => r.json()).then(data => {
  const rpcs = Object.keys(data.paths).filter(p => p.startsWith('/rpc/'));
  console.log('RPCs:', rpcs);
  console.log('shared_chats definition:', data.definitions.shared_chats);
});