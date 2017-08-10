import AbstractEntity from './AbstractEntity';
export default class Version extends AbstractEntity {
    constructor(versionId) {
        super(versionId, 'versions/', 'Version');
        this._versionId = versionId;
    }
    get versionId() {
        return this._versionId;
    }

    set versionId(value) {
        this._versionId = value;
    }
}