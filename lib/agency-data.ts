import type { PropertyImageKey } from './images';

export type LeadStage =
  | 'New Inquiry'
  | 'Qualified'
  | 'Viewing Scheduled'
  | 'Offer Made'
  | 'Closed Won';

export type LeadSource =
  | 'Portal'
  | 'Referral'
  | 'Instagram'
  | 'Walk-In'
  | 'Cold Outreach';

export type PropertyType = 'Penthouse' | 'Villa' | 'Residential' | 'Commercial';
export type PropertyStatus = 'Active' | 'Under Offer' | 'Sold';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: number;
  preferredType: PropertyType;
  preferredArea: string;
  stage: LeadStage;
  source: LeadSource;
  agent: string;
  responseMinutes: number;
  lastContacted: string;
  nextFollowUp: string;
  notes: string;
  contactedToday?: boolean;
}

export interface PropertyListing {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: PropertyType;
  status: PropertyStatus;
  agent: string;
  daysOnMarket: number;
  commissionRate: number;
  imageKey: PropertyImageKey;
  description: string;
}

export interface ViewingAppointment {
  id: string;
  leadName: string;
  propertyTitle: string;
  agent: string;
  dateLabel: string;
  timeLabel: string;
  status: 'Confirmed' | 'Completed' | 'Rescheduled';
}

export interface CommissionRecord {
  id: string;
  dealName: string;
  salePrice: number;
  commissionRate: number;
  grossCommission: number;
  agentPayout: number;
  brokerageNet: number;
  createdAt: string;
}

export const LEAD_STAGES: LeadStage[] = [
  'New Inquiry',
  'Qualified',
  'Viewing Scheduled',
  'Offer Made',
  'Closed Won',
];

export const AGENTS = [
  'Elena Vance',
  'Marcus Thorne',
  'Priya Nair',
  'David Alverez',
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'ld-101',
    name: 'Hannah Lindqvist',
    email: 'h.lindqvist@nordiccapital.io',
    phone: '+1 (512) 555-0194',
    budget: 2450000,
    preferredType: 'Villa',
    preferredArea: 'Westlake Hills',
    stage: 'Offer Made',
    source: 'Referral',
    agent: 'Elena Vance',
    responseMinutes: 3,
    lastContacted: '2 hours ago',
    nextFollowUp: 'Today, 4:30 PM',
    notes: 'Cash buyer relocating from Seattle. Submitted initial term sheet on Cliffside Cedar Villa; awaiting seller counter by 6 PM.',
  },
  {
    id: 'ld-102',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@almansoorholdings.com',
    phone: '+1 (305) 555-0148',
    budget: 4800000,
    preferredType: 'Commercial',
    preferredArea: 'Midtown District',
    stage: 'Viewing Scheduled',
    source: 'Cold Outreach',
    agent: 'Marcus Thorne',
    responseMinutes: 5,
    lastContacted: 'Yesterday',
    nextFollowUp: 'Tomorrow, 10:00 AM',
    notes: 'Acquiring stabilized mixed-use corner assets with 6%+ cap rate. Touring Arcadia Limestone Building with asset manager.',
  },
  {
    id: 'ld-103',
    name: 'Claire & Nathan Brooks',
    email: 'cbrooks@brookspartners.com',
    phone: '+1 (415) 555-0172',
    budget: 1850000,
    preferredType: 'Penthouse',
    preferredArea: 'Downtown Core',
    stage: 'Qualified',
    source: 'Portal',
    agent: 'Priya Nair',
    responseMinutes: 4,
    lastContacted: '4 hours ago',
    nextFollowUp: 'Today, 5:15 PM',
    notes: 'Pre-approved through First Republic Private Wealth. Needs 3+ bedrooms, skyline exposure, and two deeded parking spaces.',
  },
  {
    id: 'ld-104',
    name: 'Dr. Samuel Okafor',
    email: 's.okafor@medgroup.org',
    phone: '+1 (619) 555-0126',
    budget: 3100000,
    preferredType: 'Residential',
    preferredArea: 'La Jolla Bluff',
    stage: 'New Inquiry',
    source: 'Instagram',
    agent: 'Elena Vance',
    responseMinutes: 2,
    lastContacted: '18 mins ago',
    nextFollowUp: 'Today, 2:00 PM',
    notes: 'Inquired via Instagram reel on coastal courtyard residence. Looking to close within 45 days before clinic opening.',
  },
  {
    id: 'ld-105',
    name: 'Victoria Chen',
    email: 'vchen@meridianventures.co',
    phone: '+1 (212) 555-0183',
    budget: 3650000,
    preferredType: 'Villa',
    preferredArea: 'Canyon Ridge',
    stage: 'Closed Won',
    source: 'Referral',
    agent: 'David Alverez',
    responseMinutes: 6,
    lastContacted: '2 days ago',
    nextFollowUp: 'Closing packet sent',
    notes: 'Escrow funded and closed ahead of schedule. Asked for referrals for property management and two investment townhouses.',
  },
  {
    id: 'ld-106',
    name: 'Robert & Diane Mercer',
    email: 'rmercer@mercerlaw.net',
    phone: '+1 (512) 555-0161',
    budget: 1550000,
    preferredType: 'Residential',
    preferredArea: 'Coastal Bluffs',
    stage: 'New Inquiry',
    source: 'Walk-In',
    agent: 'Priya Nair',
    responseMinutes: 7,
    lastContacted: '1 hour ago',
    nextFollowUp: 'Today, 3:30 PM',
    notes: 'Downsizing from 5,200 sq ft family home. Wants single-level living with outdoor stone courtyard and minimal stairs.',
  },
  {
    id: 'ld-107',
    name: 'Daniela Morales',
    email: 'dmorales@studioforma.design',
    phone: '+1 (310) 555-0139',
    budget: 2150000,
    preferredType: 'Penthouse',
    preferredArea: 'Waterfront Tower',
    stage: 'Viewing Scheduled',
    source: 'Portal',
    agent: 'David Alverez',
    responseMinutes: 4,
    lastContacted: '5 hours ago',
    nextFollowUp: 'Tomorrow, 1:30 PM',
    notes: 'Architect looking for natural oak finishes and unobstructed west-facing sunlight. High urgency to sign before Q4.',
  },
];

export const INITIAL_LISTINGS: PropertyListing[] = [
  {
    id: 'pr-201',
    title: 'Olive Grove Limestone Estate',
    address: '412 Ridgeview Terrace',
    neighborhood: 'Canyon Ridge',
    price: 3650000,
    beds: 5,
    baths: 5.5,
    sqft: 5180,
    type: 'Villa',
    status: 'Active',
    agent: 'Elena Vance',
    daysOnMarket: 11,
    commissionRate: 3.0,
    imageKey: 'hero_estate',
    description:
      'Architectural limestone and floor-to-ceiling glass residence anchored by a 65-foot reflecting pool and mature olive grove.',
  },
  {
    id: 'pr-202',
    title: 'Skyline Residence 44B',
    address: '880 Mercer Street, PH-B',
    neighborhood: 'Downtown Core',
    price: 1925000,
    beds: 3,
    baths: 3.5,
    sqft: 2740,
    type: 'Penthouse',
    status: 'Active',
    agent: 'Priya Nair',
    daysOnMarket: 19,
    commissionRate: 2.75,
    imageKey: 'penthouse',
    description:
      'Corner glass penthouse with wide-plank white oak flooring, honed travertine hearth, and panoramic harbor and skyline views.',
  },
  {
    id: 'pr-203',
    title: 'Cliffside Cedar Pavilion',
    address: '1904 Pacific Overlook',
    neighborhood: 'Westlake Hills',
    price: 2490000,
    beds: 4,
    baths: 4,
    sqft: 3820,
    type: 'Villa',
    status: 'Under Offer',
    agent: 'Elena Vance',
    daysOnMarket: 8,
    commissionRate: 3.0,
    imageKey: 'villa',
    description:
      'Cantilevered hillside residence pairing smooth white plaster, warm cedar soffits, and an illuminated lap pool terrace.',
  },
  {
    id: 'pr-204',
    title: 'Arcadia Corner Mixed-Use',
    address: '215 Hawthorne Avenue',
    neighborhood: 'Midtown District',
    price: 4650000,
    beds: 0,
    baths: 6,
    sqft: 12400,
    type: 'Commercial',
    status: 'Active',
    agent: 'Marcus Thorne',
    daysOnMarket: 24,
    commissionRate: 2.5,
    imageKey: 'commercial',
    description:
      'Fully leased 4-story limestone and steel mixed-use building with ground-floor retail frontage and double-height glass lobby.',
  },
  {
    id: 'pr-205',
    title: 'Bluffstone Courtyard Home',
    address: '74 Seaward Lane',
    neighborhood: 'La Jolla Bluff',
    price: 2890000,
    beds: 4,
    baths: 3.5,
    sqft: 3290,
    type: 'Residential',
    status: 'Active',
    agent: 'David Alverez',
    daysOnMarket: 6,
    commissionRate: 3.0,
    imageKey: 'coastal',
    description:
      'Single-level coastal limestone home with bronze-framed pocket glass walls opening directly onto a private ocean-view courtyard.',
  },
];

export const INITIAL_VIEWINGS: ViewingAppointment[] = [
  {
    id: 'vw-301',
    leadName: 'Dr. Samuel Okafor',
    propertyTitle: 'Bluffstone Courtyard Home',
    agent: 'Elena Vance',
    dateLabel: 'Today',
    timeLabel: '2:30 PM',
    status: 'Confirmed',
  },
  {
    id: 'vw-302',
    leadName: 'Claire & Nathan Brooks',
    propertyTitle: 'Skyline Residence 44B',
    agent: 'Priya Nair',
    dateLabel: 'Today',
    timeLabel: '5:00 PM',
    status: 'Confirmed',
  },
  {
    id: 'vw-303',
    leadName: 'Tariq Al-Mansoor',
    propertyTitle: 'Arcadia Corner Mixed-Use',
    agent: 'Marcus Thorne',
    dateLabel: 'Tomorrow',
    timeLabel: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 'vw-304',
    leadName: 'Daniela Morales',
    propertyTitle: 'Skyline Residence 44B',
    agent: 'David Alverez',
    dateLabel: 'Tomorrow',
    timeLabel: '1:30 PM',
    status: 'Confirmed',
  },
];

export const INITIAL_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'cm-401',
    dealName: 'Canyon Ridge Estate (Chen)',
    salePrice: 3650000,
    commissionRate: 3.0,
    grossCommission: 109500,
    agentPayout: 76650,
    brokerageNet: 32850,
    createdAt: 'Nov 17, 2026',
  },
  {
    id: 'cm-402',
    dealName: 'Cliffside Cedar Pavilion (Projected)',
    salePrice: 2490000,
    commissionRate: 3.0,
    grossCommission: 74700,
    agentPayout: 52290,
    brokerageNet: 22410,
    createdAt: 'Nov 19, 2026',
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}K`;
  }
  return formatCurrency(amount);
}
