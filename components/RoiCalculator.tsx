'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/agency-data';

export function RoiCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(65);
  const [avgCommission, setAvgCommission] = useState(14500);
  const [slowResponseLossPct, setSlowResponseLossPct] = useState(30);

  // Conservative model: 8% base conversion on qualified leads; slow response loses slowResponseLossPct of those deals;
  // recovering half of leaked opportunities yields conservative extra monthly deals.
  const leakedDealsPerYear = (monthlyLeads * 12 * 0.08 * (slowResponseLossPct / 100));
  const recoveredDealsPerYear = Math.max(1, Math.round(leakedDealsPerYear * 0.55));
  const recoveredAnnualRevenue = recoveredDealsPerYear * avgCommission;
  const annualSoftwareCost = 399 * 12;
  const roiMultiple = Math.max(1, Math.round(recoveredAnnualRevenue / annualSoftwareCost));

  return (
    <section
      id="roi"
      className="border-y border-slate-200 bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-900">
            Brokerage ROI Estimator
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Calculate the commissions your agency loses to slow follow-up
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Adjust your brokerage numbers below. Use this live calculator during agency demos to show managing brokers how recovering a single lost transaction covers years of software.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Sliders */}
          <div className="space-y-8 rounded-xl border border-slate-200 bg-[#FAFAFA] p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label
                  htmlFor="monthly-leads"
                  className="text-sm font-medium text-slate-900"
                >
                  Monthly inbound buyer and seller leads
                </label>
                <span className="font-mono text-lg font-semibold text-slate-950 tabular-nums">
                  {monthlyLeads} / mo
                </span>
              </div>
              <input
                id="monthly-leads"
                type="range"
                min={15}
                max={300}
                step={5}
                value={monthlyLeads}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-900"
              />
              <div className="mt-1.5 flex justify-between text-xs text-slate-500 tabular-nums">
                <span>15 leads</span>
                <span>150 leads</span>
                <span>300 leads</span>
              </div>
            </div>

            <div className="border-t border-slate-200/80 pt-7">
              <div className="flex items-baseline justify-between gap-4">
                <label
                  htmlFor="avg-commission"
                  className="text-sm font-medium text-slate-900"
                >
                  Average gross commission per closed deal
                </label>
                <span className="font-mono text-lg font-semibold text-slate-950 tabular-nums">
                  {formatCurrency(avgCommission)}
                </span>
              </div>
              <input
                id="avg-commission"
                type="range"
                min={4000}
                max={45000}
                step={500}
                value={avgCommission}
                onChange={(e) => setAvgCommission(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-900"
              />
              <div className="mt-1.5 flex justify-between text-xs text-slate-500 tabular-nums">
                <span>$4,000</span>
                <span>$20,000</span>
                <span>$45,000</span>
              </div>
            </div>

            <div className="border-t border-slate-200/80 pt-7">
              <div className="flex items-baseline justify-between gap-4">
                <label
                  htmlFor="leak-rate"
                  className="text-sm font-medium text-slate-900"
                >
                  Leads contacted after 30+ minutes or missed
                </label>
                <span className="font-mono text-lg font-semibold text-slate-950 tabular-nums">
                  {slowResponseLossPct}%
                </span>
              </div>
              <input
                id="leak-rate"
                type="range"
                min={10}
                max={60}
                step={5}
                value={slowResponseLossPct}
                onChange={(e) => setSlowResponseLossPct(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-900"
              />
              <div className="mt-1.5 flex justify-between text-xs text-slate-500 tabular-nums">
                <span>10% leakage</span>
                <span>35% industry avg</span>
                <span>60% leakage</span>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="rounded-xl border border-slate-900 bg-slate-950 p-6 text-white sm:p-8 lg:col-span-5">
            <p className="text-sm font-medium text-slate-300">
              Projected annual commission recovered
            </p>
            <p className="mt-3 font-mono text-4xl font-semibold tracking-tight text-white tabular-nums sm:text-5xl">
              {formatCurrency(recoveredAnnualRevenue)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Based on recovering{' '}
              <span className="font-mono font-medium text-white tabular-nums">
                {recoveredDealsPerYear} additional closings
              </span>{' '}
              per year through sub-5-minute inquiry routing and structured buyer matching.
            </p>

            <div className="mt-8 space-y-4 border-t border-slate-800 pt-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Growth Agency plan cost</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {formatCurrency(annualSoftwareCost)} / yr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated return multiple</span>
                <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                  {roiMultiple}x return
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/calculator"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100 whitespace-nowrap"
              >
                <span>Open Full Commission Split Desk</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
