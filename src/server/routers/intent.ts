import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { IntentAnalysisSchema } from '../../types';

const analyzeIntentSchema = z.object({
  text: z.string().min(1).max(10000),
});

export const intentRouter = router({
  analyzeIntent: publicProcedure
    .input(analyzeIntentSchema)
    .output(IntentAnalysisSchema)
    .mutation(async ({ input }) => {
      const { text } = input;

      // Simple keyword-based intent analysis
      // In production, this would use a more sophisticated NLP model
      const lowerText = text.toLowerCase();

      let intentCategory: string;
      const tags: string[] = [];
      let confidence = 0.7; // Base confidence

      // Analyze intent based on keywords
      if (lowerText.includes('write') || lowerText.includes('create') || lowerText.includes('generate')) {
        if (lowerText.includes('code') || lowerText.includes('function') || lowerText.includes('script')) {
          intentCategory = 'code_generation';
          tags.push('programming', 'development', 'code');
          confidence = 0.9;
        } else if (lowerText.includes('story') || lowerText.includes('poem') || lowerText.includes('article')) {
          intentCategory = 'creative_writing';
          tags.push('creative', 'writing', 'content');
          confidence = 0.85;
        } else {
          intentCategory = 'creative_writing';
          tags.push('content-creation');
        }
      } else if (lowerText.includes('analyze') || lowerText.includes('data') || lowerText.includes('chart')) {
        intentCategory = 'data_analysis';
        tags.push('analytics', 'data', 'insights');
        confidence = 0.8;
      } else if (lowerText.includes('summarize') || lowerText.includes('summary')) {
        intentCategory = 'content_summarization';
        tags.push('summary', 'condense', 'extract');
        confidence = 0.9;
      } else if (lowerText.includes('translate') || lowerText.includes('language')) {
        intentCategory = 'translation';
        tags.push('translation', 'language', 'multilingual');
        confidence = 0.95;
      } else if (lowerText.includes('what') || lowerText.includes('how') || lowerText.includes('why') || lowerText.includes('?')) {
        intentCategory = 'question_answering';
        tags.push('qa', 'information', 'help');
        confidence = 0.8;
      } else if (lowerText.includes('brainstorm') || lowerText.includes('ideas') || lowerText.includes('suggest')) {
        intentCategory = 'brainstorming';
        tags.push('ideas', 'creative', 'suggestions');
        confidence = 0.85;
      } else if (lowerText.includes('solve') || lowerText.includes('problem') || lowerText.includes('fix')) {
        intentCategory = 'problem_solving';
        tags.push('problem-solving', 'troubleshooting', 'solution');
        confidence = 0.8;
      } else {
        intentCategory = 'other';
        tags.push('general', 'assistance');
        confidence = 0.6;
      }

      // Add additional tags based on content
      if (lowerText.includes('urgent') || lowerText.includes('quick')) {
        tags.push('urgent');
      }
      if (lowerText.includes('detailed') || lowerText.includes('comprehensive')) {
        tags.push('detailed');
      }
      if (lowerText.includes('simple') || lowerText.includes('basic')) {
        tags.push('simple');
      }

      return {
        intentCategory: intentCategory as any,
        tags: [...new Set(tags)], // Remove duplicates
        confidence,
      };
    }),
});