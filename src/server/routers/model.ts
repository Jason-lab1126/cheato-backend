import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { ModelRecommendationSchema, IntentCategorySchema } from '../../types';

const recommendModelSchema = z.object({
  intentCategory: IntentCategorySchema,
  budget?: z.number().min(0).optional(),
  speed?: z.enum(['fast', 'balanced', 'quality']).optional(),
});

export const modelRouter = router({
  recommendModel: publicProcedure
    .input(recommendModelSchema)
    .output(ModelRecommendationSchema)
    .mutation(async ({ input }) => {
      const { intentCategory, budget, speed = 'balanced' } = input;

      // Model recommendation logic based on intent and preferences
      const recommendations: Record<string, {
        modelName: string;
        provider: string;
        reasoning: string;
        estimatedCost: number;
        performanceScore: number;
      }> = {
        creative_writing: {
          modelName: 'claude-3-sonnet',
          provider: 'anthropic',
          reasoning: 'Claude excels at creative writing with nuanced understanding and engaging prose',
          estimatedCost: 0.015,
          performanceScore: 0.95,
        },
        code_generation: {
          modelName: 'gpt-4o',
          provider: 'openai',
          reasoning: 'GPT-4o has excellent code generation capabilities with strong reasoning',
          estimatedCost: 0.03,
          performanceScore: 0.92,
        },
        data_analysis: {
          modelName: 'gpt-4o',
          provider: 'openai',
          reasoning: 'GPT-4o performs well on analytical tasks and data interpretation',
          estimatedCost: 0.03,
          performanceScore: 0.90,
        },
        content_summarization: {
          modelName: 'gpt-4o-mini',
          provider: 'openai',
          reasoning: 'GPT-4o-mini is cost-effective for summarization tasks',
          estimatedCost: 0.01,
          performanceScore: 0.85,
        },
        translation: {
          modelName: 'gemini-pro',
          provider: 'google',
          reasoning: 'Gemini has strong multilingual capabilities',
          estimatedCost: 0.02,
          performanceScore: 0.88,
        },
        question_answering: {
          modelName: 'claude-3-haiku',
          provider: 'anthropic',
          reasoning: 'Claude Haiku is fast and accurate for Q&A tasks',
          estimatedCost: 0.005,
          performanceScore: 0.87,
        },
        brainstorming: {
          modelName: 'gpt-4o',
          provider: 'openai',
          reasoning: 'GPT-4o generates diverse and creative ideas',
          estimatedCost: 0.03,
          performanceScore: 0.93,
        },
        problem_solving: {
          modelName: 'claude-3-opus',
          provider: 'anthropic',
          reasoning: 'Claude Opus has superior reasoning capabilities for complex problems',
          estimatedCost: 0.06,
          performanceScore: 0.96,
        },
        other: {
          modelName: 'gpt-3.5-turbo',
          provider: 'openai',
          reasoning: 'GPT-3.5-turbo is a reliable general-purpose model',
          estimatedCost: 0.002,
          performanceScore: 0.80,
        },
      };

      let recommendation = recommendations[intentCategory];

      // Adjust based on budget constraints
      if (budget !== undefined && budget < recommendation.estimatedCost) {
        // Find cheaper alternatives
        const cheapModels = [
          { modelName: 'gpt-3.5-turbo', provider: 'openai', cost: 0.002, score: 0.80 },
          { modelName: 'claude-3-haiku', provider: 'anthropic', cost: 0.005, score: 0.87 },
          { modelName: 'gemini-flash', provider: 'google', cost: 0.008, score: 0.82 },
        ];

        const affordableModel = cheapModels.find(m => m.cost <= budget);
        if (affordableModel) {
          recommendation = {
            modelName: affordableModel.modelName as any,
            provider: affordableModel.provider as any,
            reasoning: `Budget-optimized choice: ${affordableModel.modelName} for cost efficiency`,
            estimatedCost: affordableModel.cost,
            performanceScore: affordableModel.score,
          };
        }
      }

      // Adjust based on speed preference
      if (speed === 'fast') {
        const fastModels = {
          'gpt-4o': { modelName: 'gpt-4o-mini', provider: 'openai', score: 0.85 },
          'claude-3-opus': { modelName: 'claude-3-haiku', provider: 'anthropic', score: 0.87 },
          'claude-3-sonnet': { modelName: 'claude-3-haiku', provider: 'anthropic', score: 0.87 },
        };

        const fastAlternative = fastModels[recommendation.modelName as keyof typeof fastModels];
        if (fastAlternative) {
          recommendation = {
            ...recommendation,
            modelName: fastAlternative.modelName as any,
            provider: fastAlternative.provider as any,
            reasoning: `${recommendation.reasoning} (speed-optimized variant)`,
            performanceScore: fastAlternative.score,
          };
        }
      }

      return recommendation;
    }),
});