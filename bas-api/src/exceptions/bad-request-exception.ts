import BaseError from '@bas/exceptions/base-error';


class BadRequestException extends BaseError {
  constructor(description?: string) {
    super(400, description || 'Bad Request', true);
  }
}

export default BadRequestException;