
import BaseError from '@bas/exceptions/base-error';


class UnauthorizedException extends BaseError {
  constructor(description?: string) {
    super(401, description || 'Unauthorized', true);
  }
}

export default UnauthorizedException;