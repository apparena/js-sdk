import AbstractEntity from './AbstractEntity';
export default class App extends AbstractEntity {
    constructor(appId) {
        super(appId, 'apps/', 'App');
        this._appId = appId;
    }
    get appId() {
        return this._appId;
    }
    set appId(value) {
        this._appId = value;
    }
}