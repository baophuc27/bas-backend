import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  orgId: number;
  userId: string;
  roleId: number;
  permissions: string[];
  fullName: string;
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
    console.log('[AsyncContext] Setting context:', context);
    asyncLocalStorage.enterWith(context);
  },
  run(context: RequestContext, callback: () => void) {
    console.log('[AsyncContext] Running context:', context);
    asyncLocalStorage.run(context, callback);
  },
};
