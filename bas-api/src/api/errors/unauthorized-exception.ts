import BaseError from "./base-error";
import { HttpStatusCode } from '@bas/constant';


class Unauthorized extends BaseError {
  constructor(description = 'Unauthorized', internalCode?: number) {
    super('Unauthorized', HttpStatusCode.UNAUTHORIZED, description, true, internalCode);
  }
}

export default Unauthorized;