'use client';


import { FaBell } from 'react-icons/fa';


export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <div className="topbar">
      <div className="container-inner container-inner-flex">
        <div className="topbar-left">
          <button onClick={() => onToggleSidebar?.()} className="md:hidden btn" aria-label="Toggle sidebar">☰</button>
          <div>
            <div className="text-lg font-semibold">Overview Dashboard</div>
            <div className="text-sm text-muted">Monitor your business performance and analytics</div>
          </div>
        </div>


        <div className="topbar-actions">
          <div className="topbar-search">
            <input className="bg-transparent outline-none text-sm" placeholder="Search..." />
          </div>


          <button className="btn" aria-label="Notifications">
            <FaBell />
          </button>


          <div className="flex items-center gap-2">
            <div className="text-sm">Admin User</div>
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm">AU</div>
          </div>
        </div>
      </div>
    </div>
  );
}