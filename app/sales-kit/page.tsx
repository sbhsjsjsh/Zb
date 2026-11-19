'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Lock } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { usePrivateAuth } from '@/components/PrivateAuthProvider';

type PlaybookTab = 'offers' | 'cold-call' | 'objections' | 'pricing';

export default function SalesKitPage() {
  const { user, branding } = usePrivateAuth();
  const [activeTab, setActiveTab] = useState<PlaybookTab>('offers');
  const [sellerName, setSellerName] = useState(user?.name || 'Alex');
  const [brandName, setBrandName] = useState(branding.agencyName || 'Keystone');
  const [targetAgency, setTargetAgency] = useState('Harborview Realty');
  const [targetBroker, setTargetBroker] = useState('David');
  const [monthlyPrice, setMonthlyPrice] = useState('$399/mo');
  const [setupOffer, setSetupOffer] = useState('Free 14-day setup & CSV migration');
  const [selectedObjectionIdx, setSelectedObjectionIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const whatsappOffer = `Hi ${targetBroker}, this is ${sellerName}.

Quick question about ${targetAgency} — are your agents currently tracking buyer inquiries and property matches in spreadsheets or WhatsApp?

I built a ready-to-launch Real Estate Agency OS (${brandName}) specifically for growing brokerages:
- Captures every buyer lead in one shared pipeline so zero inquiries slip through
- Matches new listings to pre-approved buyers in 1 click
- Calculates agent & brokerage commission splits automatically
- Works cleanly on every agent's phone from day one

Founding Agency Offer for ${targetAgency}:
- ${monthlyPrice} flat for up to 20 agents (no per-deal fees)
- ${setupOffer}
- Risk-free guarantee: if your team doesn't save 5+ hours/week in the first 30 days, you don't pay.

Can I send you a 3-minute live demo link or walk you through it on a quick 10-minute call tomorrow?`;

  const emailOffer = `Subject: Stop losing buyer leads at ${targetAgency} (10-min live walkthrough)

Hi ${targetBroker},

Most real estate agencies lose 20–30% of inbound portal and referral leads simply because inquiries sit in individual agent inboxes or get buried in WhatsApp threads.

We built ${brandName} to fix that in one afternoon without forcing your agents into a bloated enterprise CRM.

Here is what ${targetAgency} gets out of the box:
1. Shared Lead & Deal Pipeline: Track every inquiry from first contact to viewing, offer, and closing — with 1-tap WhatsApp follow-ups.
2. Instant Buyer-to-Listing Matching: When you list a new property, click "Match Buyers" to immediately pull every client whose budget and criteria fit.
3. Live Commission & Split Desk: Calculate co-broker fees, agent splits, and net brokerage profit with CSV export.
4. Broker Command Dashboard: See pipeline value, response speed, and upcoming viewings across all agents on one screen.

Our Partner Brokerage Offer:
- Flat agency license at ${monthlyPrice} (up to 20 agents)
- ${setupOffer} — we import your current listings and buyer contacts for you
- Zero long-term lock-in contracts

Recovering just ONE extra commission this year pays for the software 25x over.

Are you open to a quick 10-minute screen share on Tuesday or Thursday?

Best regards,
${sellerName}
${brandName}`;

  const onePagePitch = `THE IRRESISTIBLE REAL ESTATE SOFTWARE OFFER

WHO IT IS FOR:
Managing brokers and real estate agency owners with 3–30 agents who want faster lead response, cleaner deal visibility, and higher closing rates.

THE CORE PROMISE:
"We install a branded Real Estate Agency Operating System for ${targetAgency} in 14 days — uniting your buyer pipeline, property inventory matching, viewing schedule, and commission split desk — so your agents never drop a hot lead again."

THE OFFER STACK:
1. Branded ${brandName} Agency Platform (Desktop + Mobile Web)
2. Done-For-You Data Import (we migrate your spreadsheets & contacts)
3. 45-Minute Live Agent Onboarding Session
4. 30-Day Performance Guarantee (zero lock-in)

INVESTMENT OPTIONS:
- Option A (Monthly SaaS): ${monthlyPrice} flat for the entire brokerage
- Option B (White-Label Buyout): $3,500 one-time custom deployment under ${targetAgency}'s own brand`;

  const coldCallSections = [
    {
      id: 'opener',
      step: '01. Permission-Based Opener (First 12 Seconds)',
      note: 'Use a calm, peer-to-peer tone. Slow down. Never sound like a telemarketer.',
      script: `"Hi ${targetBroker}, this is ${sellerName} calling about ${targetAgency}. I know I'm catching you out of the blue — do you have 30 seconds for me to tell you why I called, and you can tell me if it's relevant?"`,
    },
    {
      id: 'hook',
      step: '02. The Real Estate Pain Hook',
      note: 'Hit the exact financial leak every managing broker feels: unreturned leads and messy spreadsheets.',
      script: `"I work with residential and commercial real estate agencies that are doing strong deal volume, but losing 2 or 3 commissions a quarter because portal inquiries, buyer preferences, and viewing follow-ups are scattered across WhatsApp and spreadsheets. Quick question — how are your agents currently matching new listings to existing buyers in your database?"`,
    },
    {
      id: 'discovery',
      step: '03. Three High-Leverage Discovery Questions',
      note: 'Listen carefully. Let the broker state the pain in their own words before pitching.',
      script: `1. "When a new buyer inquiry comes in from a portal or referral, how long does it usually take before you know an agent actually called them back?"
2. "If you bring a $1M+ listing onto the books tomorrow morning, can your team pull up every matching buyer in under 10 seconds?"
3. "At the end of the month, how much time do you spend reconciling agent commission splits and forecasting closed GCI?"`,
    },
    {
      id: 'pitch',
      step: '04. The 20-Second Value Pitch',
      note: 'Tie directly to ONE extra closed deal paying for the entire year.',
      script: `"That's exactly why we built ${brandName}. It's a lightweight, mobile-first operating system built specifically for real estate agencies — pipeline CRM, 1-click buyer-to-listing matching, viewing scheduler, and live commission split desk in one clean screen. We set it up with your agency's data in 14 days for ${monthlyPrice} flat — so if it helps your team recover just one extra closing this year, it pays for itself 20 times over."`,
    },
    {
      id: 'close',
      step: '05. Low-Friction Demo Close',
      note: 'Never ask to sell on the cold call. Only sell the 12-minute live walkthrough.',
      script: `"I don't expect you to buy anything over the phone. Let me show you the live system with sample listings on a quick 12-minute Zoom or in-office walkthrough. Do you have 12 minutes tomorrow at 10:30 AM, or is Thursday afternoon better for you?"`,
    },
  ];

  const fullColdCallScript = coldCallSections
    .map((s) => `${s.step}\n${s.script}`)
    .join('\n\n');

  const objections = [
    {
      label: '"We already use Excel / WhatsApp"',
      rebuttal: `"Totally fair — almost every brokerage we talk to starts on Excel and WhatsApp because big CRMs feel way too complicated. The problem is WhatsApp doesn't remind an agent 48 hours later, and Excel can't match a new listing to 40 past buyers in one click. What if I show you in 10 minutes how ${brandName} keeps the exact same simplicity, plus gives you a broker dashboard so no deal slips through?"`,
    },
    {
      label: '"We already have a CRM"',
      rebuttal: `"That's actually great to hear — which one are you using? And honestly, out of 10 agents on your team, how many log into it every single day without you chasing them? Most brokers we speak with are paying for a CRM that only 20% of their agents actually open. We built ${brandName} so agents use it on their phone in 30 seconds. Worth a 10-minute comparison?"`,
    },
    {
      label: '"Just send me an email"',
      rebuttal: `"Happy to send over a 1-page summary right after we hang up. So I don't send you generic fluff — what's the bigger headache at ${targetAgency} right now: agents following up slowly on new leads, or keeping track of listings and commission splits? ... Got it. I'll send that over to your email and pencil a quick 10-minute look on Thursday — fair?"`,
    },
    {
      label: '"Too expensive right now"',
      rebuttal: `"I hear you, and protecting agency overhead matters. That's why we don't charge per-seat enterprise fees — it's ${monthlyPrice} flat for the office with ${setupOffer.toLowerCase()}. What's your average commission on one closing — $8,000, $15,000? If the system recovers just one lost buyer inquiry in the next 12 months, it's net positive by thousands of dollars."`,
    },
    {
      label: '"My agents won\'t adopt new software"',
      rebuttal: `"100% agree — that's the #1 reason real estate software fails. We designed ${brandName} specifically for agents who hate data entry: adding a lead takes 15 seconds on a phone, WhatsApp follow-ups are pre-written with one tap, and we run the 45-minute onboarding call with your team directly so you don't have to train anyone."`,
    },
    {
      label: '"Call me back next quarter"',
      rebuttal: `"No problem at all, ${targetBroker}. Quick thought before we put it on the calendar: every month you wait is another 40 to 80 inquiries going into the old workflow. Let's do a 10-minute preview this week while it's fresh so when next quarter starts, you already know whether it's worth deploying — Thursday at 2 PM work?"`,
    },
  ];

  const pricingModels = [
    {
      model: '01. Monthly Agency Retainer (Easiest Recurring Income)',
      price: '$299 – $499 / month',
      bestFor: 'Independent brokerages with 5–20 agents',
      whyItSells:
        'Low upfront risk for the broker. Position it as "less than $25 per agent per month" and waive the setup fee if they sign up within 7 days of the demo.',
    },
    {
      model: '02. Setup Fee + Monthly Subscription (Fast Cash + MRR)',
      price: '$1,200 setup + $249 / month',
      bestFor: 'Agencies needing CSV contact import & agent training',
      whyItSells:
        'You collect immediate cash upfront for branding the app, importing their listings/buyers, and running a 45-minute Zoom training with their agents.',
    },
    {
      model: '03. White-Label Brokerage Buyout (High-Ticket One-Time Sale)',
      price: '$3,500 – $6,000 one-time',
      bestFor: 'Established agencies that hate monthly SaaS bills',
      whyItSells:
        'Many traditional real estate owners prefer owning their own branded system outright. Deploy under their domain/logo and add an optional $150/mo support retainer.',
    },
  ];

  if (branding.hideSalesKitForClients && user?.role !== 'Owner') {
    return (
      <WorkspaceShell title="Restricted Module" sectionLabel="Private Access">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <Lock className="mx-auto h-6 w-6 text-slate-400" />
          <h2 className="mt-3 font-display text-lg font-semibold text-slate-950">
            Owner-only sales playbook
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This internal sales kit is hidden for client brokerage accounts.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex min-h-[40px] items-center rounded-lg bg-emerald-900 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            Return to Dashboard
          </Link>
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      title="Sales Offer & Cold Calling Kit"
      sectionLabel="Seller Playbook"
      action={
        <button
          type="button"
          onClick={() => copyText('all-script', fullColdCallScript)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
        >
          {copiedKey === 'all-script' ? (
            <>
              <Check className="h-4 w-4" />
              <span>Full Script Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Full Call Script</span>
            </>
          )}
        </button>
      }
    >
      {/* Live Personalization Bar */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="font-display text-sm font-semibold text-slate-950">
            Personalize Your Pitch &amp; Scripts
          </h2>
          <p className="text-xs text-slate-500">
            Update these fields before texting or calling a real estate company — every offer and script below updates instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className="block text-[11px] font-medium text-slate-600">
              Your Name
            </label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 px-2.5 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">
              Software Brand
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 px-2.5 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">
              Target Agency
            </label>
            <input
              type="text"
              value={targetAgency}
              onChange={(e) => setTargetAgency(e.target.value)}
              className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 px-2.5 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">
              Broker First Name
            </label>
            <input
              type="text"
              value={targetBroker}
              onChange={(e) => setTargetBroker(e.target.value)}
              className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 px-2.5 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">
              Price Offer
            </label>
            <input
              type="text"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 px-2.5 font-mono text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">
              Bonus / Risk Reversal
            </label>
            <input
              type="text"
              value={setupOffer}
              onChange={(e) => setSetupOffer(e.target.value)}
              className="mt-1 min-h-[38px] w-full rounded-lg border border-slate-300 px-2.5 text-xs text-slate-950 focus:border-emerald-800 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Segmented Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
        {(
          [
            { id: 'offers', label: 'Selling Offers' },
            { id: 'cold-call', label: 'Cold Calling Script' },
            { id: 'objections', label: 'Objection Handlers' },
            { id: 'pricing', label: 'Pricing & Close Guide' },
          ] as Array<{ id: PlaybookTab; label: string }>
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[40px] flex-1 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Selling Offers */}
      {activeTab === 'offers' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-emerald-900">
                    01. Direct Message Offer
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-slate-950">
                    WhatsApp / SMS Selling Offer
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyText('whatsapp', whatsappOffer)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 whitespace-nowrap"
                >
                  {copiedKey === 'whatsapp' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-100 bg-[#FAFAFA] p-4 font-sans text-sm leading-relaxed text-slate-800">
                {whatsappOffer}
              </pre>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-emerald-900">
                    02. Outbound Email Offer
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-slate-950">
                    B2B Cold Email Proposal
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyText('email', emailOffer)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 whitespace-nowrap"
                >
                  {copiedKey === 'email' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-100 bg-[#FAFAFA] p-4 font-sans text-sm leading-relaxed text-slate-800">
                {emailOffer}
              </pre>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-emerald-900">
                  03. Meeting &amp; Proposal Sheet
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-slate-950">
                  One-Page Irresistible Offer Stack
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyText('pitch', onePagePitch)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 whitespace-nowrap"
              >
                {copiedKey === 'pitch' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Offer</span>
                  </>
                )}
              </button>
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-100 bg-[#FAFAFA] p-4 font-sans text-sm leading-relaxed text-slate-800">
              {onePagePitch}
            </pre>
          </article>
        </div>
      )}

      {/* Tab 2: Cold Calling Script */}
      {activeTab === 'cold-call' && (
        <div className="mt-6 space-y-4">
          {coldCallSections.map((section) => (
            <article
              key={section.id}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-950">
                    {section.step}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{section.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(section.id, section.script)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  {copiedKey === section.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Step</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-900">
                {section.script}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* Tab 3: Objection Handlers */}
      {activeTab === 'objections' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-5">
            {objections.map((obj, idx) => (
              <button
                key={obj.label}
                type="button"
                onClick={() => setSelectedObjectionIdx(idx)}
                className={`flex min-h-[48px] w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  selectedObjectionIdx === idx
                    ? 'border-emerald-900 bg-emerald-950 text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{obj.label}</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-emerald-900">
                  Word-for-Word Rebuttal
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
                  {objections[selectedObjectionIdx].label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  copyText(
                    `obj-${selectedObjectionIdx}`,
                    objections[selectedObjectionIdx].rebuttal
                  )
                }
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 whitespace-nowrap"
              >
                {copiedKey === `obj-${selectedObjectionIdx}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-6 text-base leading-relaxed text-slate-800">
              {objections[selectedObjectionIdx].rebuttal}
            </p>

            <div className="mt-8 border-t border-slate-100 pt-5 text-xs leading-relaxed text-slate-500">
              Tip: Acknowledge the objection calmly first (&ldquo;Totally fair&rdquo; or &ldquo;I hear you&rdquo;), never argue, then immediately pivot back to booking a 10-minute live demo of /dashboard and /listings.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Pricing & Close Strategy */}
      {activeTab === 'pricing' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pricingModels.map((item) => (
              <div
                key={item.model}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
              >
                <div>
                  <p className="text-xs font-medium text-emerald-900">
                    {item.bestFor}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-slate-950">
                    {item.model}
                  </h3>
                  <p className="mt-4 font-mono text-2xl font-semibold text-slate-950 tabular-nums">
                    {item.price}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {item.whyItSells}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-slate-950">
              12-Minute Live Demo Flow (Show This Exact Order)
            </h3>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-950">Minutes 1–3 (/):</span>{' '}
                Open the ROI Calculator on the home page, punch in their monthly lead count and average commission, and let them see the dollar amount they are currently leaving on the table.
              </li>
              <li>
                <span className="font-semibold text-slate-950">Minutes 4–6 (/leads):</span>{' '}
                Add a live test buyer in front of them, drag/advance the deal stage, and copy the pre-written WhatsApp follow-up message.
              </li>
              <li>
                <span className="font-semibold text-slate-950">Minutes 7–9 (/listings):</span>{' '}
                Click &ldquo;Match Buyers&rdquo; on a listing so they see how fast their team can call qualified buyers whenever a new home hits the market.
              </li>
              <li>
                <span className="font-semibold text-slate-950">Minutes 10–12 (/calculator):</span>{' '}
                Run one of their real deals through the Commission &amp; Split Desk, then ask: &ldquo;Would you like us to start with the {monthlyPrice} monthly license or the one-time branded setup?&rdquo;
              </li>
            </ol>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
