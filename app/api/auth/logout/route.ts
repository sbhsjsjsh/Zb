import { NextResponse } from 'next/server';
import { buildClearSessionCookie } from '@/lib/private-auth-server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', buildClearSessionCookie());
  return res;
}
