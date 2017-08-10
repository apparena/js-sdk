import ExtendableError from './ExtendableError';
/**
 * Entity does not exist in App-Manager
 */
export default class UnexpectedApiResponseError extends ExtendableError  {
    constructor(message) {
        super();
        this.message = (message || 'The Api responded in a unexpected format');
    }
}