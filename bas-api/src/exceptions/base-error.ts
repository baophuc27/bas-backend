class BaseError extends Error {

  status: number;
  message: string;

  constructor(status: number, message: string, b: boolean) {
    super();
    this.status = status;
    this.message = message;
  }
}

export default BaseError;