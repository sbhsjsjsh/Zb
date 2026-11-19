'use client';

import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Plus,
  Search,
  Trash2,
  X,
  ArrowRight,
} from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAgency } from '@/components/AgencyProvider';
import {
  AGENTS,
  LEAD_STAGES,
  formatCompactCurrency,
  formatCurrency,
  type Lead,
  type LeadSource,
  type LeadStage,
  type PropertyType,
} from '@/lib/agency-data';

const LEAD_SOURCES: LeadSource[] = [
  'Portal',
  'Referral',
  'Instagram',
  'Walk-In',
  'Cold Outreach',
];

const PROPERTY_TYPES: PropertyType[] = [
  'Villa',
  'Penthouse',
  'Residential',
  'Commercial',
];

export default function LeadsPipelinePage() {
  const { leads, addLead, updateLeadStage, updateLeadNotes, deleteLead } =
    useAgency();

  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<LeadStage | 'All'>('All');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Add lead form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBudget, setNewBudget] = useState('1750000');
  const [newType, setNewType] = useState<PropertyType>('Residential');
  const [newArea, setNewArea] = useState('');
  const [newSource, setNewSource] = useState<LeadSource>('Portal');
  const [newAgent, setNewAgent] = useState(AGENTS[0]);
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (stageFilter !== 'All' && lead.stage !== stageFilter) return false;
      if (!q) return true;
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.preferredArea.toLowerCase().includes(q) ||
        lead.agent.toLowerCase().includes(q) ||
        lead.preferredType.toLowerCase().includes(q)
      );
    });
  }, [leads, searchQuery, stageFilter]);

  const selectedLead: Lead | null =
    leads.find((l) => l.id === selectedLeadId) ?? null;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newName.trim() || !newPhone.trim()) {
      setFormError('Client name and phone number are required.');
      return;
    }
    const parsedBudget = Number(newBudget);
    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setFormError('Enter a valid target budget.');
      return;
    }

    addLead({
      name: newName.trim(),
      email: newEmail.trim() || 'client@prospect.com',
      phone: newPhone.trim(),
      budget: parsedBudget,
      preferredType: newType,
      preferredArea: newArea.trim() || 'Metro Core',
      stage: 'New Inquiry',
      source: newSource,
      agent: newAgent,
      responseMinutes: 2,
      lastContacted: 'Just now',
      nextFollowUp: 'Today, 4:00 PM',
      notes: newNotes.trim() || 'New buyer inquiry added via agency CRM.',
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewArea('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleCopyFollowUp = (lead: Lead) => {
    const firstName = lead.name.split(' ')[0];
    const message = `Hi ${firstName}, this is ${lead.agent} from Keystone Realty. I reviewed your criteria for a ${lead.preferredType.toLowerCase()} in ${lead.preferredArea} around ${formatCurrency(lead.budget)}. I have 2 off-market options that fit well — do you have 10 minutes today or tomorrow for a private walkthrough?`;
    navigator.clipboard.writeText(message).then(() => {
      setCopiedWhatsApp(true);
      window.setTimeout(() => setCopiedWhatsApp(false), 2000);
    });
  };

  const advanceStage = (lead: Lead) => {
    const idx = LEAD_STAGES.indexOf(lead.stage);
    if (idx < LEAD_STAGES.length - 1) {
      updateLeadStage(lead.id, LEAD_STAGES[idx + 1]);
    }
  };

  return (
    <WorkspaceShell
      title="Lead & Deal Pipeline"
      sectionLabel="CRM Pipeline"
      action={
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      }
    >
      {/* Toolbar: Search, Stage Filter, View Toggle */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buyer, neighborhood, or agent..."
            className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-[#FAFAFA] pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by pipeline stage"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as LeadStage | 'All')}
            className="min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-emerald-800 focus:outline-none"
          >
            <option value="All">All Stages ({leads.length})</option>
            {LEAD_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'board'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Board
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                viewMode === 'table'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            No matching leads found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Clear your search filter or add a new buyer inquiry to the pipeline.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStageFilter('All');
            }}
            className="mt-4 inline-flex min-h-[40px] items-center rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'board' ? (
        /* Horizontal Kanban Board on Desktop, Stacked/Scrollable on Mobile */
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage);
            const stageVolume = stageLeads.reduce((sum, l) => sum + l.budget, 0);

            return (
              <div
                key={stage}
                className="flex flex-col rounded-xl border border-slate-200 bg-white"
              >
                <div className="border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-slate-950 truncate">
                      {stage}
                    </h2>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                    {formatCompactCurrency(stageVolume)}
                  </p>
                </div>

                <div className="flex-1 divide-y divide-slate-100">
                  {stageLeads.length === 0 ? (
                    <p className="p-4 text-xs text-slate-400">No leads</p>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 transition-colors hover:bg-slate-50"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="w-full text-left"
                        >
                          <p className="text-sm font-semibold text-slate-950">
                            {lead.name}
                          </p>
                          <p className="mt-1 font-mono text-xs font-medium text-emerald-900 tabular-nums">
                            {formatCurrency(lead.budget)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {lead.preferredType} · {lead.preferredArea}
                          </p>
                          <p className="mt-1.5 text-[11px] text-slate-400">
                            {lead.agent} · {lead.source}
                          </p>
                        </button>

                        {stage !== 'Closed Won' && (
                          <button
                            type="button"
                            onClick={() => advanceStage(lead)}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-emerald-900"
                          >
                            <span>Advance stage</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Data Table View */
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                  <th className="px-5 py-3">Buyer</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Criteria</th>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3 text-right">Budget</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="text-left font-medium text-slate-950 hover:text-emerald-900"
                      >
                        {lead.name}
                      </button>
                      <p className="text-xs text-slate-500">
                        {lead.source} · {lead.lastContacted}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                      {lead.stage}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {lead.preferredType} · {lead.preferredArea}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      {lead.agent}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-950 tabular-nums">
                      {formatCurrency(lead.budget)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="text-xs font-medium text-emerald-900 hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail & Follow-Up Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/35 backdrop-blur-[1px]"
            onClick={() => setSelectedLeadId(null)}
          />
          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs text-slate-500">
                  {selectedLead.source} · Assigned to {selectedLead.agent}
                </p>
                <h2 className="font-display text-lg font-semibold text-slate-950">
                  {selectedLead.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                aria-label="Close lead details"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs text-slate-500">Target Budget</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-slate-950 tabular-nums">
                    {formatCurrency(selectedLead.budget)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Preference</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {selectedLead.preferredType} · {selectedLead.preferredArea}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="mt-1 font-mono text-xs text-slate-800">
                    {selectedLead.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 text-xs text-slate-800 truncate">
                    {selectedLead.email}
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="lead-stage-select"
                  className="block text-xs font-medium text-slate-700"
                >
                  Pipeline Stage
                </label>
                <select
                  id="lead-stage-select"
                  value={selectedLead.stage}
                  onChange={(e) =>
                    updateLeadStage(selectedLead.id, e.target.value as LeadStage)
                  }
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
                >
                  {LEAD_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="lead-notes"
                  className="block text-xs font-medium text-slate-700"
                >
                  Broker Negotiation &amp; Follow-Up Notes
                </label>
                <textarea
                  id="lead-notes"
                  rows={4}
                  value={selectedLead.notes}
                  onChange={(e) => updateLeadNotes(selectedLead.id, e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-emerald-800 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium text-slate-700">
                  Quick Client Follow-Up
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyFollowUp(selectedLead)}
                  className="mt-2.5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                >
                  {copiedWhatsApp ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>WhatsApp / SMS Message Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Tailored WhatsApp Follow-Up</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  deleteLead(selectedLead.id);
                  setSelectedLeadId(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove Lead</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="font-display text-lg font-semibold text-slate-950">
                Add Buyer Inquiry
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Sophia Bennett"
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (512) 555-0144"
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="sophia@example.com"
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Target Budget (USD) *
                  </label>
                  <input
                    type="number"
                    min={50000}
                    step={25000}
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 font-mono text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Property Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PropertyType)}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Preferred Neighborhood
                  </label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="Westlake Hills"
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Lead Source
                  </label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as LeadSource)}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  >
                    {LEAD_SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Assigned Agent
                  </label>
                  <select
                    value={newAgent}
                    onChange={(e) => setNewAgent(e.target.value)}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  >
                    {AGENTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Initial Notes
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Financing status, move-in timeline, must-haves..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-emerald-800 focus:outline-none"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-red-700">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[42px] rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] rounded-lg bg-emerald-900 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
