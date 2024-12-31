// AsyncContext.ts

import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  orgId: number;
  userId: string;
  roleId: number;
  permissions?: string[];
  fullName?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const AsyncContext = {
  getContext(): RequestContext | undefined {
    const context = asyncLocalStorage.getStore();
    if (!context) {
      console.warn('[AsyncContext] No context found');
    }
    return context;
  },
  setContext(context: RequestContext) {
    asyncLocalStorage.enterWith(context);
  },
  run<T>(context: RequestContext, callback: (...args: any[]) => T): T {
    return asyncLocalStorage.run(context, callback);
  },
};
