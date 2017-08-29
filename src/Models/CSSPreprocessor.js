import Sass from 'node-sass';
import fs from 'fs';
import path from 'path';
//import AWS from 'aws-sdk';

export default class CSSPreprocessor {
    /**
     * Initialize the AWS SDK with your credentials.
     *
     * @param accessKeyId Your AWS access key ID
     * @param secretAccessKey Your secret access key
     * @param region Your preferred region (See http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)
     */
    constructor(accessKeyId = '', secretAccessKey = '', region = 'eu-central-1') {
        /*if (accessKeyId !== '' && secretAccessKey !== '') {
            this.s3 = new AWS.S3({
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                region: region
            });

            this.buckets = null;

            this.s3.listBuckets((err, data) => {
                this.buckets = data.Buckets;
            });
        }*/

        this.variables = {};
    }

    /*getbuckets() {
        console.log(this.buckets);
    }*/

    addVariables(variables) {
        this.variables = Object.assign({}, this.variables, variables);
    }

    processVariables(scss) {
        let newScss = scss;
        Object.keys(this.variables).forEach(varName => {
            const newValue = this.variables[varName];
            const re = new RegExp('\\$' + varName + '\\s*(?!:)', 'g');
            newScss = newScss.replace(re, newValue);
        });
        return newScss;
    }

    compileSCSS(scss) {
        const processedScss = this.processVariables(scss);

        return Sass.renderSync({
            data: processedScss,
            outputStyle: 'compressed'
        }).css.toString();
    }

    compileSCSSFile(file) {
        const fileContents = fs.readFileSync(file, 'utf8');
        const processedScss = this.processVariables(fileContents);

        return Sass.renderSync({
            data: processedScss,
            outputStyle: 'compressed',
            includePaths: [
                path.dirname(file)
            ],
            importer: url => {
                const importedFileContents = fs.readFileSync(path.dirname(file) + '/' + url + '.scss', 'utf8');
                const processedScss = this.processVariables(importedFileContents);

                return ({
                    contents: processedScss
                });
            }
        }).css.toString();
    }
}