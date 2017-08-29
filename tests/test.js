import test from 'ava';
import AppManager from '../src/';
import App from '../src/Models/Entities/App';
import {CSSPreprocessor} from '../src/';

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
    const cssp = new CSSPreprocessor();
    const css = cssp.compileSCSS(`
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

test('compiles scss files', t => {
    const cssp = new CSSPreprocessor();
    const css = cssp.compileSCSSFile('tests/scss/main.scss');

    t.true(css.includes('.class{'));
    t.true(css.includes('.class .sub-class{'));
    t.true((css.match(/margin:100%/g) || []).length === 1);
    t.true((css.match(/padding:120px/g) || []).length === 1);
    t.true((css.match(/\.class/g) || []).length === 2);
    t.true((css.match(/\.class[^{]/g) || []).length === 1);
    t.true((css.match(/background-color:#fe23c4/g) || []).length === 1);
    t.true((css.match(/@import/g) || []).length === 0);
});

test('compiles scss files with variable override', t => {
    const cssp = new CSSPreprocessor();
    cssp.addVariables({
        someColor: '#FACADE',
        color2: 'white',
    });
    const css = cssp.compileSCSSFile('tests/scss/main.scss');

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

/*
test('initialize S3', t => {
    const cssPreprocessor = new CSSPreprocessor('AKIAJQGC43NMMCTYTC4Q', 'l96TMlHDONgfp/bPMu7cSNSUbVFpT9ih2ghYcaJC');
    console.log("yes");
    let i = 0, j = 0;
    for(; i < 1024 * 1024 * 1024; ++i)
        j += i;

    console.log("okay", j);
    cssPreprocessor.getbuckets();
});*/
