const webpack = require('webpack');

const conf = {
    entry: ["@babel/polyfill", __dirname + '/src/start.js'],
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    performance: {
        hints: false
    },
    mode: require.main == module ? 'production' : 'development',
    optimization: require.main == module ? {
        minimize: true
    } : {},
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',  //transpiler - translate new js into "old" js
                query: {
                    presets: ['@babel/preset-react', '@babel/preset-env']
                }
            }
        ]
    }
};

if (require.main == module) {
    webpack(conf, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info && info.compilation.errors.length) {
            console.log(info.compilation.errors);
        }
    });
} else {
    module.exports = require('webpack-dev-middleware')(webpack(conf), {
        watchOptions: {
            aggregateTimeout: 300
        },
        publicPath: '/'
    });
}
