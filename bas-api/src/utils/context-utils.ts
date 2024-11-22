// context-utils.ts

import { AsyncResource } from 'async_hooks';
import { AsyncContext, RequestContext } from '@bas/utils/AsyncContext';

export function runWithContext<T>(context: RequestContext, fn: () => Promise<T>): Promise<T> {
  const asyncResource = new AsyncResource('runWithContext');
  return asyncResource.runInAsyncScope(() => {
    return AsyncContext.run(context, fn);
  });
}
