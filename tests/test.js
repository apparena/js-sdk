import test from 'ava';
import AppManager from '../src/';
import App from '../src/Models/Entities/App';
import {SCSSPreprocessor} from '../src/';
import fs from 'fs';
import path from 'path';

test.beforeEach(t => {
    let items;
    const dir = 'tests/css';

    try {
        items = fs.readdirSync(dir);
    } catch (err) {
        fs.mkdirSync(dir);
    }

    items.forEach(item => {
        item = path.join(dir, item);
        fs.unlinkSync(item);
    });
});

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

test('compiles scss', t => {
    const cssp = new SCSSPreprocessor();
    const css = cssp.processSCSS(`
    .class {
        margin: 100%;
        .sub-class {
            padding: 120px;
        }
    }`);

    t.true(css.includes('.class{'));
    t.true(css.includes('.class .sub-class{'));
    t.true((css.match(/margin:100%/g) || []).length === 1);
    t.true((css.match(/padding:120px/g) || []).length === 1);
    t.true((css.match(/\.class/g) || []).length === 2);
    t.true((css.match(/\.class[^{]/g) || []).length === 1);
});

test('compiles scss files', async t => {
    const cssp = new SCSSPreprocessor();
    const processed = await cssp.processSCSSFile('tests/scss/main.scss', 'tests/css');
    const css = processed[processed.type];

    t.true(css.includes('.class{'));
    t.true(css.includes('.class .sub-class{'));
    t.true((css.match(/margin:100%/g) || []).length === 1);
    t.true((css.match(/padding:120px/g) || []).length === 1);
    t.true((css.match(/\.class/g) || []).length === 2);
    t.true((css.match(/\.class[^{]/g) || []).length === 1);
    t.true((css.match(/background-color:#fe23c4/g) || []).length === 1);
    t.true((css.match(/@import/g) || []).length === 0);
});

test('compiles scss files with variable override', async t => {
    const cssp = new SCSSPreprocessor();
    cssp.addVariables({
        someColor: '#FACADE',
        color2: 'white',
    });
    const processed = await cssp.processSCSSFile('tests/scss/main.scss', 'tests/css');
    const css = processed[processed.type];

    t.true(css.includes('.class{'));
    t.true(css.includes('.class .sub-class{'));
    t.true((css.match(/margin:100%/g) || []).length === 1);
    t.true((css.match(/padding:120px/g) || []).length === 1);
    t.true((css.match(/\.class/g) || []).length === 2);
    t.true((css.match(/\.class[^{]/g) || []).length === 1);
    t.true((css.match(/background-color:#FACADE/g) || []).length === 1);
    t.true((css.match(/color:#ccc/g) || []).length === 1);
    t.true((css.match(/@import/g) || []).length === 0);
});