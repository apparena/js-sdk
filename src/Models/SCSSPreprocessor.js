import Sass from 'node-sass';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import redis from 'redis';

export default class SCSSPreprocessor {
    /**
     * Initialize the AWS SDK with your credentials.
     *
     * @param {Object} options Configuration for the Preprocessor
     * @param {String} [options.accessKeyId=''] Your AWS access key ID
     * @param {String} [options.secretAccessKey=''] Your AWS secret access key
     * @param {String} [options.region=eu-central-1] Your AWS preferred region (See http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)
     * @param {Boolean} [options.enableRedis=false] Whether or not to enable Redis caching
     * @param {String} [options.redisHost=127.0.0.1] IP address of the Redis server
     * @param {Number} [options.redisPort=6379] Port of the Redis server
     * @param {?String} [options.redisURL=null] The URL of the Redis server
     */
    constructor(options = {}) {
        if (options.accessKeyId !== '' && options.secretAccessKey !== '') {
            this.s3 = new AWS.S3({
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
                region: options.region || 'eu-central-1'
            });
        }

        this.variables = {};
        if (options.enableRedis) {
            this.redis = redis.createClient({
                host: options.redisHost || '127.0.0.1',
                port: options.redisPort || 6379,
                url: options.redisURL || null,
            });
        }
    }

    /**
     * Upload a CSS file to S3.
     *
     * @param filename Name of the SCSS file
     * @param css Processed CSS
     */
    uploadCSSToS3(filename, css) {
        if (!this.s3) return;
        const parent = this;

        this.s3.putObject({
            Bucket: 'aa-manager-20-dev',
            Key: filename,
            Body: css
        }, function (err, data) {
            // No arrow function here because we need access to `this`
            if (err) {
                console.log(err, err.stack);
            } else {
                if (parent.redis) {
                    const s3url = this.request.httpRequest.endpoint.href + 'aa-manager-20-dev/' + filename;
                    parent.redis.set(filename, s3url);
                }
            }
        });
    }

    /**
     * Get the CSS from S3. Will either retrieve the S3 URL from Redis or the CSS content from AWS (Prefers Redis).
     *
     * @param filename Name of the uploaded file
     * @returns {Promise} Object with key 'type' and a key that equals the value of 'type'. URL is the file URL from
     *                    Redis String is the file content from AWS.
     */
    retrieveCSSFromS3(filename) {
        const retrieveS3 = (resolve, reject) => {
            return this.s3.getObject({
                Bucket: 'aa-manager-20-dev',
                Key: filename
            }, (err, data) => {
                if (err) {
                    reject(err, err.stack);
                } else {
                    resolve({
                        String: data.Body.toString(),
                        type: 'String'
                    });
                }
            });
        };

        return new Promise((resolve, reject) => {
            if (this.redis) {
                this.redis.get(filename, (err, reply) => {
                    if (err || reply === null) {
                        retrieveS3(resolve, reject);
                    } else {
                        resolve({
                            URL: reply,
                            type: 'URL'
                        });
                    }
                });
            } else if (!this.redis && this.s3) {
                retrieveS3(resolve, reject);
            } else {
                reject('Cannot connect to S3 or Redis');
            }
        });
    }

    /**
     * Add variables which will replace the SCSS variables within a file.
     *
     * @param {object} variables An object where the key is the variable which will be replaced and the value is the
     *                           new value that will be inserted.
     */
    addVariables(variables) {
        this.variables = Object.assign({}, this.variables, variables);
    }

    /**
     * Replace the variables in the SCSS.
     *
     * @param {String} scss A SCSS string
     * @returns {String} SCSS with replaced variables
     */
    processVariables(scss) {
        let newScss = scss;
        Object.keys(this.variables).forEach(varName => {
            const newValue = this.variables[varName];
            const re = new RegExp('\\$' + varName + '\\s*(?!:)', 'g');
            newScss = newScss.replace(re, newValue);
        });
        return newScss;
    }

    /**
     * Process a SCSS string. Doesn't support S3 upload, Redis caching and variable replacement.
     *
     * @param {String} scss A SCSS string
     */
    processSCSS(scss) {
        const processedScss = this.processVariables(scss);

        return Sass.renderSync({
            data: processedScss,
            outputStyle: 'compressed'
        }).css.toString();
    }

    /**
     * Process a SCSS file. Variables that have been added via 'addVariables()' will be replaced in the SCSS file and
     * every file it imports. The processed CSS can be uploaded to S3 if you wish to provide improved performance.
     * The output will also be written to the disk so the SCSS doesn't have to be processed again.
     * This is the only method you should be using as it does everything for you automatically.
     *
     * @param {String} file Path to the SCSS file
     * @param {String} outputPath Path to write the processed CSS to
     * @param {boolean} [uploadToS3=true] Whether or not the processed CSS should be uploaded to S3
     * @returns {Promise} Object with key 'type' and a key that equals the value of 'type'. URL is the file URL from
     *                    Redis String is the file content from AWS.
     */
    async processSCSSFile(file, outputPath, uploadToS3 = true) {
        const baseFile = path.basename(file, path.extname(file));
        if (fs.existsSync(path.join(outputPath, baseFile + '.css'))) {
            return {
                String: fs.readFileSync(path.join(outputPath, baseFile + '.css'), 'utf8'),
                type: 'String'
            };
        }

        try {
            return await this.retrieveCSSFromS3(file);
        } catch (ex) {
            const fileContents = fs.readFileSync(file, 'utf8');
            const processedScss = this.processVariables(fileContents);

            const css = Sass.renderSync({
                data: processedScss,
                outputStyle: 'compressed',
                includePaths: [
                    path.dirname(file)
                ],
                importer: url => {
                    let importPath = path.dirname(path.join(path.dirname(file), url));
                    let importFile = path.basename(url) + '.scss';

                    if (!importFile.startsWith('_')) {
                        importFile = '_' + importFile;
                    }

                    if (!fs.existsSync(path.join(importPath, importFile))) {
                        return ({
                            contents: ''
                        });
                    }

                    const importedFileContents = fs.readFileSync(path.join(importPath, importFile), 'utf8');
                    const processedScss = this.processVariables(importedFileContents);

                    return ({
                        contents: processedScss
                    });
                }
            }).css.toString();

            if (uploadToS3) {
                this.uploadCSSToS3(file, css);
            }

            const fileExt = path.extname(file);
            const fileName = path.basename(file, fileExt) + '.css';
            const outPath = path.join(outputPath, fileName);

            fs.writeFileSync(outPath, css);
            return {
                String: css,
                type: 'String'
            };
        }
    }
}