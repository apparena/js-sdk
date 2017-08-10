import ExtendableError from './ExtendableError';
/**
 * Entity does not exist in App-Manager
 */
export default class EntityUnknownError extends ExtendableError  {
    constructor(message) {
        super();
        this.message = (message || 'Entity does not exist in App-Manager');
    }
}