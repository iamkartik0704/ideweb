const fs = require('fs');
let code = fs.readFileSync('src/pages/ShareViewer.jsx', 'utf8');

const target = "        const { data, error } = await supabase\n          .from('shared_chats')\n          .select('chat_content')\n          .eq('id', id)\n          .single();";
const replacement = "        const { data, error } = await supabase.rpc('get_shared_chat', { chat_id: id });";

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/ShareViewer.jsx', code, 'utf8');
console.log('Fixed ShareViewer.jsx');