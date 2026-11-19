'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Phone, Plus } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAgency } from '@/components/AgencyProvider';
import {
  AGENTS,
  formatCompactCurrency,
  formatCurrency,
} from '@/lib/agency-data';

export default function DashboardPage() {
  const {
    leads,
    listings,
    viewings,
    markLeadContacted,
    toggleViewingStatus,
  } = useAgency();

  const activeLeads = leads.filter((l) => l.stage !== 'Closed Won');
  const activePipelineVolume = activeLeads.reduce((sum, l) => sum + l.budget, 0);
  const projectedGrossCommission = Math.round(activePipelineVolume * 0.028);
  const activeListings = listings.filter((p) => p.status !== 'Sold');
  const activeListingsVolume = activeListings.reduce((sum, p) => sum + p.price, 0);
  const avgResponse =
    leads.length > 0
      ? (
          leads.reduce((sum, l) => sum + l.responseMinutes, 0) / leads.length
        ).toFixed(1)
      : '0.0';

  const priorityQueue = leads
    .filter((l) => l.stage === 'New Inquiry' || l.stage === 'Qualified' || l.stage === 'Offer Made')
    .slice(0, 5);

  const agentStats = AGENTS.map((agent) => {
    const agentLeads = leads.filter((l) => l.agent === agent);
    const agentListings = listings.filter((p) => p.agent === agent);
    const pipelineValue = agentLeads.reduce((sum, l) => sum + l.budget, 0);
    const closedCount = agentLeads.filter((l) => l.stage === 'Closed Won').length;
    return {
      agent,
      leadCount: agentLeads.length,
      listingCount: agentListings.length,
      pipelineValue,
      closedCount,
    };
  }).sort((a, b) => b.pipelineValue - a.pipelineValue);

  return (
    <WorkspaceShell
      title="Agency Command"
      sectionLabel="Dashboard"
      action={
        <Link
          href="/leads"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Lead</span>
        </Link>
      }
    >
      {/* 4-Column Metric Strip */}
      <section
        aria-label="Key agency metrics"
        className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
      >
        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium text-slate-500">Active Buyer Pipeline</p>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
            {formatCompactCurrency(activePipelineVolume)}
          </p>
          <p className="mt-1.5 text-xs text-slate-500 tabular-nums">
            {activeLeads.length} active opportunities · {leads.length - activeLeads.length} closed
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium text-slate-500">Projected Gross GCI</p>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-emerald-900 tabular-nums">
            {formatCurrency(projectedGrossCommission)}
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Estimated at 2.8% average fee
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium text-slate-500">Listed Inventory</p>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
            {formatCompactCurrency(activeListingsVolume)}
          </p>
          <p className="mt-1.5 text-xs text-slate-500 tabular-nums">
            {activeListings.length} active &amp; under offer properties
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium text-slate-500">Avg Lead Response</p>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
            {avgResponse} min
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Target SLA: under 10 minutes
          </p>
        </div>
      </section>

      {/* Two-Column Operational Desk */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Priority Follow-Up Queue */}
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-950">
                Priority Follow-Up Queue
              </h2>
              <p className="text-xs text-slate-500">
                High-intent buyers awaiting outreach or offer confirmation
              </p>
            </div>
            <Link
              href="/leads"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 hover:text-emerald-700 whitespace-nowrap"
            >
              <span>All leads</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {priorityQueue.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-600">No urgent leads in the queue.</p>
              <Link
                href="/leads"
                className="mt-3 inline-flex items-center rounded-lg bg-emerald-900 px-4 py-2 text-xs font-medium text-white"
              >
                Add New Lead
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {priorityQueue.map((lead) => (
                <li
                  key={lead.id}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-slate-950">
                        {lead.name}
                      </span>
                      <span className="font-mono text-xs font-medium text-slate-700 tabular-nums">
                        {formatCurrency(lead.budget)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {lead.stage} · {lead.preferredType} in {lead.preferredArea} · {lead.agent}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Next step: {lead.nextFollowUp} · Last touch: {lead.lastContacted}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => markLeadContacted(lead.id)}
                      className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        lead.contactedToday
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-900'
                          : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {lead.contactedToday ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Contacted</span>
                        </>
                      ) : (
                        <>
                          <Phone className="h-3.5 w-3.5" />
                          <span>Log Touch</span>
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming Viewings */}
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-950">
                Scheduled Viewings
              </h2>
              <p className="text-xs text-slate-500">
                Tap any status to cycle Confirmed / Completed
              </p>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-900 hover:text-emerald-700 whitespace-nowrap"
            >
              <span>Listings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="divide-y divide-slate-100">
            {viewings.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-950 truncate">
                    {item.propertyTitle}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Buyer: {item.leadName}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums">
                    {item.dateLabel} · {item.timeLabel} · {item.agent}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleViewingStatus(item.id)}
                  className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    item.status === 'Completed'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : item.status === 'Rescheduled'
                      ? 'border-amber-200 bg-amber-50 text-amber-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.status}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Agent Performance Ledger */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-950">
              Agent Desk Performance
            </h2>
            <p className="text-xs text-slate-500">
              Live rollup of assigned buyers, active listings, and total pipeline volume
            </p>
          </div>
          <Link
            href="/sales-kit"
            className="text-xs font-medium text-emerald-900 hover:text-emerald-700 whitespace-nowrap"
          >
            Pitching this software? Open Sales Kit →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="px-5 py-3 sm:px-6">Agent</th>
                <th className="px-4 py-3 text-right">Active Leads</th>
                <th className="px-4 py-3 text-right">Listings</th>
                <th className="px-4 py-3 text-right">Closed Won</th>
                <th className="px-5 py-3 text-right sm:px-6">Pipeline Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentStats.map((row) => (
                <tr key={row.agent} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-medium text-slate-950 sm:px-6">
                    {row.agent}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    {row.leadCount}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    {row.listingCount}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-emerald-800 tabular-nums">
                    {row.closedCount}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-950 tabular-nums sm:px-6">
                    {formatCurrency(row.pipelineValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </WorkspaceShell>
  );
}
