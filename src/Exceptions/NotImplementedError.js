import ExtendableError from './ExtendableError';
/**
 * Functionality is not implemented yet.
 */
export default class NotImplementedError extends ExtendableError {
    constructor(message) {
        super();
        this.message = (message || 'Sorry, this is not implemented yet.');
    }
}