'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calculator,
  PhoneCall,
  Shield,
  Lock,
  Menu,
  X,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';
import { useAgency } from './AgencyProvider';
import { usePrivateAuth } from './PrivateAuthProvider';

interface WorkspaceShellProps {
  title: string;
  sectionLabel: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const BASE_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Lead Pipeline', icon: Users },
  { href: '/listings', label: 'Property Listings', icon: Building2 },
  { href: '/calculator', label: 'Commission Desk', icon: Calculator },
  { href: '/sales-kit', label: 'Sales Offer & Scripts', icon: PhoneCall },
  { href: '/settings', label: 'Access & Privacy', icon: Shield },
];

export function WorkspaceShell({
  title,
  sectionLabel,
  action,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const { resetDemoData } = useAgency();
  const { user, branding, logout } = usePrivateAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  const visibleNav = BASE_NAV.filter((item) => {
    if (
      item.href === '/sales-kit' &&
      branding.hideSalesKitForClients &&
      user?.role !== 'Owner'
    ) {
      return false;
    }
    return true;
  });

  const handleReset = () => {
    resetDemoData();
    setResetMessage(true);
    window.setTimeout(() => setResetMessage(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 lg:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-slate-950 truncate"
          >
            {branding.agencyName}
          </Link>
        </div>

        <nav aria-label="Workspace navigation" className="flex-1 space-y-1 px-3 py-5">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-emerald-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 space-y-2">
          {user && (
            <div className="px-2 pb-2 text-xs">
              <p className="font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-slate-500 truncate">
                {user.role} · Private Session
              </p>
            </div>
          )}
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span>Overview Page</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{resetMessage ? 'Demo Data Restored' : 'Reset Sample Data'}</span>
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock &amp; Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Compact Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open workspace navigation"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                <Link href="/" className="hover:text-slate-900 transition-colors truncate">
                  {branding.agencyName}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="truncate">{sectionLabel}</span>
              </div>
              <h1 className="font-display text-base sm:text-lg font-semibold tracking-tight text-slate-950 truncate">
                {title}
              </h1>
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="font-display text-lg font-bold tracking-tight text-slate-950 truncate"
              >
                {branding.agencyName}
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close workspace navigation"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-3">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-950 text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-4 space-y-2">
              {user && (
                <p className="px-1 text-xs text-slate-500 truncate">
                  {user.name} · {user.role}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  void logout();
                }}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-medium text-white"
              >
                <Lock className="h-4 w-4" />
                <span>Lock &amp; Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
