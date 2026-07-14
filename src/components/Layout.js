import React from 'react';
import { NavLink } from 'react-router-dom';
import ContextSwitcher from './ContextSwitcher';
import { IS_OFFLINE } from '../lib/config';

// Navigation grouped by the LaunchDarkly documentation areas this demo covers.
const NAV = [
  {
    group: 'Overview',
    items: [['/', 'Home']],
  },
  {
    group: 'React SDK — evaluation',
    items: [
      ['/variations', 'Flag variations'],
      ['/details', 'Evaluation details'],
      ['/all-flags', 'All flags'],
      ['/typed', 'Typed variations'],
    ],
  },
  {
    group: 'React SDK — contexts & events',
    items: [
      ['/contexts', 'Contexts & identify'],
      ['/track', 'Track events / metrics'],
      ['/streaming', 'Streaming & subscribe'],
    ],
  },
  {
    group: 'React SDK — advanced',
    items: [
      ['/bootstrap', 'Bootstrapping'],
      ['/inspectors', 'Inspectors'],
      ['/multi-env', 'Multiple environments'],
      ['/status', 'SDK status & offline'],
    ],
  },
  {
    group: 'Product demos',
    items: [
      ['/demo/release', 'Release management'],
      ['/demo/experiment', 'Experimentation'],
      ['/demo/ai-config', 'AI Configs'],
    ],
  },
  {
    group: 'Platform (automation)',
    items: [
      ['/rest-api', 'REST API scripts'],
      ['/cli', 'CLI (ldcli)'],
      ['/coverage', 'Feature coverage map'],
    ],
  },
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">🚀</span>
          <div>
            <strong>LaunchDarkly</strong>
            <div className="brand-sub">Feature demo</div>
          </div>
        </div>
        {IS_OFFLINE ? (
          <div className="mode-pill mode-offline">OFFLINE / MOCK MODE</div>
        ) : (
          <div className="mode-pill mode-live">LIVE — connected</div>
        )}
        <nav>
          {NAV.map((section) => (
            <div className="nav-group" key={section.group}>
              <div className="nav-group-title">{section.group}</div>
              {section.items.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        <div className="topbar">
          <ContextSwitcher />
        </div>
        <div className="content-body">{children}</div>
      </main>
    </div>
  );
}
