import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

export default function ShareViewer() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChat() {
      try {
        const { data, error } = await supabase.rpc('get_shared_chat', { chat_id: id });

        if (error) throw error;
        
        if (data) {
          setContent(data.content || data.chat_content);
        } else {
          setError('Chat not found');
        }
      } catch (err) {
        console.error('Error fetching chat:', err);
        setError('Failed to load shared chat. It might have expired or does not exist.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchChat();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e0e0e0' }}>
        <Loader2 style={{ width: '2rem', height: '2rem', animation: 'spin 1s linear infinite', color: '#ebd79e' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#111111', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#e0e0e0', padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#f87171' }}>Oops!</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', color: '#e0e0e0', padding: '2rem 1rem', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
      <div style={{ backgroundColor: '#151515', border: '1px solid #2a2a2a', borderRadius: '0.5rem', margin: '0 auto', maxWidth: '56rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ borderBottom: '1px solid #2a2a2a', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#181818' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#858585' }}>shared-chat-{id.slice(0, 8)}.md</span>
        </div>
        <div style={{ padding: '2rem' }} className="share-viewer-content">
          <style>{`
            .share-viewer-content h1, .share-viewer-content h2, .share-viewer-content h3 { color: #e0e0e0; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
            .share-viewer-content h1:first-child, .share-viewer-content h2:first-child { margin-top: 0; }
            .share-viewer-content h1 { font-size: 2em; border-bottom: 1px solid #2a2a2a; padding-bottom: 0.3em; color: #ebd79e; }
            .share-viewer-content h2 { font-size: 1.5em; border-bottom: 1px solid #2a2a2a; padding-bottom: 0.3em; }
            .share-viewer-content p { margin-top: 0; margin-bottom: 1em; line-height: 1.6; }
            .share-viewer-content a { color: #ebd79e; text-decoration: none; }
            .share-viewer-content a:hover { text-decoration: underline; }
            .share-viewer-content code { font-family: inherit; background-color: rgba(255,255,255,0.08); padding: 0.2em 0.4em; border-radius: 6px; font-size: 85%; }
            .share-viewer-content pre { background-color: #111111; padding: 16px; overflow: auto; border-radius: 6px; border: 1px solid #2a2a2a; margin-top: 1em; margin-bottom: 1em; }
            .share-viewer-content pre code { background-color: transparent; padding: 0; border-radius: 0; font-size: 100%; color: #e0e0e0; }
            .share-viewer-content blockquote { padding: 0 1em; color: #858585; border-left: .25em solid #2a2a2a; margin: 0 0 1em 0; }
            .share-viewer-content ul, .share-viewer-content ol { margin-top: 0; margin-bottom: 1em; padding-left: 2em; }
            .share-viewer-content li { margin-top: 0.25em; }
          `}</style>
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
