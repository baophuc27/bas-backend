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
    console.log('[AsyncContext] Getting context:', context);
    return context;
  },
  setContext(context: RequestContext) {
    console.log('[AsyncContext] Setting context:', context);
    asyncLocalStorage.enterWith(context);
  },
  run<T>(context: RequestContext, callback: (...args: any[]) => T): T {
    console.log('[AsyncContext] Running context:', context);
    return asyncLocalStorage.run(context, callback);
  },
  getStore(context: RequestContext): RequestContext | undefined {
    return asyncLocalStorage.getStore();
  },
};
