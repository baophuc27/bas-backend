import BaseError from "./base-error";
import { HttpStatusCode } from '@bas/constant';

class BadRequestException extends BaseError {
  constructor(description: string, internalCode?: number) {
    super('Bad request', HttpStatusCode.BAD_REQUEST, description, true, internalCode);
  }
}

export default BadRequestException;