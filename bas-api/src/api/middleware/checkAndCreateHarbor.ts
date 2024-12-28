import { Harbor } from '@bas/database/models';
import { NextFunction, Request, Response } from 'express';
import { harborDefault } from '@bas/database/master-data';
import { getFromCache } from '@bas/utils/cache';
import { col } from 'sequelize';

export const checkAndCreateHarbor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.identification;
    console.log(`[checkAndCreateHarbor] Checking and creating default Harbor for orgId: ${orgId}`);
    if (!orgId) {
      console.warn('[checkAndCreateHarbor] Missing orgId in request');
      return res.status(400).json({ error: 'Missing orgId in request' });
    }
    const organization = await getFromCache(orgId.toString());
    console.log('[checkAndCreateHarbor] Organization data:', JSON.stringify(organization, null, 2));
    
    if (!organization) {
      console.warn(`[checkAndCreateHarbor] No organization data found for orgId: ${orgId}`);
      return res.status(404).json({ error: 'Organization not found' });
    }

    console.log(`[checkAndCreateHarbor] Creating default Harbor for orgId: ${orgId}`);
    await Harbor.create({
      name: organization.nameVi || harborDefault.name,
      nameEn: organization.name || harborDefault.nameEn,
      address: organization.address || harborDefault.address,
      description: organization.description || harborDefault.description,
      orgId: orgId,
    });
    console.log(`Created default harbor for orgId: ${orgId}`);

    next();
  } catch (error) {
    console.error('[checkAndCreateHarbor] Error:', error);
    next(error);
  }
};
