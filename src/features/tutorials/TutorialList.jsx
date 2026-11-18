import React, { useEffect, useState } from 'react';
import { guides as bundledGuides } from '../../../server/features/guides/content.js';
import { Disclosure, Section } from '../../shared/components.jsx';
import './tutorials.css';

export function TutorialList() {
  const [guides, setGuides] = useState(bundledGuides);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/guides', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (Array.isArray(data?.guides)) setGuides(data.guides);
      })
      .catch(() => {
        // The bundled guides are also available if the API is unreachable.
      });
    return () => controller.abort();
  }, []);

  return (
    <Section id="tutorials" title="Get up and running." description="Start with your first saved answer, then learn how to fill different question types.">
      <div className="guide-list">
        {guides.map(guide => (
          <Disclosure key={guide.id} id={guide.id} title={guide.title} summary={guide.summary}>
            <ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <dl className="example">
              <div><dt>Question</dt><dd>{guide.example[0]}</dd></div>
              <div><dt>Answer</dt><dd>{guide.example[1]}</dd></div>
            </dl>
          </Disclosure>
        ))}
      </div>
    </Section>
  );
}
