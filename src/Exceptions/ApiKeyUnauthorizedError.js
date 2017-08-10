import ExtendableError from './ExtendableError';
/**
 * Entity does not exist in App-Manager
 */
export default class ApiKeyUnauthorizedError extends ExtendableError  {
    constructor(message) {
        super();
        this.message = (message || 'Your Api-Key is unauthorized.');
    }
}