import { NextResponse } from 'next/server';
import {
  extractTokenFromRequest,
  updateVaultSettings,
  verifySessionToken,
  type MemberRole,
} from '@/lib/private-auth-server';

export async function PATCH(req: Request) {
  const token = extractTokenFromRequest(req);
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: {
    newPasscode?: string;
    branding?: { agencyName?: string; hideSalesKitForClients?: boolean };
    addMember?: { email: string; name: string; role: MemberRole };
    removeMemberEmail?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const result = updateVaultSettings(session.email, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    branding: result.vault.branding,
    members: result.vault.members,
  });
}
