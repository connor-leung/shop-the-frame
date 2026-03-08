import { Request, Response, NextFunction } from 'express';

// Origins allowed to call the API:
// - Chrome extension (chrome-extension://<id>)
// - Local development
// - Your deployed dashboard
const ALLOWED_ORIGINS: (string | RegExp)[] = [
  /^chrome-extension:\/\/.+/,
  'http://localhost:3000',
  'http://localhost:8000',
  process.env.DASHBOARD_URL,
].filter(Boolean) as (string | RegExp)[];

export function getAllowedOrigins(): (string | RegExp)[] {
  return ALLOWED_ORIGINS;
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) =>
    allowed instanceof RegExp ? allowed.test(origin) : allowed === origin,
  );
}

export function originAllowlist(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  // Allow requests with no origin (e.g. server-to-server, curl)
  if (!origin) return next();

  if (!isOriginAllowed(origin)) {
    console.warn(`[Security] Blocked request from disallowed origin: ${origin}`);
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}
