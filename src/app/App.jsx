import React from 'react';
import { Demo } from '../features/autofill-demo/Demo.jsx';
import { ScreenshotGallery } from '../features/screenshots/ScreenshotGallery.jsx';
import { TutorialList } from '../features/tutorials/TutorialList.jsx';
import { Faq } from '../features/faq/Faq.jsx';
import { Button } from '../shared/components.jsx';

const storeUrl = 'https://chromewebstore.google.com/detail/google-form-auto-filler/fpjfgikplnkhcjbencphdmgeihhcckkb';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="shell header-inner">
          <a href="#" className="brand"><span className="brand-mark" aria-hidden="true">✓</span> Google Form Auto Filler</a>
          <nav aria-label="Main navigation">
            <a href="#screenshots">Photos</a>
            <a href="#tutorials">Tutorials</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Fill Google Forms <em>with saved answers.</em></h1>
            <p>Save your question-and-answer pairs once and fill matching fields with a click. Handy for testing forms and repeat data entry.</p>
            <div className="hero-actions"><Button href={storeUrl}>Add to Chrome <span aria-hidden="true">↗</span></Button><Button href="#tutorials" variant="secondary">Read the tutorials</Button></div>
          </div>
          <Demo />
        </section>
        <ScreenshotGallery />
        <TutorialList />
        <Faq />
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <span>Google Form Auto Filler</span>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="/guides.html">Tutorials</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
            <a href="/contact.html">Contact</a>
            <a href={storeUrl} target="_blank" rel="noopener noreferrer">Chrome Web Store ↗</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
