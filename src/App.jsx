import { useEffect, useMemo, useState } from 'react'
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

  // Populate sleek quote with character spans for staggered reveal
  useEffect(() => {
    const sleek = document.querySelectorAll('.sleek-quote');
    sleek.forEach(el => {
      const inner = el.querySelector('.sleek-inner');
      const text = el.getAttribute('data-text') || inner.textContent || '';
      if (!inner) return;
      // avoid re-populating
      if (inner.dataset.populated) return;
      inner.dataset.populated = '1';
      inner.innerHTML = '';
      // split into words so we don't allow line-breaks inside words
      const words = text.split(' ');
      let charIndex = 0;
      words.forEach((word, wIdx) => {
        const wordWrap = document.createElement('span');
        wordWrap.className = 'word';
        // create per-character spans inside the word
        Array.from(word).forEach((ch) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.style.setProperty('--i', String(charIndex));
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          wordWrap.appendChild(span);
          charIndex++;
        });
        inner.appendChild(wordWrap);
        // add a normal space between words (keeps words separate and allows wrapping between words)
        if (wIdx < words.length - 1) inner.appendChild(document.createTextNode(' '));
      });
      // mark parent as populated so CSS can hide fallback text (after spans inserted)
      el.dataset.populated = '1';
      // mark the first word (brand) characters as highlighted
      const firstWordChars = inner.querySelectorAll('.word:first-child .char');
      firstWordChars.forEach(ch => ch.classList.add('brand'));
    });
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

  // Video pop-up observer
  useEffect(() => {
    const videoContainer = document.querySelector('.video-showcase');
    if (!videoContainer) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoContainer.classList.add('popped');
        } else {
          videoContainer.classList.remove('popped');
        }
      });
    }, { threshold: 0.15 });
    observer.observe(videoContainer);
    return () => observer.disconnect();
  }, []);

  // Download cards staggered reveal
  useEffect(() => {
    const cards = document.querySelectorAll('.download-card');
    const heading = document.querySelector('.download-heading');
    const subs = document.querySelectorAll('.download-sub');
    if (!cards.length) return;
    const elements = [heading, ...subs, ...cards].filter(Boolean);
    // use a WeakMap to track timeouts for replaying the per-character typing
    const timeoutsMap = new WeakMap();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const t = entry.target;
        if (entry.isIntersecting) {
          if (t.classList && t.classList.contains('sleek-quote')) {
            // clear any previous timeouts and classes
            const prev = timeoutsMap.get(t) || [];
            prev.forEach(id => clearTimeout(id));
            timeoutsMap.set(t, []);
            // ensure chars are reset
            const chars = t.querySelectorAll('.char');
            chars.forEach(ch => ch.classList.remove('in'));
            // stagger adding the `in` class to create a typing effect
            chars.forEach((ch, i) => {
              const id = setTimeout(() => {
                ch.classList.add('in');
              }, i * 35);
              timeoutsMap.get(t).push(id);
            });
          } else {
            t.classList.add('revealed');
          }
        } else {
          if (t.classList && t.classList.contains('sleek-quote')) {
            const prev = timeoutsMap.get(t) || [];
            prev.forEach(id => clearTimeout(id));
            timeoutsMap.set(t, []);
            t.querySelectorAll('.char.in').forEach(ch => ch.classList.remove('in'));
          } else {
            entry.target.classList.remove('revealed');
          }
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Showcase gallery images and lightbox state
  const images = [
    'https://picsum.photos/id/1011/1600/900',
    'https://picsum.photos/id/1015/1600/900',
    'https://picsum.photos/id/1025/1600/900',
    'https://picsum.photos/id/1035/1600/900',
    'https://picsum.photos/id/1043/1600/900'
  ];
  const [activeImage, setActiveImage] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // gallery pop animation on each intersection + prev/next controls
  const nextImage = (e) => {
    if (e) e.stopPropagation();
    const idx = images.indexOf(activeImage);
    const ni = (idx + 1) % images.length;
    setActiveImage(images[ni]);
  };
  const prevImage = (e) => {
    if (e) e.stopPropagation();
    const idx = images.indexOf(activeImage);
    const ni = (idx - 1 + images.length) % images.length;
    setActiveImage(images[ni]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((current) => {
        const idx = images.indexOf(current);
        return images[(idx + 1) % images.length];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const gallery = document.querySelector('.showcase-gallery');
    if (!gallery) return;
    let clearId;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // replay animation: remove then add class so it triggers every time
          gallery.classList.remove('gallery-pop');
          // next frame add class
          requestAnimationFrame(() => gallery.classList.add('gallery-pop'));
          if (clearId) clearTimeout(clearId);
          clearId = setTimeout(() => gallery.classList.remove('gallery-pop'), 1000);
        } else {
          gallery.classList.remove('gallery-pop');
          if (clearId) { clearTimeout(clearId); clearId = null; }
        }
      });
    }, { threshold: 0.15 });
    observer.observe(gallery);
    return () => { observer.disconnect(); if (clearId) clearTimeout(clearId); };
  }, [activeImage]);

  useEffect(() => {
    const finale = document.querySelector('.finale-section');
    if (!finale) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          finale.classList.add('pull-in');
        } else {
          finale.classList.remove('pull-in');
        }
      });
    }, { threshold: 0.2 });
    observer.observe(finale);
    return () => observer.disconnect();
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
            <span className="logo-text">Com<span className="pi-logo" style={{fontSize: '1.4rem'}}>π</span>le</span>
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

        {/* Video showcase - pops up like Antigravity */}
        <section className="video-section">
          <div className="video-showcase">
            <div className="video-container">
              <div className="video-placeholder">
                {/* Play button overlay */}
                <div className="play-button">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" />
                    <path d="M10 8l6 4-6 4V8z" fill="#D4AF37" />
                  </svg>
                </div>
                <div className="video-label">Watch Comπle in action</div>
              </div>
            </div>
          </div>
        </section>

        {/* Download options for all platforms */}
        <section className="download-section" id="download">
          <h2 className="download-heading">Bring Com<span className="pi-logo" style={{fontSize: '3.6rem'}}>π</span>le to Your Machine</h2>
          <p className="download-sub">Available for every major platform.</p>

          <div className="download-grid">
            {/* Windows */}
            <div className="download-card">
              <div className="download-card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12.5L10.5 11.3V4L3 5V12.5Z" fill="#D4AF37"/>
                  <path d="M11.5 11.2L21 9.5V3L11.5 4V11.2Z" fill="#D4AF37"/>
                  <path d="M3 13.5L10.5 14.7V21L3 20V13.5Z" fill="#D4AF37"/>
                  <path d="M11.5 14.8L21 16.5V22L11.5 21V14.8Z" fill="#D4AF37"/>
                </svg>
              </div>
              <h3 className="download-card-title">Windows</h3>
              <div className="download-card-links">
                <a href="#" className="download-link">.exe <span className="download-tag">Installer</span></a>
                <a href="#" className="download-link">.msi <span className="download-tag">MSI</span></a>
                <a href="#" className="download-link">.zip <span className="download-tag">Portable</span></a>
              </div>
            </div>

            {/* macOS */}
            <div className="download-card">
              <div className="download-card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.81 11.78 5.72 12.57 5.72C13.36 5.72 14.85 4.62 16.4 4.8C17.06 4.83 18.89 5.08 20.06 6.8C19.95 6.87 17.62 8.27 17.65 11.13C17.68 14.55 20.63 15.68 20.66 15.69C20.63 15.78 20.19 17.31 18.71 19.5Z" fill="#D4AF37"/>
                  <path d="M15.49 2C15.61 3.17 15.14 4.35 14.38 5.19C13.61 6.04 12.43 6.7 11.3 6.61C11.16 5.46 11.73 4.26 12.45 3.48C13.23 2.64 14.52 2.03 15.49 2Z" fill="#D4AF37"/>
                </svg>
              </div>
              <h3 className="download-card-title">macOS</h3>
              <div className="download-card-links">
                <a href="#" className="download-link">.dmg <span className="download-tag">Universal</span></a>
                <a href="#" className="download-link">.dmg <span className="download-tag">Apple Silicon</span></a>
                <a href="#" className="download-link">.dmg <span className="download-tag">Intel</span></a>
                <a href="#" className="download-link">.zip <span className="download-tag">Portable</span></a>
              </div>
            </div>

            {/* Linux */}
            <div className="download-card">
              <div className="download-card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.25 2 7 5.5 7 8.5C7 10 7 11 6 12.5C5 14 4 15 4 17C4 18.5 5 20 7.5 20.5C8.5 20.7 9 21 10 21.5C11 22 11.5 22 12 22C12.5 22 13 22 14 21.5C15 21 15.5 20.7 16.5 20.5C19 20 20 18.5 20 17C20 15 19 14 18 12.5C17 11 17 10 17 8.5C17 5.5 15.75 2 12 2Z" fill="#D4AF37"/>
                  <circle cx="10" cy="9" r="1" fill="#121212"/>
                  <circle cx="14" cy="9" r="1" fill="#121212"/>
                  <path d="M10 13C10.5 14 11 14.5 12 14.5C13 14.5 13.5 14 14 13" stroke="#121212" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="download-card-title">Linux</h3>
              <div className="download-card-links">
                <a href="#" className="download-link">.deb <span className="download-tag">Debian / Ubuntu</span></a>
                <a href="#" className="download-link">.rpm <span className="download-tag">Fedora / RHEL</span></a>
                <a href="#" className="download-link">.AppImage <span className="download-tag">Universal</span></a>
                <a href="#" className="download-link">.tar.gz <span className="download-tag">Portable</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="quote-section">
          <p className="sleek-quote download-sub" data-text={"Comπle is our AI-native IDE, allowing any developer to build in the multi-model era."}>
            <span className="sleek-inner" />
          </p>
        </section>

        <section className="showcase-section">
          <div className="dark-panel">
            <div className="dark-panel-content">
                <div className="dark-panel-logo">
                <span className="logo-text" style={{fontSize: '3rem'}}>The Com<span className="pi-logo" style={{fontSize: '3.6rem'}}>π</span>le Canvas</span>
              </div>
              <div className="showcase-gallery">
                <div className="showcase-main-wrap">
                  <img src={activeImage} alt="Comπle IDE Interface - main" className="showcase-main ide-showcase" onClick={() => setLightboxOpen(true)} />
                  <div className="gallery-nav">
                    <button className="gallery-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous">‹</button>
                    <button className="gallery-next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next">›</button>
                  </div>
                </div>
                <div className="showcase-thumbs">
                  {images.filter((src) => src !== activeImage).map((src, idx) => (
                    <button key={idx} type="button" className="thumb-card" onClick={() => setActiveImage(src)}>
                      <img src={src} alt={`Comπle IDE Interface - thumb ${idx+1}`} className="showcase-thumb" />
                      <span className="thumb-label">Preview</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="finale-section">
          <div className="finale-copy">
            <p className="finale-kicker">Releases</p>
            <h2>The Com<span className="finale-pi"><span className="finale-pi-icon">π</span></span>le Experience, Everywhere.</h2>
            <p className="finale-text">A beautifully simple developer workspace that scales from desktop to cloud — designed to ship with every machine and every team.</p>
            <div className="finale-footer-links">
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="footer-logo">Comπle</span>
          <span className="footer-copy">© 2026 Comπle IDE</span>
        </div>
        <div className="footer-links">
          <a href="#support">Support</a>
          <a href="#press">Press</a>
          <a href="#legal">Legal</a>
          <a href="#sitemap">Sitemap</a>
        </div>
      </footer>
    </>
  )
}

export default App
