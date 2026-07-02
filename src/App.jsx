import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [downloadState, setDownloadState] = useState('idle');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hero = document.querySelector('.hero-title');
    if (!hero) return;
    let finishTimeout;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hero.classList.add('visible');
          hero.classList.remove('finished');
          if (finishTimeout) clearTimeout(finishTimeout);
          // Total typing duration: line1 3s, line2 starts at 3.5s, ends at 6.5s, line3 starts at 7s, ends at 10s
          // Add a small buffer
          finishTimeout = setTimeout(() => {
            hero.classList.add('finished');
          }, 11000);
        } else {
          hero.classList.remove('visible');
          hero.classList.remove('finished');
          if (finishTimeout) clearTimeout(finishTimeout);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(hero);
    return () => {
      observer.disconnect();
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, []);

  const handleDownload = (e) => {
    e.preventDefault();
    if (downloadState !== 'idle') return;

    setDownloadState('preparing');
    setTimeout(() => {
      setDownloadState('downloading');
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'compile-setup.exe';
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock executable content');
        link.click();
        setDownloadState('idle');
      }, 1000);
    }, 1000);
  };

  return (
    <>
      <div className="page-background"></div>
      
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="logo-link">
            <span className="logo-text">com<span className="pi-logo" style={{fontSize: '1.4rem'}}>π</span>le</span>
          </a>
          <div className="nav-links">
            <a href="#products">Features <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
            <a href="#use-cases">Extensions <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
            <a href="#pricing">AI Agent</a>
            <a href="#resources">Documentation <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
          </div>
          <div className="nav-actions">
            <a href="#download" className="btn btn-primary" onClick={handleDownload}>
              {downloadState === 'idle' && (
                <>
                  Download 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </>
              )}
              {downloadState === 'preparing' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>}
              {downloadState === 'downloading' && 'Downloading...'}
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-title-container">
              <div className="hero-title">
  <div className="typing line1">One IDE.</div>
  <div className="typing line2">Every language.</div>
  <div className="typing line3">Infinite π‑recision.</div>
</div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <a href="#download" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} onClick={handleDownload}>Download for Windows</a>
              <button className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>Explore extensions</button>
            </div>
          </div>
        </section>

        <section className="showcase-section">
          <div className="dark-panel">
            <div className="dark-panel-content">
              <div className="dark-panel-logo">
                <span className="logo-text" style={{fontSize: '3rem'}}>com<span className="pi-logo" style={{fontSize: '3.5rem'}}>π</span>le</span>
              </div>
              <img src="/image.png" alt="comπle IDE Interface" className="ide-showcase" />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-logo">
          &copy; 2026 comπle IDE
        </div>
        <div className="footer-links">
        </div>
      </footer>
    </>
  )
}

export default App
