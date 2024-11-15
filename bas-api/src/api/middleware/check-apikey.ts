import { Response, Request , NextFunction } from 'express';
import InternalServerException from '../errors/internal-server-exception';


const checkApikey = (apiKey : string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKeyHeader = req.headers['api-key'];
      if (apiKeyHeader !== apiKey) {
        throw new InternalServerException('Invalid API key');
      }
      next();
    } catch (error : any) {
      throw new InternalServerException(error.message);
    }
  }
}

export { checkApikey };