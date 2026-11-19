'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function DemoBookingForm() {
  const [agencyName, setAgencyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [teamSize, setTeamSize] = useState('5–15 agents');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agencyName.trim() || !contactName.trim()) {
      setError('Please enter your name and brokerage name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }

    if (phone.trim().length < 7) {
      setError('Please enter a valid phone or WhatsApp number.');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-800" />
          <div>
            <h3 className="font-display text-xl font-semibold text-slate-950">
              Walkthrough request confirmed
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Thank you, {contactName}. We prepared a tailored 15-minute agency deployment walkthrough for{' '}
              <span className="font-medium text-slate-950">{agencyName}</span> ({teamSize}) and sent confirmation details to{' '}
              <span className="font-mono text-xs text-slate-900">{email}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setAgencyName('');
                setContactName('');
                setEmail('');
                setPhone('');
              }}
              className="mt-5 inline-flex min-h-[40px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Submit another agency inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-slate-900"
          >
            Your name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Jordan Alvarez"
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>

        <div>
          <label
            htmlFor="agency-name"
            className="block text-sm font-medium text-slate-900"
          >
            Real estate agency name
          </label>
          <input
            id="agency-name"
            type="text"
            required
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            placeholder="Harborview Realty Group"
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>

        <div>
          <label
            htmlFor="work-email"
            className="block text-sm font-medium text-slate-900"
          >
            Work email
          </label>
          <input
            id="work-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jordan@harborviewrealty.com"
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>

        <div>
          <label
            htmlFor="phone-number"
            className="block text-sm font-medium text-slate-900"
          >
            Phone or WhatsApp
          </label>
          <input
            id="phone-number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (512) 555-0192"
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="team-size"
          className="block text-sm font-medium text-slate-900"
        >
          Active agents in your brokerage
        </label>
        <select
          id="team-size"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 focus:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
        >
          <option value="1–4 agents">1–4 agents (Boutique office)</option>
          <option value="5–15 agents">5–15 agents (Growth agency)</option>
          <option value="16–40 agents">16–40 agents (Regional brokerage)</option>
          <option value="40+ agents">40+ agents (Multi-office enterprise)</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Includes custom branding setup and CSV migration from spreadsheets.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-emerald-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
        >
          Schedule Agency Walkthrough
        </button>
      </div>
    </form>
  );
}
