import React from 'react';

export function Button({ href, variant = 'primary', className = '', children, ...props }) {
  const classes = ['button', variant, className].filter(Boolean).join(' ');
  return href
    ? <a href={href} className={classes} {...props}>{children}</a>
    : <button type="button" className={classes} {...props}>{children}</button>;
}

export function Section({ id, title, description, className = '', children }) {
  return (
    <section className={['section', 'shell', className].filter(Boolean).join(' ')} id={id}>
      <div className="section-heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Disclosure({ id, title, summary, children }) {
  return (
    <details className="guide" id={id}>
      <summary>
        <span><strong>{title}</strong>{summary && <span className="summary-text">{summary}</span>}</span>
      </summary>
      <div className="guide-body">{children}</div>
    </details>
  );
}
