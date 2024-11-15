import BaseError from '@bas/exceptions/base-error';


class InternalException extends BaseError {
  constructor(description?: string) {
    super(500, description || 'Internal error', true);
  }
}

export default InternalException;