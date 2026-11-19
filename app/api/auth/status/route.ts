import { NextResponse } from 'next/server';
import {
  extractTokenFromRequest,
  readVault,
  verifySessionToken,
} from '@/lib/private-auth-server';

export async function GET(req: Request) {
  const vault = readVault();
  if (!vault) {
    return NextResponse.json({
      initialized: false,
      authenticated: false,
      user: null,
      branding: {
        agencyName: 'Keystone',
        hideSalesKitForClients: false,
      },
      members: [],
    });
  }

  const token = extractTokenFromRequest(req);
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({
      initialized: true,
      authenticated: false,
      user: null,
      branding: {
        agencyName: vault.branding.agencyName,
        hideSalesKitForClients: vault.branding.hideSalesKitForClients,
      },
      members: [],
    });
  }

  return NextResponse.json({
    initialized: true,
    authenticated: true,
    user: {
      email: session.email,
      name: session.name,
      role: session.role,
    },
    branding: vault.branding,
    members:
      session.role === 'Owner' || session.role === 'Managing Broker'
        ? vault.members
        : [],
  });
}
