import { z } from 'zod';

// Intent Analysis Types
export const IntentCategorySchema = z.enum([
  'creative_writing',
  'code_generation',
  'data_analysis',
  'content_summarization',
  'translation',
  'question_answering',
  'brainstorming',
  'problem_solving',
  'other'
]);

export const IntentAnalysisSchema = z.object({
  intentCategory: IntentCategorySchema,
  tags: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

// Model Recommendation Types
export const ModelProviderSchema = z.enum(['openai', 'anthropic', 'google', 'local']);
export const ModelNameSchema = z.enum([
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'gemini-pro',
  'gemini-flash',
  'llama-3.1-8b',
  'llama-3.1-70b'
]);

export const ModelRecommendationSchema = z.object({
  modelName: ModelNameSchema,
  provider: ModelProviderSchema,
  reasoning: z.string(),
  estimatedCost: z.number().optional(),
  performanceScore: z.number().min(0).max(1),
});

// Prompt Generation Types
export const ToneSchema = z.enum(['professional', 'casual', 'creative', 'technical']);
export const ComplexitySchema = z.enum(['simple', 'detailed']);

export const PromptGenerationSchema = z.object({
  rawPrompt: z.string(),
  optimizedPrompt: z.string(),
  improvements: z.array(z.string()),
  estimatedTokens: z.number(),
});

// LLM Execution Types
export const LLMRequestSchema = z.object({
  model: ModelNameSchema,
  prompt: z.string(),
  maxTokens: z.number().optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export const LLMResponseSchema = z.object({
  output: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
  model: ModelNameSchema,
  latency: z.number(), // in milliseconds
});

// History Logging Types
export const InteractionLogSchema = z.object({
  userId: z.string(),
  model: ModelNameSchema,
  prompt: z.string(),
  result: z.string(),
  metadata: z.object({
    intentCategory: IntentCategorySchema.optional(),
    tags: z.array(z.string()).optional(),
    tone: ToneSchema.optional(),
    complexity: ComplexitySchema.optional(),
    modelProvider: ModelProviderSchema.optional(),
  }).optional(),
});

// Export types
export type IntentCategory = z.infer<typeof IntentCategorySchema>;
export type IntentAnalysis = z.infer<typeof IntentAnalysisSchema>;
export type ModelProvider = z.infer<typeof ModelProviderSchema>;
export type ModelName = z.infer<typeof ModelNameSchema>;
export type ModelRecommendation = z.infer<typeof ModelRecommendationSchema>;
export type Tone = z.infer<typeof ToneSchema>;
export type Complexity = z.infer<typeof ComplexitySchema>;
export type PromptGeneration = z.infer<typeof PromptGenerationSchema>;
export type LLMRequest = z.infer<typeof LLMRequestSchema>;
export type LLMResponse = z.infer<typeof LLMResponseSchema>;
export type InteractionLog = z.infer<typeof InteractionLogSchema>;