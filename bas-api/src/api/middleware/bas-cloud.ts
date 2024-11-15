import { NextFunction, Request, Response } from 'express';
import { decrypt } from '@bas/utils';
import fs from 'fs';
import { getPemPri } from '@bas/config/keys';

// Define a custom type for the owner property
interface Owner {
  orgId: number;
}

// Extend the Request interface to include the owner property
interface OwnerRequest extends Request {
  owner: Owner;
}

export const apiCloudKey = (req: OwnerRequest, res: Response, next: NextFunction) => {
  try {
    const { x_api_key } = req.headers;
    const privateKey = getPemPri();
    if (!x_api_key?.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const Information = decrypt(x_api_key?.toString(), privateKey);

    const [orgId, expires] = Information.split('_');
    if (+expires < Date.now()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.owner = {
      orgId: +orgId,
    };

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
