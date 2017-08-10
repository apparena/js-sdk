import AbstractEntity from './AbstractEntity';
export default class Template extends AbstractEntity {
    constructor(templateId) {
        super(templateId, 'templates/', 'Template');
        this._templateId = templateId;
    }
    get templateId() {
        return this._templateId;
    }

    set templateId(value) {
        this._templateId = value;
    }
}