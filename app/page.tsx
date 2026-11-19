import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PropertyPhoto } from '@/components/PropertyPhoto';
import { RoiCalculator } from '@/components/RoiCalculator';
import { DemoBookingForm } from '@/components/DemoBookingForm';

const BENCHMARKS = [
  {
    value: '4.2 min',
    label: 'Median lead response time',
    context: 'Down from 3.8 hours on email & spreadsheets',
  },
  {
    value: '+31%',
    label: 'Viewing-to-offer conversion',
    context: 'Measured across 14 partner brokerages in 6 months',
  },
  {
    value: '$142K',
    label: 'Median commission recovered',
    context: 'Annualized per 10-agent residential office',
  },
  {
    value: '14 days',
    label: 'Full agency onboarding',
    context: 'Includes agent training and contact import',
  },
];

const PRICING_TIERS = [
  {
    name: 'Boutique Brokerage',
    audience: 'For early-stage teams (up to 5 agents)',
    price: '$199',
    cadence: 'per month · billed monthly',
    features: [
      'Up to 5 agent seats included',
      'Unlimited buyer & seller lead records',
      'Property portfolio & buyer matching',
      'Commission & broker split calculator',
      'Mobile-ready web workspace',
    ],
    cta: 'Start Boutique Demo',
    featured: false,
  },
  {
    name: 'Growth Agency',
    audience: 'For scaling agencies (up to 20 agents)',
    price: '$399',
    cadence: 'per month · white-label ready',
    features: [
      'Up to 20 agent seats included',
      'Everything in Boutique plus agent leaderboard',
      'Priority viewing schedule & follow-up queues',
      'Custom brokerage branding & CSV export',
      'Dedicated 14-day onboarding & migration',
    ],
    cta: 'Launch Live Demo',
    featured: true,
  },
  {
    name: 'Multi-Office Enterprise',
    audience: 'For regional & commercial brokerages',
    price: '$899',
    cadence: 'per month · or $4,500 white-label buyout',
    features: [
      'Unlimited agent & branch seats',
      'Multi-office pipeline & commission reporting',
      'Custom portal lead routing setup',
      'Direct brokerage ownership option',
      'Quarterly broker operations review',
    ],
    cta: 'Request Agency Quote',
    featured: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900">
      <SiteHeader />

      {/* Hero Section: Asymmetric Split with Dominant Architectural Focal Carrier */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between lg:col-span-6 lg:py-4">
            <div>
              <p className="text-sm font-medium text-emerald-900">
                Real Estate Agency Operating System
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-slate-950">
                Turn every property inquiry into a closed commission
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Keystone replaces scattered spreadsheets, missed WhatsApp messages, and manual commission math with one fast workspace built for residential and commercial brokerages.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-emerald-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
                >
                  <span>Open Interactive Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sales-kit"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  View Selling Offer &amp; Cold Call Script
                </Link>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-xs text-slate-500">
                Built for managing brokers · Residential, luxury, and commercial desks · Works on desktop and mobile phones
              </p>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:min-h-[400px] lg:col-span-6 lg:min-h-[480px]">
            <PropertyPhoto
              imageKey="hero_estate"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 text-white">
              <p className="font-mono text-xs text-slate-200 tabular-nums">
                Active Brokerage Portfolio · $15.6M Listed · 7 Qualified Buyers
              </p>
              <p className="mt-1 font-display text-lg font-medium text-white">
                Olive Grove Limestone Estate · Canyon Ridge
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Benchmark Strip */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {BENCHMARKS.map((item) => (
            <div key={item.label} className="p-6">
              <p className="font-mono text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {item.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {item.context}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Capabilities: Asymmetric Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-900">
            Platform Architecture
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Four operational modules every agency uses daily
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Every module below is live and interactive. Click directly into any workflow to walk a broker through a real transaction from inquiry to commission payout.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 01 - Wide */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-2">
            <div>
              <p className="text-xs font-medium text-slate-500">
                01. Lead Capture &amp; Deal Pipeline
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950">
                Stop losing hot portal and referral leads to unreturned messages
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Track every buyer from New Inquiry through Qualified, Viewing Scheduled, Offer Made, and Closed Won. Log calls in one tap, record private negotiation notes, and copy tailored WhatsApp follow-ups directly from the lead record.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <span className="text-xs text-slate-500">
                Kanban board · Mobile list view · Stage filters · Follow-up timer
              </span>
              <Link
                href="/leads"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-900 hover:text-emerald-700 whitespace-nowrap"
              >
                <span>Open Lead Pipeline</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 02 */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium text-slate-500">
                02. Inventory &amp; Buyer Matching
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-slate-950">
                Match active listings to pre-approved buyers instantly
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                When a new property hits the desk, click Match Buyers to surface every active client whose budget and property criteria align.
              </p>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-5">
              <Link
                href="/listings"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-900 hover:text-emerald-700 whitespace-nowrap"
              >
                <span>Explore Listings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 03 */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium text-slate-500">
                03. Commission &amp; Split Desk
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-slate-950">
                Transparent agent payouts and net brokerage profit
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Model co-brokerage splits, agent tiers, and transaction deductions on the spot, save deal forecasts, and export ledgers as CSV.
              </p>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-5">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-900 hover:text-emerald-700 whitespace-nowrap"
              >
                <span>Open Calculator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 04 - Wide */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-8 lg:col-span-2">
            <div>
              <p className="text-xs font-medium text-emerald-400">
                04. Built-In B2B Software Sales Playbook
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                Ready-to-send selling offers and word-for-word cold calling scripts
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                Selling this platform to real estate companies? Open the Seller Playbook to personalize your agency name and price, copy high-converting WhatsApp and email offers, and read live cold calling and objection-handling scripts on the phone.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
              <span className="text-xs text-slate-400">
                WhatsApp offers · Cold email · Live call script · 6 broker objection rebuttals
              </span>
              <Link
                href="/sales-kit"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-emerald-300 whitespace-nowrap"
              >
                <span>Open Sales Offer &amp; Scripts</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Estimator */}
      <RoiCalculator />

      {/* Proof / Agency Outcomes */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-900">
            Brokerage Outcomes
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Measurable operational shifts inside real agencies
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Residential Luxury Desk</span>
                <span aria-hidden="true">·</span>
                <span>14 Agents</span>
                <span aria-hidden="true">·</span>
                <span>Austin, Texas</span>
              </div>
              <p className="mt-4 font-mono text-2xl font-semibold text-emerald-900 tabular-nums">
                +$218,000 additional closed GCI in 6 months
              </p>
              <blockquote className="mt-4 text-base leading-relaxed text-slate-700">
                &ldquo;Before Keystone, portal inquiries sat in individual agent inboxes for half a day. Moving our 14 agents onto one shared pipeline cut first response time to under five minutes and directly added six closings in our first two quarters.&rdquo;
              </blockquote>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              <p className="font-medium text-slate-950">Catherine Halstead</p>
              <p className="text-slate-500">Managing Broker, Barton Creek Realty</p>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Mixed-Use &amp; Commercial</span>
                <span aria-hidden="true">·</span>
                <span>9 Brokers</span>
                <span aria-hidden="true">·</span>
                <span>Chicago, Illinois</span>
              </div>
              <p className="mt-4 font-mono text-2xl font-semibold text-emerald-900 tabular-nums">
                9 hours saved per week on deal reconciliation
              </p>
              <blockquote className="mt-4 text-base leading-relaxed text-slate-700">
                &ldquo;Our principals used to reconcile co-broker splits and buyer preferences across four spreadsheets. Having buyer matching and the commission split ledger inside one clean screen meant our team adopted it in one afternoon.&rdquo;
              </blockquote>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
              <p className="font-medium text-slate-950">Martin Kowalski</p>
              <p className="text-slate-500">Principal Partner, Northshore Commercial Advisors</p>
            </div>
          </article>
        </div>
      </section>

      {/* Transparent Agency Pricing */}
      <section
        id="pricing"
        className="border-t border-slate-200 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-emerald-900">
              Agency Licensing
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Simple brokerage pricing with zero per-transaction fees
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Every tier includes mobile access, CSV import, and onboarding support. Flat monthly licensing or one-time agency buyout.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col justify-between rounded-xl border p-6 sm:p-8 ${
                  tier.featured
                    ? 'border-emerald-900 bg-slate-950 text-white'
                    : 'border-slate-200 bg-[#FAFAFA] text-slate-900'
                }`}
              >
                <div>
                  <p
                    className={`text-xs font-medium ${
                      tier.featured ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {tier.audience}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold">
                    {tier.name}
                  </h3>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-semibold tracking-tight tabular-nums">
                      {tier.price}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      tier.featured ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {tier.cadence}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-current/10 pt-6 text-sm">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className={
                          tier.featured ? 'text-slate-200' : 'text-slate-700'
                        }
                      >
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={tier.featured ? '/dashboard' : '#book-demo'}
                    className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      tier.featured
                        ? 'bg-white text-slate-950 hover:bg-slate-100'
                        : 'bg-emerald-900 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Request Section */}
      <section
        id="book-demo"
        className="border-t border-slate-200 bg-[#FAFAFA] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-emerald-900">
                15-Minute Live Walkthrough
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950">
                Deploy Keystone for your brokerage in 14 days
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We configure your custom branding, import your existing buyer database, and train your agents in a single 45-minute session.
              </p>
              <div className="mt-8 space-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
                <p>No long-term lock-in contracts</p>
                <p>Full data ownership with instant CSV exports</p>
                <p>Works smoothly on iOS, Android, tablets, and desktops</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <DemoBookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <Link
              href="/"
              className="font-display text-base font-bold tracking-tight text-slate-950"
            >
              Keystone
            </Link>
            <p className="mt-1 text-xs text-slate-500">
              Real estate agency CRM, inventory matching, and commission software.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600"
          >
            <Link href="/dashboard" className="hover:text-slate-950">
              Dashboard
            </Link>
            <Link href="/leads" className="hover:text-slate-950">
              Lead Pipeline
            </Link>
            <Link href="/listings" className="hover:text-slate-950">
              Property Listings
            </Link>
            <Link href="/calculator" className="hover:text-slate-950">
              Commission Desk
            </Link>
            <Link href="/sales-kit" className="hover:text-slate-950">
              Sales Offer &amp; Scripts
            </Link>
            <Link href="/settings" className="hover:text-slate-950">
              Access &amp; Privacy
            </Link>
          </nav>

          <p className="text-xs text-slate-400">
            © 2026 Keystone Software
          </p>
        </div>
      </footer>
    </div>
  );
}
