import BaseError from "./base-error";
import { HttpStatusCode } from '@bas/constant';

class InternalServerError extends BaseError {
  constructor(description?: string, internalCode?: number) {
    super('Internal error', HttpStatusCode.INTERNAL_SERVER, description || 'Internal error', true, internalCode);
  }
}

export default InternalServerError;