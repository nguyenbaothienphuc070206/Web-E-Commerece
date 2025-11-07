'use client';


import Sidebar from './Sidebar';
import Topbar from './Topbar';
import type { ReactNode } from 'react';


export default function LayoutShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  return (
    <div className="layout-root">
      <Sidebar />
      <div className="layout-main">
        <Topbar />
        <div className="container-inner container-inner-flex">
          {(title || subtitle) && (
            <div className="page-header">
              {title && <h1 className="text-2xl font-semibold mb-2">{title}</h1>}
              {subtitle && <p className="text-muted">{subtitle}</p>}
            </div>
          )}


          {children}
        </div>
      </div>
    </div>
  );
}