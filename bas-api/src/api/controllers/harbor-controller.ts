import { trace } from '@bas/utils/logger';
import { harborService } from '@bas/service';
import { NextFunction, Request, Response } from 'express';


const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const data = await harborService.getHarborInfo( {status : Number(status) || undefined});
    return res.success({ data });
  }  catch (error: any) {
    trace(getOne.name);
    next(error);
  }
}

const configuration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const data = await harborService.configuration(body);
    return res.success({data});
  } catch (error: any) {
    trace(configuration.name);
    next(error);
  }
}

export default {
  getOne,
  configuration
}
