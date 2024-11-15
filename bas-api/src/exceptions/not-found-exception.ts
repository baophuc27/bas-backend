import BaseError from '@bas/exceptions/base-error';


class NotFoundException extends BaseError {
  constructor(description?: string) {
    super(404, description || 'Not found', true);
  }
}

export default NotFoundException;