'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';
import {
  INITIAL_COMMISSIONS,
  INITIAL_LEADS,
  INITIAL_LISTINGS,
  INITIAL_VIEWINGS,
  type CommissionRecord,
  type Lead,
  type LeadStage,
  type PropertyListing,
  type PropertyStatus,
  type ViewingAppointment,
} from '@/lib/agency-data';

interface AgencyState {
  leads: Lead[];
  listings: PropertyListing[];
  viewings: ViewingAppointment[];
  commissions: CommissionRecord[];
}

interface AgencyContextValue extends AgencyState {
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  updateLeadNotes: (id: string, notes: string) => void;
  markLeadContacted: (id: string) => void;
  deleteLead: (id: string) => void;
  addListing: (listing: Omit<PropertyListing, 'id'>) => void;
  updateListingStatus: (id: string, status: PropertyStatus) => void;
  toggleViewingStatus: (id: string) => void;
  addCommissionRecord: (record: Omit<CommissionRecord, 'id'>) => void;
  deleteCommissionRecord: (id: string) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'keystone_agency_os_v1';

const DEFAULT_STATE: AgencyState = {
  leads: INITIAL_LEADS,
  listings: INITIAL_LISTINGS,
  viewings: INITIAL_VIEWINGS,
  commissions: INITIAL_COMMISSIONS,
};

let cachedState: AgencyState | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): AgencyState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  if (cachedState) return cachedState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      cachedState = {
        leads: Array.isArray(parsed.leads) ? parsed.leads : INITIAL_LEADS,
        listings: Array.isArray(parsed.listings)
          ? parsed.listings
          : INITIAL_LISTINGS,
        viewings: Array.isArray(parsed.viewings)
          ? parsed.viewings
          : INITIAL_VIEWINGS,
        commissions: Array.isArray(parsed.commissions)
          ? parsed.commissions
          : INITIAL_COMMISSIONS,
      };
      return cachedState;
    }
  } catch {
    // Fall back to default state
  }
  cachedState = DEFAULT_STATE;
  return cachedState;
}

function setStoreState(updater: (prev: AgencyState) => AgencyState) {
  const next = updater(readFromStorage());
  cachedState = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedState = null;
      listener();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function getServerSnapshot(): AgencyState {
  return DEFAULT_STATE;
}

const AgencyContext = createContext<AgencyContextValue | null>(null);

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribe,
    readFromStorage,
    getServerSnapshot
  );

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = { ...lead, id: `ld-${Date.now()}` };
    setStoreState((prev) => ({ ...prev, leads: [newLead, ...prev.leads] }));
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setStoreState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === id ? { ...lead, stage, lastContacted: 'Just now' } : lead
      ),
    }));
  };

  const updateLeadNotes = (id: string, notes: string) => {
    setStoreState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === id ? { ...lead, notes } : lead
      ),
    }));
  };

  const markLeadContacted = (id: string) => {
    setStoreState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === id
          ? { ...lead, lastContacted: 'Just now', contactedToday: true }
          : lead
      ),
    }));
  };

  const deleteLead = (id: string) => {
    setStoreState((prev) => ({
      ...prev,
      leads: prev.leads.filter((lead) => lead.id !== id),
    }));
  };

  const addListing = (listing: Omit<PropertyListing, 'id'>) => {
    const newListing: PropertyListing = { ...listing, id: `pr-${Date.now()}` };
    setStoreState((prev) => ({
      ...prev,
      listings: [newListing, ...prev.listings],
    }));
  };

  const updateListingStatus = (id: string, status: PropertyStatus) => {
    setStoreState((prev) => ({
      ...prev,
      listings: prev.listings.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));
  };

  const toggleViewingStatus = (id: string) => {
    setStoreState((prev) => ({
      ...prev,
      viewings: prev.viewings.map((item) => {
        if (item.id !== id) return item;
        const nextStatus =
          item.status === 'Confirmed'
            ? 'Completed'
            : item.status === 'Completed'
            ? 'Rescheduled'
            : 'Confirmed';
        return { ...item, status: nextStatus };
      }),
    }));
  };

  const addCommissionRecord = (record: Omit<CommissionRecord, 'id'>) => {
    const newRecord: CommissionRecord = { ...record, id: `cm-${Date.now()}` };
    setStoreState((prev) => ({
      ...prev,
      commissions: [newRecord, ...prev.commissions],
    }));
  };

  const deleteCommissionRecord = (id: string) => {
    setStoreState((prev) => ({
      ...prev,
      commissions: prev.commissions.filter((item) => item.id !== id),
    }));
  };

  const resetDemoData = () => {
    cachedState = DEFAULT_STATE;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    listeners.forEach((listener) => listener());
  };

  return (
    <AgencyContext.Provider
      value={{
        ...state,
        addLead,
        updateLeadStage,
        updateLeadNotes,
        markLeadContacted,
        deleteLead,
        addListing,
        updateListingStatus,
        toggleViewingStatus,
        addCommissionRecord,
        deleteCommissionRecord,
        resetDemoData,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const ctx = useContext(AgencyContext);
  if (!ctx) {
    throw new Error('useAgency must be used within AgencyProvider');
  }
  return ctx;
}
