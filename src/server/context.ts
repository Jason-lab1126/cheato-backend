import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
  userId?: string;
}

export const createContext = ({ req, res }: CreateExpressContextOptions): Context => {
  return {
    req,
    res,
  };
};

export type ContextType = inferAsyncReturnType<typeof createContext>;