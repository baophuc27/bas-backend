import BaseError from "./base-error";
import { HttpStatusCode } from '@bas/constant';

class ExternalError extends BaseError {
    constructor(description?: string, externalCode?: number) {
        super('External error', HttpStatusCode.SERVICE_UNAVAILABLE, description || 'External error', true, externalCode);
    }
}

export default ExternalError;