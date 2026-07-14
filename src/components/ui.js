// Small presentational building blocks shared across feature pages.
import React from 'react';

export function Page({ title, subtitle, docPath, children }) {
  return (
    <div className="page">
      <header className="page-head">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {docPath && (
          <a
            className="doc-link"
            href={`https://launchdarkly.com/docs/${docPath}`}
            target="_blank"
            rel="noreferrer"
          >
            📖 LaunchDarkly docs ↗
          </a>
        )}
      </header>
      {children}
    </div>
  );
}

export function Panel({ title, children, tone }) {
  return (
    <section className={`panel ${tone ? `panel-${tone}` : ''}`}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

export function Code({ children, lang = 'js' }) {
  return (
    <pre className={`code lang-${lang}`}>
      <code>{children}</code>
    </pre>
  );
}

export function Value({ label, value }) {
  const rendered =
    typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
  return (
    <div className="kv">
      <span className="kv-label">{label}</span>
      <code className="kv-value">{rendered}</code>
    </div>
  );
}

export function Button({ children, onClick, tone = 'primary', disabled }) {
  return (
    <button
      className={`btn btn-${tone}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
