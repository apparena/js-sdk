# App-Arena JavaScript SDK

## Usage
First install the SDK in your Node.js-app rootfolder:  
`$ yarn add apparena-js-sdk ` or `$ npm install apparena-js-sdk --save`


To connect to the AppManager in your App, simply instantiate a AppManager-object as in the following example:
``` javascript 2016
import AppManager from 'apparena-js-sdk';

const am = new AppManager({appId: 10012, apiKey: '...xqE7fLdJGybEgiEdawxNZE...'});
const myApp = am.primaryEntity;

myApp.getConfig('app_download_link').then((link) => {
    console.log(link);
});

var allConfigs = my.getConfigs().then((configs) => {
    console.log(configs);
});
```

Retrieving configurations is asynchronous and will always return a promise.

The configuration objects returned by `getConfig(...)` and `getConfigs()` follow a certain schema that looks similar to this:

```json
{
    "configId": "xyz",
    "lang": "de_DE",
    "name": "config name",
    "value": "123456",
    "type": "config type",
    "approved": false,
    "description": "An ordinary config",
    "appId": 10012,
    "meta": {
        ...
    },
    "_links": {
        ...
    }
}
```

It is important to keep this schema in mind when developing with the SDK as you cannot simply rely on the value in the promise to be what you expect.
However, if the value of the config is the only thing you need it is safe to access .value of a config. Here's the above example adjusted to only output the value the config holds:

```javascript 2016
myApp.getConfig('app_download_link').then((link) => {
    console.log(link.value);
});
```

