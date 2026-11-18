import React from 'react';
import { Disclosure, Section } from '../../shared/components.jsx';

export function Faq() {
  return (
    <Section id="faq" title="Common questions">
      <div className="guide-list">
        <Disclosure title="Can I edit answers without opening a form?"><p>Yes. Click the extension icon from any tab to open the answer editor. On Google Forms, the icon opens the drawer with Save &amp; Fill.</p></Disclosure>
        <Disclosure title="Why did a question stay blank?"><p>Check that the saved question matches the form text and that your answer matches a valid option. For grids, use the row label. If an option label is ambiguous, try its position starting at 1.</p></Disclosure>
        <Disclosure title="Where are my answers stored?"><p>Saved answers and lists use Chrome sync storage. Sync across browsers depends on your Chrome settings. Unfinished drafts are stored locally by the extension.</p></Disclosure>
        <Disclosure title="Does the extension submit the form?"><p>No. Save &amp; Fill fills matching fields. You review the answers and submit the form yourself.</p></Disclosure>
      </div>
    </Section>
  );
}
