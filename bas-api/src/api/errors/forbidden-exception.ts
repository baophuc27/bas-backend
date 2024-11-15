import BaseError from "./base-error";
import { HttpStatusCode } from '@bas/constant';

class Forbidden extends BaseError {
  constructor(description: string, internalCode?: number) {
    super('Forbidden', HttpStatusCode.FORBIDDEN, description || 'Forbidden', true, internalCode);
  }
}

export default Forbidden;