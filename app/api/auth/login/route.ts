import { NextResponse } from 'next/server';
import {
  authenticateUser,
  buildSessionCookie,
} from '@/lib/private-auth-server';

export async function POST(req: Request) {
  let body: { email?: string; passcode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email || '').trim();
  const passcode = (body.passcode || '').trim();

  if (!email || !passcode) {
    return NextResponse.json(
      { error: 'Authorized email and private passcode are required.' },
      { status: 400 }
    );
  }

  const result = authenticateUser(email, passcode);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  const res = NextResponse.json({
    authenticated: true,
    token: result.token,
    user: {
      email: result.session.email,
      name: result.session.name,
      role: result.session.role,
    },
    branding: result.vault.branding,
    members:
      result.session.role === 'Owner' || result.session.role === 'Managing Broker'
        ? result.vault.members
        : [],
  });

  res.headers.set('Set-Cookie', buildSessionCookie(result.token));
  return res;
}
