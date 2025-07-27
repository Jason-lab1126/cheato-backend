import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../src/server/routers';

// Create tRPC client
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      headers: {
        'x-user-id': 'user-123', // For authentication
      },
    }),
  ],
});

// Example workflow: Complete AI interaction pipeline
async function completeWorkflow() {
  try {
    console.log('🚀 Starting Cheato AI Workflow...\n');

    // 1. Analyze user intent
    console.log('1️⃣ Analyzing intent...');
    const intent = await trpc.intent.analyzeIntent.mutate({
      text: "Write a Python function to calculate fibonacci numbers with memoization"
    });
    console.log('Intent:', intent);
    console.log('');

    // 2. Recommend best model
    console.log('2️⃣ Recommending model...');
    const model = await trpc.model.recommendModel.mutate({
      intentCategory: intent.intentCategory,
      budget: 0.02,
      speed: 'balanced'
    });
    console.log('Model:', model);
    console.log('');

    // 3. Generate initial prompt
    console.log('3️⃣ Generating prompt...');
    const prompt = await trpc.prompt.generatePrompt.mutate({
      model: model.modelName,
      intent: intent.intentCategory,
      userInput: "Write a Python function to calculate fibonacci numbers with memoization"
    });
    console.log('Raw prompt:', prompt.rawPrompt);
    console.log('');

    // 4. Refine prompt
    console.log('4️⃣ Refining prompt...');
    const refined = await trpc.prompt.refinePrompt.mutate({
      prompt: prompt.rawPrompt,
      tone: 'professional',
      complexity: 'detailed'
    });
    console.log('Optimized prompt:', refined.optimizedPrompt);
    console.log('Improvements:', refined.improvements);
    console.log('');

    // 5. Execute LLM
    console.log('5️⃣ Executing LLM...');
    const result = await trpc.run.runLLM.mutate({
      model: model.modelName,
      prompt: refined.optimizedPrompt,
      maxTokens: 1000,
      temperature: 0.7
    });
    console.log('Result:', result.output);
    console.log('Latency:', result.latency + 'ms');
    console.log('');

    // 6. Log interaction
    console.log('6️⃣ Logging interaction...');
    await trpc.history.logHistory.mutate({
      model: model.modelName,
      prompt: refined.optimizedPrompt,
      result: result.output,
      metadata: {
        intentCategory: intent.intentCategory,
        tags: intent.tags,
        tone: 'professional',
        complexity: 'detailed',
        modelProvider: model.provider
      }
    });
    console.log('✅ Interaction logged successfully!');
    console.log('');

    // 7. Get analytics
    console.log('7️⃣ Fetching analytics...');
    const analytics = await trpc.history.getAnalytics.query();
    console.log('Analytics:', analytics);

  } catch (error) {
    console.error('❌ Error in workflow:', error);
  }
}

// Example: Batch processing
async function batchProcessing() {
  console.log('🔄 Starting batch processing...\n');

  const requests = [
    {
      model: 'gpt-4o' as const,
      prompt: 'Write a simple hello world function in Python',
      maxTokens: 500
    },
    {
      model: 'claude-3-haiku' as const,
      prompt: 'Explain what is recursion in programming',
      maxTokens: 800
    },
    {
      model: 'gemini-pro' as const,
      prompt: 'List 5 best practices for API design',
      maxTokens: 600
    }
  ];

  try {
    const results = await trpc.run.runLLMBatch.mutate(requests);

    results.forEach((result, index) => {
      console.log(`Result ${index + 1} (${result.model}):`);
      console.log(result.output);
      console.log(`Latency: ${result.latency}ms\n`);
    });
  } catch (error) {
    console.error('❌ Error in batch processing:', error);
  }
}

// Example: Intent analysis only
async function analyzeIntent() {
  console.log('🔍 Analyzing intent...\n');

  const texts = [
    "Write a React component for a todo list",
    "Summarize the key points of machine learning",
    "Translate this text to Spanish: Hello world",
    "Help me debug this JavaScript error",
    "Brainstorm ideas for a mobile app"
  ];

  for (const text of texts) {
    try {
      const intent = await trpc.intent.analyzeIntent.mutate({ text });
      console.log(`Text: "${text}"`);
      console.log(`Intent: ${intent.intentCategory}`);
      console.log(`Tags: ${intent.tags.join(', ')}`);
      console.log(`Confidence: ${(intent.confidence * 100).toFixed(1)}%`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error analyzing "${text}":`, error);
    }
  }
}

// Example: Model recommendation
async function recommendModels() {
  console.log('🤖 Recommending models...\n');

  const intents = [
    'creative_writing',
    'code_generation',
    'data_analysis',
    'content_summarization',
    'translation'
  ] as const;

  for (const intent of intents) {
    try {
      const model = await trpc.model.recommendModel.mutate({
        intentCategory: intent,
        budget: 0.03,
        speed: 'balanced'
      });

      console.log(`Intent: ${intent}`);
      console.log(`Recommended: ${model.modelName} (${model.provider})`);
      console.log(`Reasoning: ${model.reasoning}`);
      console.log(`Cost: $${model.estimatedCost}`);
      console.log(`Performance: ${(model.performanceScore * 100).toFixed(1)}%`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error recommending for ${intent}:`, error);
    }
  }
}

// Run examples
async function main() {
  console.log('🎯 Cheato API Examples\n');
  console.log('=' .repeat(50));

  // Uncomment the example you want to run:

  // await completeWorkflow();
  // await batchProcessing();
  // await analyzeIntent();
  // await recommendModels();
}

main().catch(console.error);