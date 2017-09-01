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

# SCSS Preprocessor


This SDK also comes with a wrapper around node-sass that provides some convenience methods.
SCSS files are automatically cached to the hard disk and can optionally be uploaded to S3.
Additionally the S3 URL can be cached in Redis.  
A single method is required to process the SCSS or retrieve it from cache.

## Usage

Import the SCSS Preprocessor like this:
```javascript 2016
import {SCSSPreprocessor} from 'apparena-js-sdk';
```

Then you can initialize it like so:
```javascript 2016
const MySCSSPreprocessor = new SCSSPreprocessor({
    options,
    ...
});
```
The options are described below in the *options* section.  
Now you can use the `processSCSSFile` method to either process a SCSS file
or retrieve the already processed contents from cache. It returns a promise with an object containing the processed CSS or the S3 cache URL.  
The object has a simple format:

```json
{
    [Type]: 'Your Data',
    type: 'The Type'
}
```

Where `type` is either 'String', i.e. processed CSS, or 'URL', i.e. the S3 cache URL. The key `[Type]` is set to the value of the key `type`.
So if, for example, the function returns CSS the object will look like this:

```json
{
    String: 'some css',
    type: 'String'  
}
```

With ES6 you can quickly retrieve the CSS/S3 URL only with `data[data.type]` and it is always guaranteed to work.

Here's an example of how you can quickly get the processed CSS:

```javascript 2016
const css = MySCSSPreprocessor.processSCSSFile(inputFile, outputDirectory, uploadToS3 = true)
css.then((data) => {
    console.log(data[data.type]);
}).catch((error) => {
    console.log(error);
});
```

`processSCSSFile` Takes 3 arguments
* `inputFile` is the path to the SCSS file you want to process including the file name
* `outputDirectory` is the path to where you want to store the processed CSS files excluding the file name.
* `uploadToS3` (optional) dictates whether or not S3 caching is enabled (defaults to true). Has no effect when no AWS credentials are supplied during initialization.

## Options

These are the options you can define in the `SCSSPreprocessor` constructor:

| Key             | Default        | Description                                                                                       |
|:----------------|:---------------|:--------------------------------------------------------------------------------------------------|
| accessKeyId     | ' '            | Your AWS access key ID                                                                            |
| secretAccessKey | ' '            | Your AWS secret access key                                                                        |
| region          | 'eu-central-1' | Your preferred AWS region (See http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region) |
| enableRedis     | false          | Whether Redis caching should be enabled or not                                                    |
| redisHost       | '127.0.0.1'    | IP address of the Redis server                                                                    |
| redisPort       | 6379           | Port of the Redis server                                                                          |
| redisURL        | null           | The URL of the Redis server                                                                       |

Note that all options are optional and it is completely fine to not supply an options object at all. Additionally, nothing will be cached in Redis
if no S3 connection exist (for example when no AWS (secret) access key is supplied).