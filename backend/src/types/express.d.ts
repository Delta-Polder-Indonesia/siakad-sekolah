// backend/src/types/express.d.ts
// Menambahkan properti jwtUser ke Request Express

import type { JwtPayload } from '../middleware/auth.js';

declare global {
  namespace Express {
    interface Request {
      jwtUser?: JwtPayload;
      requestId?: string;
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export {};