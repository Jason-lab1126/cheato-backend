import { router } from '../trpc';
import { intentRouter } from './intent';
import { modelRouter } from './model';
import { promptRouter } from './prompt';
import { runRouter } from './run';
import { historyRouter } from './history';

export const appRouter = router({
  intent: intentRouter,
  model: modelRouter,
  prompt: promptRouter,
  run: runRouter,
  history: historyRouter,
});

export type AppRouter = typeof appRouter;