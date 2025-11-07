// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartPie, FaDollarSign, FaBoxOpen, FaUsers, FaHome, FaBars, FaCog } from 'react-icons/fa';
import { Fragment } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

const adminLinks = [
  { href: '/overview', label: 'Overview', icon: <FaChartPie /> },
  { href: '/revenue-analytics', label: 'Revenue Analytics', icon: <FaDollarSign /> },
  { href: '/product-analytics', label: 'Product Analytics', icon: <FaBoxOpen /> },
  { href: '/trending', label: 'Trending Analysis', icon: <FaChartPie /> },
  { href: '/customer-insights', label: 'Customer Insights', icon: <FaUsers /> },
];

const userLinks = [
  { href: '/my-dashboard', label: 'My Dashboard', icon: <FaHome /> },
  { href: '/recommendations', label: 'Recommendations', icon: <FaCog /> },
  { href: '/budget-planner', label: 'Budget Planner', icon: <FaDollarSign /> },
];


export default function Sidebar() {
  const pathname = usePathname();


  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">A</div>
        <div>
          <div className="text-slate-900 font-semibold">Analytics</div>
          <div className="text-xs text-slate-400">Analytics Platform</div>
        </div>
      </div>


      <div className="px-2 py-2">
        <div className="sidebar-section-title">Admin Dashboard</div>
        <nav className="space-y-1">
          {adminLinks.map(link => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}>
                <span className="text-slate-400">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>


        <div className="h-px bg-slate-100 my-4" />


        <div className="sidebar-section-title">User Dashboard</div>
        <nav className="space-y-1 mt-2">
          {userLinks.map(link => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}>
                <span className="text-slate-400">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>


      <div className="mt-auto text-sm text-slate-500 px-4 py-3 border-t border-slate-100">v1.0.0</div>
    </aside>
  );
}