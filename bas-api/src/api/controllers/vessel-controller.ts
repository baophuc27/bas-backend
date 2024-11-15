import { Request, Response, NextFunction } from 'express';
import { vesselService } from '@bas/service';


const getListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page,
      amount,
      search
    } = req.query;
    const data = await vesselService.getVessels({
      page: Number(page) ?? undefined,
      amount: Number(amount) || undefined,
      search: search || null
    });
    return res.success({ data });
  } catch (error: any) {
    next(error);
  }
};

export default {
  getListing
};