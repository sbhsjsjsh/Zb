'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { PropertyPhoto } from './PropertyPhoto';

export type MemberRole = 'Owner' | 'Managing Broker' | 'Agent';

export interface AuthorizedMember {
  email: string;
  name: string;
  role: MemberRole;
  addedAt: string;
}

export interface PrivateBranding {
  agencyName: string;
  hideSalesKitForClients: boolean;
}

export interface AuthenticatedUser {
  email: string;
  name: string;
  role: MemberRole;
}

interface PrivateAuthContextValue {
  user: AuthenticatedUser | null;
  branding: PrivateBranding;
  members: AuthorizedMember[];
  logout: () => Promise<void>;
  updateSettings: (payload: {
    newPasscode?: string;
    branding?: Partial<PrivateBranding>;
    addMember?: { email: string; name: string; role: MemberRole };
    removeMemberEmail?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
}

const TOKEN_STORAGE_KEY = 'keystone_private_token_v1';

const PrivateAuthContext = createContext<PrivateAuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null) {
  try {
    if (token) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function PrivateAuthProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'loading' | 'setup' | 'locked' | 'authenticated'>('loading');
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [branding, setBranding] = useState<PrivateBranding>({
    agencyName: 'Keystone',
    hideSalesKitForClients: false,
  });
  const [members, setMembers] = useState<AuthorizedMember[]>([]);

  // Form states
  const [email, setEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [agencyName, setAgencyName] = useState('Keystone');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const token = readStoredToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('/api/auth/status', {
          method: 'GET',
          headers,
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await res.json();
        if (cancelled) return;

        if (data.branding) {
          setBranding(data.branding);
        }

        if (!data.initialized) {
          setUser(null);
          setMembers([]);
          setPhase('setup');
          return;
        }

        if (data.authenticated && data.user) {
          setUser(data.user);
          setMembers(Array.isArray(data.members) ? data.members : []);
          setPhase('authenticated');
        } else {
          writeStoredToken(null);
          setUser(null);
          setMembers([]);
          setPhase('locked');
        }
      } catch {
        if (!cancelled) {
          setPhase('locked');
        }
      }
    }

    void loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your owner email address.');
      return;
    }
    if (passcode.trim().length < 6) {
      setErrorMsg('Private passcode must be at least 6 characters.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setErrorMsg('Passcodes do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          name: ownerName.trim() || 'Workspace Owner',
          passcode: passcode.trim(),
          agencyName: agencyName.trim() || 'Keystone',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not initialize private workspace.');
        setSubmitting(false);
        return;
      }
      if (data.token) writeStoredToken(data.token);
      setUser(data.user);
      setBranding(data.branding);
      setMembers(Array.isArray(data.members) ? data.members : []);
      setPasscode('');
      setConfirmPasscode('');
      setPhase('authenticated');
    } catch {
      setErrorMsg('Network error while initializing workspace.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !passcode.trim()) {
      setErrorMsg('Enter both your authorized email and private passcode.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          passcode: passcode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials.');
        setSubmitting(false);
        return;
      }
      if (data.token) writeStoredToken(data.token);
      setUser(data.user);
      setBranding(data.branding);
      setMembers(Array.isArray(data.members) ? data.members : []);
      setPasscode('');
      setPhase('authenticated');
    } catch {
      setErrorMsg('Unable to reach authentication server.');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    writeStoredToken(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore logout network error
    }
    setUser(null);
    setMembers([]);
    setPasscode('');
    setPhase('locked');
  };

  const updateSettings: PrivateAuthContextValue['updateSettings'] = async (
    payload
  ) => {
    try {
      const token = readStoredToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/settings', {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'Failed to save settings.' };
      }
      if (data.branding) setBranding(data.branding);
      if (Array.isArray(data.members)) setMembers(data.members);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error saving settings.' };
    }
  };

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center">
          <Lock className="mx-auto h-6 w-6 text-emerald-900" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Verifying private session...
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'setup' || phase === 'locked') {
    return (
      <div className="grid min-h-screen grid-cols-1 bg-[#FAFAFA] lg:grid-cols-12">
        {/* Left Architectural Panel (Desktop) */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:col-span-6 lg:block">
          <PropertyPhoto
            imageKey="hero_estate"
            priority
            sizes="50vw"
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/25" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="text-xs font-medium text-emerald-300">
              Private Software Edition · Authorized Personnel Only
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
              {branding.agencyName} Private Workspace
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-200">
              Access to buyer pipelines, exclusive listings, commission splits, and brokerage playbooks is restricted to invited team members.
            </p>
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:col-span-6 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center gap-2.5 text-emerald-900">
              {phase === 'setup' ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
              <span className="font-display text-sm font-semibold tracking-tight text-slate-950">
                {branding.agencyName}
              </span>
            </div>

            {phase === 'setup' ? (
              <>
                <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Initialize your private software
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Set your owner email and private master passcode. Once locked, only your authorized agency members can enter this software.
                </p>

                <form onSubmit={handleSetup} className="mt-8 space-y-4">
                  <div>
                    <label
                      htmlFor="setup-agency"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Private Software / Agency Name
                    </label>
                    <input
                      id="setup-agency"
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Keystone"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="setup-name"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Your Name (Workspace Owner)
                    </label>
                    <input
                      id="setup-name"
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Jordan Alvarez"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="setup-email"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Owner Email *
                    </label>
                    <input
                      id="setup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@youragency.com"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="setup-passcode"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Create Private Master Passcode (min 6 chars) *
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="setup-passcode"
                        type={showPasscode ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter a strong passcode"
                        className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white pl-3.5 pr-11 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode((prev) => !prev)}
                        aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-900"
                      >
                        {showPasscode ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="setup-confirm"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Confirm Passcode *
                    </label>
                    <input
                      id="setup-confirm"
                      type={showPasscode ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Re-enter passcode"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>

                  {errorMsg && (
                    <p role="alert" className="text-xs font-medium text-red-700">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                  >
                    {submitting
                      ? 'Locking & Initializing...'
                      : 'Lock Workspace & Sign In'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Private brokerage sign-in
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  This software is invite-only. Enter your authorized agency email and private access passcode to continue.
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Authorized Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="broker@agency.com"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-passcode"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Private Access Passcode
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="login-passcode"
                        type={showPasscode ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter workspace passcode"
                        className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white pl-3.5 pr-11 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode((prev) => !prev)}
                        aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-900"
                      >
                        {showPasscode ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <p role="alert" className="text-xs font-medium text-red-700">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                  >
                    {submitting ? 'Verifying...' : 'Unlock Private Workspace'}
                  </button>
                </form>

                <p className="mt-6 text-xs text-slate-500">
                  Need access? Ask your workspace owner or managing broker to add your email under Access &amp; Privacy.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrivateAuthContext.Provider
      value={{
        user,
        branding,
        members,
        logout,
        updateSettings,
      }}
    >
      {children}
    </PrivateAuthContext.Provider>
  );
}

export function usePrivateAuth() {
  const ctx = useContext(PrivateAuthContext);
  if (!ctx) {
    throw new Error('usePrivateAuth must be used within PrivateAuthProvider');
  }
  return ctx;
}
