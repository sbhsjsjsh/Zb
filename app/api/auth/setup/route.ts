import { NextResponse } from 'next/server';
import {
  buildSessionCookie,
  initializeVault,
  readVault,
} from '@/lib/private-auth-server';

export async function POST(req: Request) {
  const existing = readVault();
  if (existing) {
    return NextResponse.json(
      { error: 'Private workspace is already initialized. Please sign in.' },
      { status: 409 }
    );
  }

  let body: {
    email?: string;
    name?: string;
    passcode?: string;
    agencyName?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid owner email address.' },
      { status: 400 }
    );
  }

  const passcode = (body.passcode || '').trim();
  if (passcode.length < 6) {
    return NextResponse.json(
      { error: 'Master passcode must be at least 6 characters long.' },
      { status: 400 }
    );
  }

  const { vault, token, session } = initializeVault({
    email,
    name: body.name || 'Workspace Owner',
    passcode,
    agencyName: body.agencyName || 'Keystone',
  });

  const res = NextResponse.json({
    authenticated: true,
    token,
    user: {
      email: session.email,
      name: session.name,
      role: session.role,
    },
    branding: vault.branding,
    members: vault.members,
  });

  res.headers.set('Set-Cookie', buildSessionCookie(token));
  return res;
}
