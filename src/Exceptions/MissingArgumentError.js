import ExtendableError from './ExtendableError';
/**
 * At least one argument is missing.
 */
export default class MissingArgumentError extends ExtendableError  {
    constructor(message) {
        super();
        this.message = (message || 'At least one argument is missing.');
    }
}