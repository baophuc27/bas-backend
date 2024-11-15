
import BaseError from '@bas/exceptions/base-error';


class ForbiddenException extends BaseError {
  constructor(description?: string) {
    super(401, description || 'Unauthorized', true);
  }
}

export default ForbiddenException;