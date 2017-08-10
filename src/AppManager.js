import Api from './Models/Api';
import {App, Template, Version} from './Models/Entities';
import {MissingArgumentError} from './Exceptions';

export default class AppManager {
    /**
     * Initialize the App-Manager object
     * @param params    ['appId'] App Id
     *                  ['templateId'] Template ID
     *                  ['versionId'] Version ID
     *                  ['apikey'] App-Arena Api Key to authenticate against the API
     */
    constructor(params = {}) {
        this._appId = params.appId;
        this._templateId = params.templateId;
        this._versionId = params.versionId;
        this._apiKey = params.apiKey;
        this._baseUrl = params.baseUrl;
        this._api = new Api({
            apiKey: this._apiKey,
            baseUrl: this._baseUrl
        });
        this._primaryEntity = this.getPrimaryEntity();
    }
    get api() {
        return this._api;
    }
    get appId() {
        return this._appId;
    }

    set appId(value) {
        this._appId = value;
    }

    get versionId() {
        return this._versionId;
    }

    set versionId(value) {
        this._versionId = value;
    }

    get apiKey() {
        return this._apiKey;
    }

    set apiKey(value) {
        this._apiKey = value;
    }

    get templateId() {
        return this._templateId;
    }

    set templateId(value) {
        this._templateId = value;
    }

    get baseUrl() {
        return this._baseUrl;
    }

    set baseUrl(value) {
        this._baseUrl = value;
    }

    get primaryEntity() {
        return this._primaryEntity;
    }

    set primaryEntity(value) {
        this._primaryEntity = value;
    }
    /**
     * Returns an implementation of the AbstractEntity object, depending on the Query params available for the current
     * request.
     *
     * @return AbstractEntity Entity object to get information for
     * @throws \InvalidArgumentException Throws an exception, when no Entity ID is available
     */
    getPrimaryEntity() {
        let primaryEntity;
        if (this.appId) {
            primaryEntity = new App(this.appId);
        } else if (this.templateId) {
            primaryEntity = new Template(this.templateId);
        } else if (this.versionId) {
            primaryEntity = new Version(this.versionId);
        } else {
            throw new MissingArgumentError('No appId, templateId or versionId present.');
        }
        primaryEntity.api = this.api;
        return primaryEntity;
    }
}