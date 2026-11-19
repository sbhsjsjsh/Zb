'use client';

import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAgency } from '@/components/AgencyProvider';
import { formatCurrency } from '@/lib/agency-data';

export default function CommissionCalculatorPage() {
  const { commissions, addCommissionRecord, deleteCommissionRecord } =
    useAgency();

  const [dealName, setDealName] = useState('412 Ridgeview Terrace');
  const [salePrice, setSalePrice] = useState(2450000);
  const [commissionRate, setCommissionRate] = useState(3.0);
  const [coBrokerSplit, setCoBrokerSplit] = useState(false);
  const [agentSplitPct, setAgentSplitPct] = useState(70);
  const [marketingFee, setMarketingFee] = useState(1200);
  const [dealsPerMonth, setDealsPerMonth] = useState(4);
  const [savedNotice, setSavedNotice] = useState(false);

  const totalGrossCommission = salePrice * (commissionRate / 100);
  const agencyGrossCommission = coBrokerSplit
    ? totalGrossCommission * 0.5
    : totalGrossCommission;
  const netDistributable = Math.max(0, agencyGrossCommission - marketingFee);
  const agentPayout = Math.round(netDistributable * (agentSplitPct / 100));
  const brokerageNet = Math.round(netDistributable - agentPayout);
  const annualBrokerageNet = brokerageNet * dealsPerMonth * 12;

  const handleSaveProjection = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    addCommissionRecord({
      dealName: dealName.trim() || 'Untitled Deal Projection',
      salePrice,
      commissionRate,
      grossCommission: Math.round(agencyGrossCommission),
      agentPayout,
      brokerageNet,
      createdAt: today,
    });

    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportCsv = () => {
    const header = [
      'Deal Name',
      'Date',
      'Sale Price',
      'Commission Rate (%)',
      'Agency Gross Commission',
      'Agent Payout',
      'Brokerage Net',
    ];
    const rows = commissions.map((c) => [
      `"${c.dealName.replace(/"/g, '""')}"`,
      `"${c.createdAt}"`,
      c.salePrice,
      c.commissionRate,
      c.grossCommission,
      c.agentPayout,
      c.brokerageNet,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join(
      '\n'
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keystone-commission-ledger.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalLedgerBrokerageNet = commissions.reduce(
    (sum, item) => sum + item.brokerageNet,
    0
  );

  return (
    <WorkspaceShell
      title="Commission & Split Desk"
      sectionLabel="Financial Calculator"
      action={
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={commissions.length === 0}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Input Form */}
        <form
          onSubmit={handleSaveProjection}
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7"
        >
          <div>
            <h2 className="font-display text-base font-semibold text-slate-950">
              Deal Parameters
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Model gross commission, co-brokerage fees, and agent-brokerage splits in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="deal-name"
                className="block text-xs font-medium text-slate-700"
              >
                Property or Deal Reference
              </label>
              <input
                id="deal-name"
                type="text"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
                className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="sale-price"
                className="block text-xs font-medium text-slate-700"
              >
                Contract Sale Price (USD)
              </label>
              <input
                id="sale-price"
                type="number"
                min={50000}
                step={25000}
                value={salePrice}
                onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3.5 font-mono text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="commission-rate"
                className="block text-xs font-medium text-slate-700"
              >
                Commission Rate (%)
              </label>
              <input
                id="commission-rate"
                type="number"
                min={0.5}
                max={10}
                step={0.25}
                value={commissionRate}
                onChange={(e) =>
                  setCommissionRate(Math.max(0, Number(e.target.value)))
                }
                className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3.5 font-mono text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="agent-split"
                  className="text-xs font-medium text-slate-700"
                >
                  Agent Split (%)
                </label>
                <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                  {agentSplitPct}% Agent / {100 - agentSplitPct}% Brokerage
                </span>
              </div>
              <input
                id="agent-split"
                type="range"
                min={40}
                max={95}
                step={5}
                value={agentSplitPct}
                onChange={(e) => setAgentSplitPct(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-900"
              />
            </div>

            <div>
              <label
                htmlFor="marketing-fee"
                className="block text-xs font-medium text-slate-700"
              >
                Marketing / Admin Deduction (USD)
              </label>
              <input
                id="marketing-fee"
                type="number"
                min={0}
                step={100}
                value={marketingFee}
                onChange={(e) =>
                  setMarketingFee(Math.max(0, Number(e.target.value)))
                }
                className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3.5 font-mono text-sm text-slate-950 focus:border-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={coBrokerSplit}
                onChange={(e) => setCoBrokerSplit(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-emerald-900"
              />
              <span>Split gross commission 50/50 with co-brokerage</span>
            </label>

            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{savedNotice ? 'Saved to Ledger' : 'Save to Ledger'}</span>
            </button>
          </div>
        </form>

        {/* Live Output Breakdown */}
        <div className="rounded-xl border border-slate-900 bg-slate-950 p-6 text-white lg:col-span-5">
          <p className="text-xs font-medium text-slate-400">
            Agency Gross Commission
          </p>
          <p className="mt-2 font-mono text-4xl font-semibold tracking-tight text-white tabular-nums">
            {formatCurrency(Math.round(agencyGrossCommission))}
          </p>

          <dl className="mt-6 space-y-3.5 border-t border-slate-800 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">Marketing &amp; admin fee</dt>
              <dd className="font-mono text-slate-200 tabular-nums">
                -{formatCurrency(marketingFee)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-400">
                Agent take-home ({agentSplitPct}%)
              </dt>
              <dd className="font-mono font-medium text-white tabular-nums">
                {formatCurrency(agentPayout)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3.5">
              <dt className="font-medium text-emerald-400">
                Net brokerage profit ({100 - agentSplitPct}%)
              </dt>
              <dd className="font-mono text-lg font-semibold text-emerald-400 tabular-nums">
                {formatCurrency(brokerageNet)}
              </dd>
            </div>
          </dl>

          <div className="mt-7 border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="deals-per-month" className="text-slate-300">
                Monthly run-rate volume
              </label>
              <span className="font-mono font-medium text-white tabular-nums">
                {dealsPerMonth} deals / mo
              </span>
            </div>
            <input
              id="deals-per-month"
              type="range"
              min={1}
              max={20}
              value={dealsPerMonth}
              onChange={(e) => setDealsPerMonth(Number(e.target.value))}
              className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400"
            />
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xs text-slate-400">
                Annualized net brokerage profit
              </span>
              <span className="font-mono text-lg font-semibold text-white tabular-nums">
                {formatCurrency(annualBrokerageNet)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Deal Ledger Table */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-950">
              Saved Commission Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Total projected brokerage net across saved deals:{' '}
              <span className="font-mono font-medium text-emerald-900 tabular-nums">
                {formatCurrency(totalLedgerBrokerageNet)}
              </span>
            </p>
          </div>
        </div>

        {commissions.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No saved deal projections yet. Calculate a deal above and click Save to Ledger.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                  <th className="px-5 py-3">Deal</th>
                  <th className="px-4 py-3 text-right">Sale Price</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Agent Payout</th>
                  <th className="px-4 py-3 text-right">Brokerage Net</th>
                  <th className="px-5 py-3 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-950">{rec.dealName}</p>
                      <p className="text-xs text-slate-500">{rec.createdAt}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                      {formatCurrency(rec.salePrice)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-600 tabular-nums">
                      {rec.commissionRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                      {formatCurrency(rec.agentPayout)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-900 tabular-nums">
                      {formatCurrency(rec.brokerageNet)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => deleteCommissionRecord(rec.id)}
                        aria-label={`Delete ${rec.dealName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
