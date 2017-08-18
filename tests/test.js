import test from 'ava';
import AppManager from '../src/AppManager';
import App from '../src/Models/Entities/App';

test('initialization', t => {
    const am = new AppManager({
        appId: 21286,
        apiKey: '',
        baseUrl: 'https://v25-stage.app-arena.com/api/v2/'
    });

    const app = new App(21286);
    app.api = am.api;

    t.is(am.appId, 21286);
    t.deepEqual(am.primaryEntity, app);
});

test('retrieve config values', t => {
    const am = new AppManager({
        appId: 21286,
        apiKey: '',
        baseUrl: 'https://v25-stage.app-arena.com/api/v2/'
    });

    const app = am.primaryEntity;

    return app.getConfigs().then((configs) => {
        t.is(typeof configs, 'object');
        t.notDeepEqual(configs, {});

    });
});

test('throws an error when no api key is present', t => {
    t.throws(() => {
        new AppManager({
            appId: 21286,
            apiKey: '',
            baseUrl: 'https://v25-stage.app-arena.com/api/v2/'
        });
    });
});