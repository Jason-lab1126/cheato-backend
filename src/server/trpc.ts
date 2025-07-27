import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: {
    input: (data) => data,
    output: (data) => data,
  },
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for authentication (placeholder for future implementation)
const isAuthed = t.middleware(({ ctx, next }) => {
  // For now, we'll use a simple user ID from headers
  // In production, you'd validate JWT tokens here
  const userId = ctx.req.headers['x-user-id'] as string;

  if (!userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User ID required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId,
    },
  });
});

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(isAuthed);

// Rate limiting middleware (placeholder)
const rateLimit = t.middleware(async ({ ctx, next }) => {
  // In production, implement proper rate limiting
  // For now, just pass through
  return next({ ctx });
});

export const rateLimitedProcedure = t.procedure.use(rateLimit);