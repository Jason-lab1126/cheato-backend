import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { InteractionLogSchema } from '../../types';
import { db } from '../../utils/supabase';

const logHistorySchema = InteractionLogSchema.omit({ userId: true });

const getUserHistorySchema = z.object({
  limit: z.number().min(1).max(100).default(50),
});

export const historyRouter = router({
  logHistory: protectedProcedure
    .input(logHistorySchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId!;

      await db.logInteraction({
        userId,
        model: input.model,
        prompt: input.prompt,
        result: input.result,
        metadata: input.metadata,
      });

      return { success: true };
    }),

  getUserHistory: protectedProcedure
    .input(getUserHistorySchema)
    .output(z.array(z.any()))
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId!;
      const history = await db.getUserHistory(userId, input.limit);
      return history;
    }),

  getAnalytics: protectedProcedure
    .output(z.object({
      totalInteractions: z.number(),
      modelUsage: z.record(z.number()),
      intentDistribution: z.record(z.number()),
      lastInteraction: z.string().nullable(),
    }))
    .query(async ({ ctx }) => {
      const userId = ctx.userId!;
      const analytics = await db.getAnalytics(userId);
      return analytics;
    }),
});