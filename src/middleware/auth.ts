import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { createServerSupabaseAdmin } from '../lib/supabase.ts';

export const SUPER_ADMIN_EMAIL = 'aleman201451@gmail.com';

export interface VerifiedUserToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  provider?: 'supabase' | 'firebase';
}

export interface AuthRequest extends Request {
  user?: VerifiedUserToken;
  isSuperAdmin?: boolean;
}

async function verifyBearerToken(token: string): Promise<VerifiedUserToken | null> {
  // 1. Try Supabase Auth JWT verification if Supabase is configured in environment secrets
  const supabaseAdmin = createServerSupabaseAdmin();
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) {
        return {
          uid: data.user.id,
          email: data.user.email || '',
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            '',
          picture: data.user.user_metadata?.avatar_url || '',
          email_verified: Boolean(data.user.email_confirmed_at),
          provider: 'supabase',
        };
      }
    } catch {
      // Fallback to Firebase token verification
    }
  }

  // 2. Verify Firebase Auth ID Token
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      email_verified: decodedToken.email_verified,
      provider: 'firebase',
    };
  } catch {
    return null;
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    const verified = await verifyBearerToken(token);
    if (verified) {
      req.user = verified;
      req.isSuperAdmin =
        Boolean(verified.email_verified) &&
        (verified.email || '').toLowerCase() === SUPER_ADMIN_EMAIL;
    }
  }
  next();
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  const verified = await verifyBearerToken(token);
  if (!verified) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  req.user = verified;
  req.isSuperAdmin =
    Boolean(verified.email_verified) &&
    (verified.email || '').toLowerCase() === SUPER_ADMIN_EMAIL;
  next();
};

export const requireSuperAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, async () => {
    const email = (req.user?.email || '').toLowerCase();
    if (!req.user?.email_verified || email !== SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        error:
          'Forbidden: Access restricted strictly to verified Super Administrator (Aleman201451@gmail.com).',
      });
    }
    next();
  });
};
