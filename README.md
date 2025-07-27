# Cheato API 🚀

A modern backend API architecture for AI workflow automation, built with **TypeScript + tRPC + Zod**. Cheato automates prompt engineering and model selection to optimize AI interactions.

## ✨ Features

- **Intent Analysis**: Automatically categorize user input and extract relevant tags
- **Model Recommendation**: Smart model selection based on intent, budget, and performance needs
- **Prompt Engineering**: Generate and refine prompts with tone and complexity controls
- **LLM Execution**: Unified interface for multiple AI providers (OpenAI, Anthropic, Google, Local)
- **Interaction History**: Complete logging and analytics of all AI interactions
- **Vibe Coding**: Advanced prompt tuning based on tone and output style preferences

## 🏗️ Architecture

```
src/
├── server/
│   ├── routers/          # tRPC routers for each function
│   │   ├── intent.ts     # Intent analysis
│   │   ├── model.ts      # Model recommendation
│   │   ├── prompt.ts     # Prompt generation & refinement
│   │   ├── run.ts        # LLM execution
│   │   ├── history.ts    # Interaction logging
│   │   └── index.ts      # Main router
│   ├── context.ts        # tRPC context
│   └── trpc.ts          # tRPC configuration
├── utils/
│   ├── supabase.ts      # Database utilities
│   └── llm.ts           # LLM execution utilities
├── types/
│   └── index.ts         # Shared TypeScript types
├── env.ts               # Environment configuration
└── index.ts             # Server entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo>
   cd cheato-api
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Health Check
```bash
GET /health
```

### tRPC Endpoints

All API functions are available via tRPC at `/trpc/*`:

#### Intent Analysis
```typescript
POST /trpc/intent.analyzeIntent
{
  "text": "Write a Python function to calculate fibonacci numbers"
}
```

#### Model Recommendation
```typescript
POST /trpc/model.recommendModel
{
  "intentCategory": "code_generation",
  "budget": 0.02,
  "speed": "balanced"
}
```

#### Prompt Generation
```typescript
POST /trpc/prompt.generatePrompt
{
  "model": "gpt-4o",
  "intent": "code_generation",
  "userInput": "Create a React component"
}
```

#### Prompt Refinement
```typescript
POST /trpc/prompt.refinePrompt
{
  "prompt": "Write a function",
  "tone": "professional",
  "complexity": "detailed"
}
```

#### LLM Execution
```typescript
POST /trpc/run.runLLM
{
  "model": "gpt-4o",
  "prompt": "Write a Python function...",
  "maxTokens": 1000,
  "temperature": 0.7
}
```

#### History Logging
```typescript
POST /trpc/history.logHistory
{
  "model": "gpt-4o",
  "prompt": "Write a function...",
  "result": "def fibonacci(n):...",
  "metadata": {
    "intentCategory": "code_generation",
    "tone": "professional"
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://...

# AI Providers (optional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_key
```

### Supported Models

- **OpenAI**: GPT-4o, GPT-4o-mini, GPT-3.5-turbo
- **Anthropic**: Claude-3-Opus, Claude-3-Sonnet, Claude-3-Haiku
- **Google**: Gemini Pro, Gemini Flash
- **Local**: Llama 3.1 (8B, 70B)

## 🎯 Use Cases

### 1. Automated Workflow
```typescript
// 1. Analyze user intent
const intent = await trpc.intent.analyzeIntent.mutate({
  text: "Help me write a blog post about AI"
});

// 2. Recommend best model
const model = await trpc.model.recommendModel.mutate({
  intentCategory: intent.intentCategory
});

// 3. Generate optimized prompt
const prompt = await trpc.prompt.generatePrompt.mutate({
  model: model.modelName,
  intent: intent.intentCategory,
  userInput: "Help me write a blog post about AI"
});

// 4. Refine prompt
const refined = await trpc.prompt.refinePrompt.mutate({
  prompt: prompt.rawPrompt,
  tone: "professional",
  complexity: "detailed"
});

// 5. Execute LLM
const result = await trpc.run.runLLM.mutate({
  model: model.modelName,
  prompt: refined.optimizedPrompt
});

// 6. Log interaction
await trpc.history.logHistory.mutate({
  model: model.modelName,
  prompt: refined.optimizedPrompt,
  result: result.output,
  metadata: {
    intentCategory: intent.intentCategory,
    tone: "professional"
  }
});
```

### 2. VSCode Plugin Integration
Perfect for VSCode plugins that need intelligent AI assistance with context-aware model selection and prompt optimization.

### 3. Bolt Frontend Integration
API-first design makes it easy to integrate with modern frontend frameworks like Next.js, React, or Vue.

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Adding New Models
1. Add model to `ModelNameSchema` in `src/types/index.ts`
2. Add provider mapping in `src/utils/llm.ts`
3. Update recommendation logic in `src/server/routers/model.ts`

### Adding New Intent Categories
1. Add category to `IntentCategorySchema` in `src/types/index.ts`
2. Update analysis logic in `src/server/routers/intent.ts`
3. Add recommendation mapping in `src/server/routers/model.ts`

## 📊 Analytics

The API provides built-in analytics through the history router:

```typescript
// Get user analytics
const analytics = await trpc.history.getAnalytics.query();

// Returns:
{
  totalInteractions: 150,
  modelUsage: {
    "gpt-4o": 45,
    "claude-3-sonnet": 30,
    "gemini-pro": 25
  },
  intentDistribution: {
    "code_generation": 60,
    "creative_writing": 40,
    "data_analysis": 20
  },
  lastInteraction: "2024-01-15T10:30:00Z"
}
```

## 🔒 Security

- **Authentication**: JWT-based auth (implemented via middleware)
- **Rate Limiting**: Built-in rate limiting support
- **Input Validation**: Zod schemas for all inputs
- **CORS**: Configurable CORS policies
- **Helmet**: Security headers

## 🚀 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel/Netlify
The API is designed to work with serverless platforms. Use the tRPC adapter for your platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the `/api` endpoint for live API docs
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

---

Built with ❤️ for the AI community