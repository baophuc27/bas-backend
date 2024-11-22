// src/middleware/contextMiddleware.ts
import { AsyncContext, RequestContext } from '@bas/utils/AsyncContext';
import { NextFunction, Request, Response } from 'express';

export const setRequestContext = (req: Request, res: Response, next: NextFunction) => {
  const { orgId, userId, roleId, permissions, fullName } = req.identification || {};

  if (!orgId) {
    return res.status(400).json({ message: 'orgId is required' });
  }

  const context: RequestContext = {
    orgId,
    userId,
    roleId,
    permissions: permissions?.split(',') || [],
    fullName,
  };

  AsyncContext.run(context, next);
};
