'use client';

import React, { useState } from 'react';
import { Check, Copy, Lock, Plus, Trash2 } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import {
  usePrivateAuth,
  type MemberRole,
} from '@/components/PrivateAuthProvider';

export default function PrivateSettingsPage() {
  const { user, branding, members, logout, updateSettings } = usePrivateAuth();

  const canManage =
    user?.role === 'Owner' || user?.role === 'Managing Broker';

  // Branding state
  const [agencyName, setAgencyName] = useState(branding.agencyName);
  const [hideSalesKit, setHideSalesKit] = useState(
    branding.hideSalesKitForClients
  );
  const [brandingFeedback, setBrandingFeedback] = useState('');

  // Add member state
  const [memberEmail, setMemberEmail] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState<MemberRole>('Agent');
  const [memberFeedback, setMemberFeedback] = useState('');
  const [memberError, setMemberError] = useState('');

  // Passcode rotation state
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeFeedback, setPasscodeFeedback] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [copiedHandover, setCopiedHandover] = useState(false);

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandingFeedback('');
    const res = await updateSettings({
      branding: {
        agencyName: agencyName.trim() || 'Keystone',
        hideSalesKitForClients: hideSalesKit,
      },
    });
    if (res.ok) {
      setBrandingFeedback('White-label branding and visibility updated.');
      window.setTimeout(() => setBrandingFeedback(''), 2500);
    } else {
      setBrandingFeedback(res.error || 'Could not update branding.');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');
    setMemberFeedback('');
    if (!memberEmail.trim()) {
      setMemberError('Enter an email address to authorize.');
      return;
    }

    const res = await updateSettings({
      addMember: {
        email: memberEmail.trim(),
        name: memberName.trim() || memberEmail.split('@')[0],
        role: memberRole,
      },
    });
    if (res.ok) {
      setMemberEmail('');
      setMemberName('');
      setMemberFeedback('Member added to private allowlist.');
      window.setTimeout(() => setMemberFeedback(''), 2500);
    } else {
      setMemberError(res.error || 'Could not authorize member.');
    }
  };

  const handleRemoveMember = async (email: string) => {
    setMemberError('');
    const res = await updateSettings({ removeMemberEmail: email });
    if (!res.ok) {
      setMemberError(res.error || 'Could not remove member.');
    }
  };

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    setPasscodeFeedback('');

    if (newPasscode.trim().length < 6) {
      setPasscodeError('New passcode must be at least 6 characters.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeError('Passcodes do not match.');
      return;
    }

    const res = await updateSettings({ newPasscode: newPasscode.trim() });
    if (res.ok) {
      setNewPasscode('');
      setConfirmPasscode('');
      setPasscodeFeedback('Private workspace passcode rotated successfully.');
      window.setTimeout(() => setPasscodeFeedback(''), 3000);
    } else {
      setPasscodeError(res.error || 'Could not update passcode.');
    }
  };

  const handleCopyClientHandover = () => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const handoverText = `${branding.agencyName} — Private Agency Software Access

Private Portal URL: ${origin}/dashboard
Authorized Emails: ${members.map((m) => `${m.email} (${m.role})`).join(', ')}
Access Policy: Invite-only private brokerage portal (search indexing disabled).

Sign in with your authorized email and the private workspace passcode provided separately.`;

    navigator.clipboard.writeText(handoverText).then(() => {
      setCopiedHandover(true);
      window.setTimeout(() => setCopiedHandover(false), 2000);
    });
  };

  return (
    <WorkspaceShell
      title="Access & Privacy Control"
      sectionLabel="Private Security"
      action={
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
        >
          <Lock className="h-4 w-4" />
          <span>Lock Now</span>
        </button>
      }
    >
      {/* Active Session Overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900">
              Private Workspace Active · Search Engine Indexing Disabled
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold text-slate-950">
              Signed in as {user?.name} ({user?.role})
            </h2>
            <p className="mt-0.5 font-mono text-xs text-slate-500">
              {user?.email}
            </p>
          </div>

          {canManage && (
            <button
              type="button"
              onClick={handleCopyClientHandover}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
            >
              {copiedHandover ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Client Handover Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Private Client Access Note</span>
                </>
              )}
            </button>
          )}
        </div>
      </section>

      {!canManage ? (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-8">
          <p className="text-sm text-slate-700">
            Your account has <span className="font-medium text-slate-950">Agent</span> access. Contact your Workspace Owner or Managing Broker to invite new members or rotate the private passcode.
          </p>
        </section>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Authorized Agency Allowlist */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
            <h2 className="font-display text-base font-semibold text-slate-950">
              Authorized Agency Members
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Only emails listed below can unlock this private software. Revoking an email ends their access immediately.
            </p>

            <form
              onSubmit={handleAddMember}
              className="mt-5 grid grid-cols-1 gap-3 border-b border-slate-100 pb-5 sm:grid-cols-12"
            >
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-medium text-slate-600">
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="agent@brokerage.com"
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-slate-600">
                  Full Name
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Elena Vance"
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 px-3 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-medium text-slate-600">
                  Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as MemberRole)}
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
                >
                  <option value="Agent">Agent</option>
                  <option value="Managing Broker">Managing Broker</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              <div className="sm:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-1">
                <div>
                  {memberError && (
                    <p role="alert" className="text-xs font-medium text-red-700">
                      {memberError}
                    </p>
                  )}
                  {memberFeedback && (
                    <p className="text-xs font-medium text-emerald-800">
                      {memberFeedback}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-900 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800 whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Authorize Email</span>
                </button>
              </div>
            </form>

            <ul className="divide-y divide-slate-100">
              {members.map((member) => (
                <li
                  key={member.email}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-950 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {member.email} · {member.role} · Added {member.addedAt}
                    </p>
                  </div>
                  {member.role !== 'Owner' && (
                    <button
                      type="button"
                      onClick={() => void handleRemoveMember(member.email)}
                      aria-label={`Revoke access for ${member.email}`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Right Column: White-Label Branding & Passcode Rotation */}
          <div className="space-y-6 lg:col-span-5">
            <form
              onSubmit={handleSaveBranding}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <div>
                <h2 className="font-display text-base font-semibold text-slate-950">
                  Private White-Label Settings
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Rebrand the software for a paying real estate client and hide your internal sales playbook from client logins.
                </p>
              </div>

              <div>
                <label
                  htmlFor="white-label-name"
                  className="block text-xs font-medium text-slate-700"
                >
                  Displayed Software Name
                </label>
                <input
                  id="white-label-name"
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-700">
                <input
                  type="checkbox"
                  checked={hideSalesKit}
                  onChange={(e) => setHideSalesKit(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-900"
                />
                <span>
                  Hide <span className="font-mono">/sales-kit</span> (selling offers &amp; cold calling scripts) from Managing Broker and Agent accounts
                </span>
              </label>

              {brandingFeedback && (
                <p className="text-xs font-medium text-emerald-800">
                  {brandingFeedback}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
              >
                Save Branding &amp; Privacy Rules
              </button>
            </form>

            <form
              onSubmit={handleUpdatePasscode}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <div>
                <h2 className="font-display text-base font-semibold text-slate-950">
                  Rotate Private Passcode
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update the shared private access passcode used to unlock this brokerage workspace.
                </p>
              </div>

              <div>
                <label
                  htmlFor="rotate-passcode"
                  className="block text-xs font-medium text-slate-700"
                >
                  New Passcode (min 6 characters)
                </label>
                <input
                  id="rotate-passcode"
                  type="password"
                  minLength={6}
                  required
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="rotate-confirm"
                  className="block text-xs font-medium text-slate-700"
                >
                  Confirm New Passcode
                </label>
                <input
                  id="rotate-confirm"
                  type="password"
                  minLength={6}
                  required
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
                />
              </div>

              {passcodeError && (
                <p role="alert" className="text-xs font-medium text-red-700">
                  {passcodeError}
                </p>
              )}
              {passcodeFeedback && (
                <p className="text-xs font-medium text-emerald-800">
                  {passcodeFeedback}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
              >
                Update Master Passcode
              </button>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
