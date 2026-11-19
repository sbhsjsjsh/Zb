'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePrivateAuth } from './PrivateAuthProvider';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, branding, logout } = usePrivateAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leads', label: 'Pipeline' },
    { href: '/listings', label: 'Listings' },
    ...(!(branding.hideSalesKitForClients && user?.role !== 'Owner')
      ? [{ href: '/sales-kit', label: 'Sales Kit' }]
      : [{ href: '/calculator', label: 'Calculator' }]),
    { href: '/settings', label: 'Privacy' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-slate-950 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded"
        >
          {branding.agencyName}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 hover:underline hover:underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => void logout()}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2"
          >
            Lock Workspace
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  void logout();
                }}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Lock Workspace
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
