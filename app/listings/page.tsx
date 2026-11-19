'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Search, Users, X } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PropertyPhoto } from '@/components/PropertyPhoto';
import { useAgency } from '@/components/AgencyProvider';
import {
  AGENTS,
  formatCurrency,
  type PropertyListing,
  type PropertyStatus,
  type PropertyType,
} from '@/lib/agency-data';
import { PROPERTY_IMAGES, type PropertyImageKey } from '@/lib/images';

const STATUS_OPTIONS: Array<PropertyStatus | 'All'> = [
  'All',
  'Active',
  'Under Offer',
  'Sold',
];

export default function ListingsPage() {
  const { listings, leads, addListing, updateListingStatus } = useAgency();

  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [matchedListing, setMatchedListing] = useState<PropertyListing | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Add listing form state
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [price, setPrice] = useState('2250000');
  const [beds, setBeds] = useState('4');
  const [baths, setBaths] = useState('3.5');
  const [sqft, setSqft] = useState('3450');
  const [type, setType] = useState<PropertyType>('Residential');
  const [agent, setAgent] = useState(AGENTS[0]);
  const [imageKey, setImageKey] = useState<PropertyImageKey>('coastal');
  const [description, setDescription] = useState('');

  const filteredListings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    });
  }, [listings, statusFilter, search]);

  const matchedBuyers = useMemo(() => {
    if (!matchedListing) return [];
    return leads
      .filter((lead) => lead.stage !== 'Closed Won')
      .map((lead) => {
        const budgetRatio = lead.budget / matchedListing.price;
        const typeMatch = lead.preferredType === matchedListing.type;
        const budgetClose = budgetRatio >= 0.78 && budgetRatio <= 1.35;
        let matchReason = 'Budget aligned';
        if (typeMatch && budgetClose) {
          matchReason = 'Exact property type & budget match';
        } else if (typeMatch) {
          matchReason = 'Preferred property type match';
        }
        return {
          lead,
          score: (typeMatch ? 2 : 0) + (budgetClose ? 2 : 0),
          matchReason,
        };
      })
      .filter((entry) => entry.score >= 2)
      .sort((a, b) => b.score - a.score);
  }, [matchedListing, leads]);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    addListing({
      title: title.trim(),
      address: address.trim(),
      neighborhood: neighborhood.trim() || 'Central District',
      price: Math.max(100000, Number(price) || 1500000),
      beds: Math.max(0, Number(beds) || 0),
      baths: Math.max(1, Number(baths) || 1),
      sqft: Math.max(500, Number(sqft) || 2000),
      type,
      status: 'Active',
      agent,
      daysOnMarket: 1,
      commissionRate: 3.0,
      imageKey,
      description:
        description.trim() ||
        'Architectural residence represented exclusively by Keystone Realty.',
    });

    setTitle('');
    setAddress('');
    setNeighborhood('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <WorkspaceShell
      title="Property Portfolio"
      sectionLabel="Listings & Matching"
      action={
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Listing</span>
        </button>
      }
    >
      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search property, neighborhood, or type..."
            className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-[#FAFAFA] pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            No properties match your current filter
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('All');
              setSearch('');
            }}
            className="mt-4 inline-flex min-h-[40px] items-center rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
          >
            Show All Listings
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredListings.map((listing) => (
            <article
              key={listing.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <PropertyPhoto
                  imageKey={listing.imageKey}
                  alt={listing.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>
                      {listing.type} · {listing.neighborhood} · {listing.daysOnMarket}d on market
                    </span>
                    <span
                      className={`font-medium ${
                        listing.status === 'Active'
                          ? 'text-emerald-800'
                          : listing.status === 'Under Offer'
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold text-slate-950">
                      {listing.title}
                    </h2>
                    <p className="font-mono text-lg font-semibold text-slate-950 tabular-nums">
                      {formatCurrency(listing.price)}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {listing.address} ·{' '}
                    {listing.beds > 0 ? `${listing.beds} bd · ` : ''}
                    {listing.baths} ba · {listing.sqft.toLocaleString()} sq ft
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {listing.description}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <select
                    aria-label={`Change status for ${listing.title}`}
                    value={listing.status}
                    onChange={(e) =>
                      updateListingStatus(
                        listing.id,
                        e.target.value as PropertyStatus
                      )
                    }
                    className="min-h-[38px] rounded-lg border border-slate-200 bg-[#FAFAFA] px-2.5 text-xs font-medium text-slate-700 focus:border-emerald-800 focus:outline-none"
                  >
                    <option value="Active">Status: Active</option>
                    <option value="Under Offer">Status: Under Offer</option>
                    <option value="Sold">Status: Sold</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setMatchedListing(listing)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-emerald-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Match Buyers</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Buyer Matching Drawer */}
      {matchedListing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/35 backdrop-blur-[1px]"
            onClick={() => setMatchedListing(null)}
          />
          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Smart Buyer Matching</p>
                <h2 className="font-display text-base font-semibold text-slate-950 truncate">
                  {matchedListing.title}
                </h2>
                <p className="font-mono text-xs text-emerald-900 tabular-nums">
                  {formatCurrency(matchedListing.price)} · {matchedListing.type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMatchedListing(null)}
                aria-label="Close buyer matches"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {matchedBuyers.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No active leads currently match this property&apos;s price bracket or type. Add a new buyer in Lead Pipeline to test live matching.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {matchedBuyers.map(({ lead, matchReason }) => (
                    <li key={lead.id} className="py-4 first:pt-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-950">
                          {lead.name}
                        </p>
                        <span className="font-mono text-xs font-medium text-slate-900 tabular-nums">
                          {formatCurrency(lead.budget)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-emerald-800">
                        {matchReason}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Stage: {lead.stage} · Agent: {lead.agent}
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-600">
                        {lead.phone}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setMatchedListing(null)}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Close Matcher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="font-display text-lg font-semibold text-slate-950">
                Add Property Listing
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

            <form onSubmit={handleAddProperty} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Harbor Crest Modern Residence"
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="1280 Vista Drive"
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Westlake Hills"
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    List Price (USD)
                  </label>
                  <input
                    type="number"
                    min={100000}
                    step={25000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 font-mono text-sm focus:border-emerald-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Property Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Bedrooms / Baths / Sq Ft
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      placeholder="Beds"
                      className="min-h-[42px] rounded-lg border border-slate-300 px-2 font-mono text-xs focus:border-emerald-800 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                      placeholder="Baths"
                      className="min-h-[42px] rounded-lg border border-slate-300 px-2 font-mono text-xs focus:border-emerald-800 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      placeholder="Sqft"
                      className="min-h-[42px] rounded-lg border border-slate-300 px-2 font-mono text-xs focus:border-emerald-800 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Photo Preset
                  </label>
                  <select
                    value={imageKey}
                    onChange={(e) =>
                      setImageKey(e.target.value as PropertyImageKey)
                    }
                    className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-800 focus:outline-none"
                  >
                    {(Object.keys(PROPERTY_IMAGES) as PropertyImageKey[]).map(
                      (key) => (
                        <option key={key} value={key}>
                          {PROPERTY_IMAGES[key].label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Listing Agent
                </label>
                <select
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                  className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-emerald-800 focus:outline-none"
                >
                  {AGENTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Property Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural details, lot highlights, renovation notes..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-emerald-800 focus:outline-none"
                />
              </div>

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
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
