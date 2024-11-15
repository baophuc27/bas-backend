import BaseError from "./base-error";
import { HttpStatusCode } from '@bas/constant';

class NotFound extends BaseError {
  constructor(description?: string, internalCode?: number) {
    super('Not found', HttpStatusCode.NOT_FOUND, description || 'The resource does not exist', true, internalCode);
  }
}

export default NotFound;