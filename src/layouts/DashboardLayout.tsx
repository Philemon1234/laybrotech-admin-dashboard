import { useState } from 'react';
import { FiBookOpen, FiGrid, FiLogOut, FiMenu, FiSettings, FiX } from 'react-icons/fi';
import { NavLink, Outlet } from 'react-router-dom';

import logo from '../assets/LaybroTech-Logo.png';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { label: 'Blog', href: '/blog', icon: FiBookOpen },
  { label: 'Settings', href: '/settings', icon: FiSettings },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut } = useAuth();

  return (
    <aside className="flex h-full flex-col border-r border-brand-border bg-white">
      <div className="flex h-16 items-center border-b border-brand-border px-5">
        <img src={logo} alt="Laybrotech" className="h-10 w-auto object-contain" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.href} to={item.href} onClick={onNavigate} className={({ isActive }) => `flex h-[42px] items-center gap-3 rounded-[10px] px-3 text-sm font-semibold transition ${isActive ? 'bg-brand-orange !text-white hover:bg-brand-orange hover:!text-white [&_svg]:!text-white' : 'text-brand-charcoal hover:bg-brand-muted hover:text-brand-charcoal'}`}>
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-brand-border p-3">
        <button onClick={() => void signOut()} className="flex h-[42px] w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-semibold text-brand-charcoal hover:bg-brand-muted hover:text-brand-charcoal">
          <FiLogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-brand-charcoal">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-[17rem]"><Sidebar /></div>
      {mobileOpen ? <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/35" aria-label="Close menu" onClick={() => setMobileOpen(false)} /><div className="relative h-full w-72 max-w-[86vw] bg-white shadow-soft"><button className="absolute right-4 top-4 rounded-lg p-2 text-brand-softText hover:bg-brand-muted" aria-label="Close menu" onClick={() => setMobileOpen(false)}><FiX className="size-5" /></button><Sidebar onNavigate={() => setMobileOpen(false)} /></div></div> : null}
      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-brand-border bg-white/95 px-4 backdrop-blur md:px-6 lg:hidden">
          <button className="rounded-[10px] border border-brand-border bg-white p-2 text-brand-charcoal" aria-label="Open menu" onClick={() => setMobileOpen(true)}><FiMenu className="size-5" /></button>
          <img src={logo} alt="Laybrotech Admin" className="h-8 w-auto object-contain" />
        </header>
        <main className="min-h-screen px-4 py-5 md:px-6 lg:px-7"><Outlet /></main>
      </div>
    </div>
  );
}



