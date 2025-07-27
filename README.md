# Cheato API 🚀

Cheato is a backend I built to automate prompt engineering and LLM selection across providers. It’s modular, fast to iterate on, and built in TypeScript using tRPC and Zod. I started this project out of personal frustration — constantly switching between GPT-4, Claude, Gemini, and tweaking prompts manually felt inefficient. So I built something to make all of that easier.

This repo powers a full API workflow for tasks like:

* Detecting intent from user input
* Choosing the best LLM based on that intent
* Building and refining prompts based on tone and complexity
* Running the prompt
* Logging results for later analysis

---

## ✨ Features

* **Intent Analysis** – Classifies any input into a task type + tags
* **Model Recommendation** – Picks a model based on intent, budget, and speed
* **Prompt Engineering** – Generates a prompt and improves it with controls for tone, clarity, complexity
* **LLM Execution** – Unified execution layer for GPT-4o, Claude 3, Gemini, or local models
* **Logging + Analytics** – Optionally stores each interaction with metadata via Supabase
* **Vibe Coding** – Supports different output styles (e.g. professional, friendly, creative)

---

## 🏗️ Project Layout

```
src/
├── server/
│   ├── routers/
│   │   ├── intent.ts
│   │   ├── model.ts
│   │   ├── prompt.ts
│   │   ├── run.ts
│   │   ├── history.ts
│   │   └── index.ts
│   ├── context.ts
│   └── trpc.ts
├── utils/
│   ├── supabase.ts
│   └── llm.ts
├── types/
│   └── index.ts
├── env.ts
└── index.ts
```

---

## 🚀 Getting Started

### Prerequisites

* Node 18+
* Supabase account (optional, for logging)

### Setup

```bash
git clone https://github.com/Jason-lab1126/cheato-backend.git
cd cheato-backend
npm install
cp .env.example .env
# fill in API keys and Supabase config if needed
npm run dev
```

API will run locally on `http://localhost:3000`.

---

## 🧪 Example Usage (via tRPC client)

```ts
const intent = await trpc.intent.analyzeIntent.mutate({
  text: "Help me write a grant proposal for renewable energy"
});

const model = await trpc.model.recommendModel.mutate({
  intentCategory: intent.intentCategory
});

const prompt = await trpc.prompt.generatePrompt.mutate({
  model: model.modelName,
  intent: intent.intentCategory,
  userInput: "Help me write a grant proposal..."
});

const refined = await trpc.prompt.refinePrompt.mutate({
  prompt: prompt.rawPrompt,
  tone: "professional",
  complexity: "detailed"
});

const result = await trpc.run.runLLM.mutate({
  model: model.modelName,
  prompt: refined.optimizedPrompt
});

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

---

## 🔧 Config

```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_role_key

OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_key
DATABASE_URL=postgresql://...
```

---

## 🧩 Supported Models

* GPT-4o / GPT-4-turbo / GPT-3.5
* Claude 3 Opus / Sonnet / Haiku
* Gemini Pro / Gemini Flash
* Local LLaMA 3 via HTTP

---

## 🧠 Why I built this

I work with LLMs daily and I kept running into the same two issues:

1. Choosing the right model for the job wasn’t obvious
2. Prompt engineering took too much mental overhead

So I built Cheato to abstract away the boring parts and help me get answers faster, with better quality control.

It started as a personal tool, but I think others could benefit too.

---

## 🛠 Scripts

```bash
npm run dev          # Local dev server
npm run build        # Build for production
npm run start        # Run prod server
npm run lint         # Check code style
npm run type-check   # Validate types
```

---

## 📊 Analytics Example

```ts
const analytics = await trpc.history.getAnalytics.query();
```

Returns:

```json
{
  "totalInteractions": 132,
  "modelUsage": {
    "gpt-4o": 50,
    "claude-3-sonnet": 42,
    "gemini-pro": 25
  },
  "intentDistribution": {
    "code_generation": 45,
    "creative_writing": 38,
    "email_drafting": 24
  },
  "lastInteraction": "2025-07-25T22:14:00Z"
}
```

---

## 🧱 Future Plans

* Add CLI interface
* Graph-based prompt debugging
* Exportable prompt templates
* Auth tokens with rate limits per user

---

## 📄 License

MIT License
Copyright © 2025 Zhijian Xu
