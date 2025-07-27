import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { env } from './env';
import { createContext } from './server/context';
import { appRouter } from './server/routers';

const app = express();
const PORT = env.PORT;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
});

// tRPC middleware
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error, path }) => {
    console.error(`❌ tRPC Error on ${path}:`, error);
  },
}));

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Cheato API',
    version: '1.0.0',
    description: 'Modern AI workflow automation API for prompt engineering and model selection',
    endpoints: {
      health: 'GET /health',
      trpc: 'POST /trpc/*',
      documentation: 'https://github.com/your-repo/cheato-api',
    },
    features: [
      'Intent Analysis',
      'Model Recommendation',
      'Prompt Generation & Refinement',
      'LLM Execution',
      'Interaction History',
    ],
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cheato API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});