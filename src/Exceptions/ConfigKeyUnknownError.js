import ExtendableError from './ExtendableError';
/**
 * Entity does not exist in App-Manager
 */
export default class ConfigKeyUnknownError extends ExtendableError  {
    constructor(message) {
        super();
        this.message = (message || 'Config-Key does not exist in Entity.');
    }
}