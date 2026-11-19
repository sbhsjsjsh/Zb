import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type MemberRole = 'Owner' | 'Managing Broker' | 'Agent';

export interface AuthorizedMember {
  email: string;
  name: string;
  role: MemberRole;
  addedAt: string;
}

export interface PrivateBranding {
  agencyName: string;
  hideSalesKitForClients: boolean;
}

interface StoredVault {
  initialized: boolean;
  ownerEmail: string;
  salt: string;
  passcodeHash: string;
  members: AuthorizedMember[];
  branding: PrivateBranding;
}

export interface SessionPayload {
  email: string;
  name: string;
  role: MemberRole;
  exp: number;
}

const VAULT_FILE = path.join('/tmp', 'keystone-private-vault-v1.json');
export const SESSION_COOKIE_NAME = 'keystone_private_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  if (
    process.env.PRIVATE_SESSION_SECRET &&
    process.env.PRIVATE_SESSION_SECRET !== 'CHANGE_ME_RANDOM_SESSION_SECRET'
  ) {
    return process.env.PRIVATE_SESSION_SECRET;
  }
  const secretPath = path.join('/tmp', 'keystone-session-secret.key');
  try {
    if (fs.existsSync(secretPath)) {
      const existing = fs.readFileSync(secretPath, 'utf8').trim();
      if (existing.length >= 32) return existing;
    }
    const generated = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(secretPath, generated, { mode: 0o600 });
    return generated;
  } catch {
    return crypto
      .createHash('sha256')
      .update(`keystone-fallback-${process.cwd()}`)
      .digest('hex');
  }
}

function hashPasscode(passcode: string, salt: string): string {
  return crypto.scryptSync(passcode, salt, 64).toString('hex');
}

function safeCompareHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function readVault(): StoredVault | null {
  try {
    if (fs.existsSync(VAULT_FILE)) {
      const raw = fs.readFileSync(VAULT_FILE, 'utf8');
      const parsed = JSON.parse(raw) as StoredVault;
      if (parsed && parsed.initialized && parsed.passcodeHash && parsed.salt) {
        return parsed;
      }
    }
  } catch {
    // Fall through to env check
  }

  // If PRIVATE_ACCESS_PASSCODE is configured in env, bootstrap vault automatically
  const envPasscode = process.env.PRIVATE_ACCESS_PASSCODE?.trim();
  if (envPasscode && envPasscode.length >= 4) {
    const salt = crypto.randomBytes(16).toString('hex');
    const defaultOwner = 'admin@agency.local';
    const vault: StoredVault = {
      initialized: true,
      ownerEmail: defaultOwner,
      salt,
      passcodeHash: hashPasscode(envPasscode, salt),
      members: [
        {
          email: defaultOwner,
          name: 'Workspace Owner',
          role: 'Owner',
          addedAt: new Date().toISOString().slice(0, 10),
        },
      ],
      branding: {
        agencyName: 'Keystone',
        hideSalesKitForClients: false,
      },
    };
    writeVault(vault);
    return vault;
  }

  return null;
}

function writeVault(vault: StoredVault): void {
  fs.writeFileSync(VAULT_FILE, JSON.stringify(vault, null, 2), { mode: 0o600 });
}

export function initializeVault(params: {
  email: string;
  name: string;
  passcode: string;
  agencyName: string;
}): { vault: StoredVault; token: string; session: SessionPayload } {
  const email = normalizeEmail(params.email);
  const name = params.name.trim() || 'Workspace Owner';
  const agencyName = params.agencyName.trim() || 'Keystone';
  const salt = crypto.randomBytes(16).toString('hex');
  const passcodeHash = hashPasscode(params.passcode, salt);

  const vault: StoredVault = {
    initialized: true,
    ownerEmail: email,
    salt,
    passcodeHash,
    members: [
      {
        email,
        name,
        role: 'Owner',
        addedAt: new Date().toISOString().slice(0, 10),
      },
    ],
    branding: {
      agencyName,
      hideSalesKitForClients: false,
    },
  };

  writeVault(vault);
  const session: SessionPayload = {
    email,
    name,
    role: 'Owner',
    exp: Date.now() + SESSION_TTL_MS,
  };
  return { vault, token: signSession(session), session };
}

export function authenticateUser(
  emailInput: string,
  passcode: string
): { ok: true; token: string; session: SessionPayload; vault: StoredVault } | { ok: false; reason: string } {
  const vault = readVault();
  if (!vault) {
    return { ok: false, reason: 'Workspace has not been initialized yet.' };
  }

  const email = normalizeEmail(emailInput);
  const member = vault.members.find((m) => normalizeEmail(m.email) === email);
  if (!member) {
    return {
      ok: false,
      reason: 'This email is not on the authorized agency member list.',
    };
  }

  const candidateHash = hashPasscode(passcode, vault.salt);
  if (!safeCompareHex(candidateHash, vault.passcodeHash)) {
    return { ok: false, reason: 'Incorrect private access passcode.' };
  }

  const session: SessionPayload = {
    email: member.email,
    name: member.name,
    role: member.role,
    exp: Date.now() + SESSION_TTL_MS,
  };

  return { ok: true, token: signSession(session), session, vault };
}

export function signSession(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as SessionPayload;
    if (!payload.email || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    // Verify member is still authorized in vault
    const vault = readVault();
    if (!vault) return null;
    const activeMember = vault.members.find(
      (m) => normalizeEmail(m.email) === normalizeEmail(payload.email)
    );
    if (!activeMember) return null;

    return {
      ...payload,
      name: activeMember.name,
      role: activeMember.role,
    };
  } catch {
    return null;
  }
}

export function updateVaultSettings(
  actorEmail: string,
  updates: {
    newPasscode?: string;
    branding?: Partial<PrivateBranding>;
    addMember?: { email: string; name: string; role: MemberRole };
    removeMemberEmail?: string;
  }
): { ok: true; vault: StoredVault } | { ok: false; reason: string } {
  const vault = readVault();
  if (!vault) return { ok: false, reason: 'Workspace not initialized.' };

  const actor = vault.members.find(
    (m) => normalizeEmail(m.email) === normalizeEmail(actorEmail)
  );
  if (!actor || (actor.role !== 'Owner' && actor.role !== 'Managing Broker')) {
    return { ok: false, reason: 'Only Owner or Managing Broker can modify privacy settings.' };
  }

  if (updates.newPasscode) {
    if (updates.newPasscode.length < 6) {
      return { ok: false, reason: 'Passcode must be at least 6 characters.' };
    }
    const newSalt = crypto.randomBytes(16).toString('hex');
    vault.salt = newSalt;
    vault.passcodeHash = hashPasscode(updates.newPasscode, newSalt);
  }

  if (updates.branding) {
    if (typeof updates.branding.agencyName === 'string' && updates.branding.agencyName.trim()) {
      vault.branding.agencyName = updates.branding.agencyName.trim().slice(0, 60);
    }
    if (typeof updates.branding.hideSalesKitForClients === 'boolean') {
      vault.branding.hideSalesKitForClients = updates.branding.hideSalesKitForClients;
    }
  }

  if (updates.addMember) {
    const email = normalizeEmail(updates.addMember.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { ok: false, reason: 'Please enter a valid member email address.' };
    }
    if (vault.members.some((m) => normalizeEmail(m.email) === email)) {
      return { ok: false, reason: 'That email is already authorized.' };
    }
    vault.members.push({
      email,
      name: updates.addMember.name.trim() || email.split('@')[0],
      role: updates.addMember.role,
      addedAt: new Date().toISOString().slice(0, 10),
    });
  }

  if (updates.removeMemberEmail) {
    const target = normalizeEmail(updates.removeMemberEmail);
    if (target === normalizeEmail(vault.ownerEmail)) {
      return { ok: false, reason: 'The primary Workspace Owner cannot be removed.' };
    }
    vault.members = vault.members.filter((m) => normalizeEmail(m.email) !== target);
  }

  writeVault(vault);
  return { ok: true, vault };
}

export function extractTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const part of cookies) {
    if (part.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return decodeURIComponent(part.slice(SESSION_COOKIE_NAME.length + 1));
    }
  }
  return null;
}

export function buildSessionCookie(token: string): string {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${Math.floor(
    SESSION_TTL_MS / 1000
  )}`;
}

export function buildClearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0`;
}
