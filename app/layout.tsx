import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AgencyProvider } from '@/components/AgencyProvider';
import { PrivateAuthProvider } from '@/components/PrivateAuthProvider';
import { RouteTransition } from '@/components/RouteTransition';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Keystone — Private Real Estate Agency Software',
  description:
    'Private, invite-only real estate agency CRM, property inventory, buyer matching, commission calculator, and sales playbook.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Keystone — Private Real Estate Agency Software',
    description:
      'Private, invite-only real estate agency CRM, property inventory, buyer matching, commission calculator, and sales playbook.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keystone — Private Real Estate Agency Software',
    description:
      'Private, invite-only real estate agency CRM, property inventory, buyer matching, commission calculator, and sales playbook.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-[#FAFAFA] text-slate-900 antialiased selection:bg-emerald-900 selection:text-white"
      >
        <PrivateAuthProvider>
          <AgencyProvider>
            <RouteTransition>{children}</RouteTransition>
          </AgencyProvider>
        </PrivateAuthProvider>
      </body>
    </html>
  );
}
