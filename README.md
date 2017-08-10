# App-Arena JavaScript SDK

## Usage
`$ yarn add apparena-js-sdk `

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