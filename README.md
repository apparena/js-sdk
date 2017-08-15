# App-Arena JavaScript SDK

## Usage
First install the SDK in your Node.js-app rootfolder:  
`$ yarn add apparena-js-sdk ` or `$ npm install apparena-js-sdk --save`


To connect to the AppManager in your App, simply instantiate a AppManager-object as in the following example:
``` javascript 2016
import AppManager from 'apparena-js-sdk';

var am = new AppManager({appId: 10012, apiKey: '...xqE7fLdJGybEgiEdawxNZE...'});
var myApp = am.primaryEntity;

myApp.getConfig('app_download_link').then((link) => {
    console.log(link);
});

var allConfigs = my.getConfigs().then((configs) => {
    console.log(configs);
});
```