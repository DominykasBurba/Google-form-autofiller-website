import React, { useRef, useState } from 'react';
import { Section } from '../../shared/components.jsx';
import './gallery.css';

const screenshots = [
  { file: 'saved-answers', title: 'Saved answers', alt: 'A sample workshop form beside the extension drawer with three saved question and answer pairs.' },
  { file: 'random-fill', title: 'Random fill', alt: 'The extension drawer showing reusable lists of sample cities and names.' },
  { file: 'instructions', title: 'Instructions', alt: 'The extension drawer showing how to get started, use random answers, and fill text fields.' }
];

export function ScreenshotGallery() {
  const viewer = useRef(null);
  const [selected, setSelected] = useState(null);

  function openScreenshot(screenshot) {
    setSelected(screenshot);
    viewer.current.showModal();
  }

  return (
    <Section id="screenshots" className="screenshot-section" title="See the extension" description="Open any photo for a closer look.">
      <div className="screenshot-grid">
        {screenshots.map(screenshot => {
          const { file, title, alt } = screenshot;
          const src = `/screenshots/${file}.png`;
          return (
            <figure key={file}>
              <button type="button" className="screenshot-thumbnail" aria-label={`Enlarge ${title} photo`} aria-haspopup="dialog" onClick={() => openScreenshot(screenshot)}>
                <img src={src} alt={alt} width="1280" height="800" loading="lazy" />
              </button>
              <figcaption>{title}</figcaption>
            </figure>
          );
        })}
      </div>
      <dialog ref={viewer} className="screenshot-viewer" aria-label={selected?.title || 'Screenshot viewer'} onClick={() => viewer.current.close()} onClose={() => setSelected(null)}>
        <button type="button" className="screenshot-close" aria-label="Close photo">×</button>
        {selected && <img src={`/screenshots/${selected.file}.png`} alt={selected.alt} width="1280" height="800" />}
      </dialog>
    </Section>
  );
}
