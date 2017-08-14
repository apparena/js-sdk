import {EntityUnknownError, UnexpectedApiResponseError, ConfigKeyUnknownError, ApiKeyUnauthorizedError} from '../../Exceptions';

export default class AbstractEntity {
    constructor(entityId, entityCollectionPath, entityTypeName) {
        // TODO: find UglifyJs compatible solution to forbid instantiation ob abstract class.
        /*
        if (new . target === AbstractEntity) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
        */
        this._entityId = entityId;
        this._entityCollectionPath = entityCollectionPath;
        this._entityTypeName = entityTypeName;
    }
    get entityId() {
        return this._entityId;
    }

    set entityId(value) {
        this._entityId = value;
    }

    get entityCollectionPath() {
        return this._entityCollectionPath;
    }

    set entityCollectionPath(value) {
        this._entityCollectionPath = value;
    }

    get entityTypeName() {
        return this._entityTypeName;
    }

    set entityTypeName(value) {
        this._entityTypeName = value;
    }
    get api() {
        return this._api;
    }
    set api(value) {
        this._api = value;
    }
    getConfigs() {
        if (this.configs) {
            return Promise.resolve(this.configs);
        }
        return this.api.get(`${this.entityCollectionPath}${this.entityId}/configs`).then((response)=> {
            if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.data) {
                this.configs = response.data._embedded.data;
                return Promise.resolve(this.configs);
            } else {
                return Promise.reject(new UnexpectedApiResponseError());
            }
        }).catch((result)=>{
            let error;
            if (result.response)  {
                switch (result.response.status) {
                    case 404:
                        error = new EntityUnknownError(`${this.entityTypeName} with ID ${this.entityId} does not exist.`);
                        break;
                    case 401:
                        error = new ApiKeyUnauthorizedError();
                        break;
                    default:
                        error = new UnexpectedApiResponseError();
                        break;
                }
                return Promise.reject(error);
            } else {
                return Promise.reject(result);
            }
        });
    }
    getConfig(configId) {
        return this.getConfigs().then((configs) => {
            if (configs[configId]) {
                return Promise.resolve(configs[configId]);
            } else {
                return Promise.reject(new ConfigKeyUnknownError(`Config-Key '${configId}' does not exist in Entity.`));
            }
        });
    }
}