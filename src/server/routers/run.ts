import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { LLMRequestSchema, LLMResponseSchema } from '../../types';
import { runLLM } from '../../utils/llm';

export const runRouter = router({
  runLLM: publicProcedure
    .input(LLMRequestSchema)
    .output(LLMResponseSchema)
    .mutation(async ({ input }) => {
      const result = await runLLM(input);
      return result;
    }),

  runLLMBatch: publicProcedure
    .input(z.array(LLMRequestSchema))
    .output(z.array(LLMResponseSchema))
    .mutation(async ({ input }) => {
      const { runLLMBatch } = await import('../../utils/llm');
      const results = await runLLMBatch(input);
      return results;
    }),
});