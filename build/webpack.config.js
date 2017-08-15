const webpack = require('webpack');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const isProduction = !!((argv.env && argv.env.production) || argv.p || process.env.NODE_ENV === 'production');

const config = {
    entry: './src/index.js',
    target: 'web',
    output: {
        filename: 'AppManager.js',
        path: path.resolve(__dirname, '../dist'),
        libraryTarget: 'umd',
        library: 'AppManager'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|dist|build)/,
                enforce: 'pre',
                use: {
                    loader: 'eslint-loader',
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'es2016'],
                        plugins: [
                            'transform-function-bind'
                        ]
                    }
                }
            }
        ]
    }
};

if (isProduction) {
    config.output.filename = 'AppManager.min.js';
    config.plugins = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            mangle: {
                screw_ie8: true,
            },
            output: {
                comments: false,
                screw_ie8: true
            },
        })
    ];
}

module.exports = config;