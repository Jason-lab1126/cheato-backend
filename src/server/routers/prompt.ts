import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { PromptGenerationSchema, ModelNameSchema, IntentCategorySchema, ToneSchema, ComplexitySchema } from '../../types';

const generatePromptSchema = z.object({
  model: ModelNameSchema,
  intent: IntentCategorySchema,
  userInput: z.string().min(1).max(10000),
});

const refinePromptSchema = z.object({
  prompt: z.string().min(1).max(10000),
  tone: ToneSchema,
  complexity: ComplexitySchema,
});

export const promptRouter = router({
  generatePrompt: publicProcedure
    .input(generatePromptSchema)
    .output(PromptGenerationSchema)
    .mutation(async ({ input }) => {
      const { model, intent, userInput } = input;

      // Generate initial prompt based on intent and model
      const intentPrompts: Record<string, string> = {
        creative_writing: `You are a creative writer. Please help me with: ${userInput}`,
        code_generation: `You are a software developer. Please write code for: ${userInput}`,
        data_analysis: `You are a data analyst. Please analyze: ${userInput}`,
        content_summarization: `Please provide a concise summary of: ${userInput}`,
        translation: `Please translate the following text: ${userInput}`,
        question_answering: `Please answer this question: ${userInput}`,
        brainstorming: `Please help me brainstorm ideas for: ${userInput}`,
        problem_solving: `Please help me solve this problem: ${userInput}`,
        other: `Please help me with: ${userInput}`,
      };

      const rawPrompt = intentPrompts[intent] || intentPrompts.other;
      const estimatedTokens = Math.ceil(rawPrompt.length / 4);

      return {
        rawPrompt,
        optimizedPrompt: rawPrompt, // Will be refined by refinePrompt
        improvements: ['Initial prompt generated'],
        estimatedTokens,
      };
    }),

  refinePrompt: publicProcedure
    .input(refinePromptSchema)
    .output(PromptGenerationSchema)
    .mutation(async ({ input }) => {
      const { prompt, tone, complexity } = input;

      // Tone-specific refinements
      const toneRefinements: Record<string, string> = {
        professional: 'Please provide a professional, formal response.',
        casual: 'Please provide a friendly, conversational response.',
        creative: 'Please provide a creative, imaginative response.',
        technical: 'Please provide a detailed, technical response.',
      };

      // Complexity-specific refinements
      const complexityRefinements: Record<string, string> = {
        simple: 'Please keep the response simple and easy to understand.',
        detailed: 'Please provide a comprehensive, detailed response.',
      };

      // Apply refinements
      const improvements: string[] = [];
      let optimizedPrompt = prompt;

      // Add tone instruction
      if (tone !== 'casual') {
        optimizedPrompt += `\n\n${toneRefinements[tone]}`;
        improvements.push(`Applied ${tone} tone`);
      }

      // Add complexity instruction
      optimizedPrompt += `\n\n${complexityRefinements[complexity]}`;
      improvements.push(`Applied ${complexity} complexity level`);

      // Additional prompt engineering improvements
      if (complexity === 'detailed') {
        optimizedPrompt += '\n\nPlease include specific examples and step-by-step explanations.';
        improvements.push('Added detailed instruction');
      }

      if (tone === 'technical') {
        optimizedPrompt += '\n\nPlease use technical terminology and provide technical context.';
        improvements.push('Added technical context instruction');
      }

      // Grammar and clarity improvements
      if (prompt.includes('?')) {
        optimizedPrompt += '\n\nPlease structure your response clearly and address all aspects of the question.';
        improvements.push('Enhanced question structure');
      }

      const estimatedTokens = Math.ceil(optimizedPrompt.length / 4);

      return {
        rawPrompt: prompt,
        optimizedPrompt,
        improvements,
        estimatedTokens,
      };
    }),
});