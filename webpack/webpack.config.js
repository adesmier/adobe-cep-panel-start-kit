const package           = require('../package.json');
const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseDistDir   = path.join(__dirname, `../dist/${package.directories.panelName}`);
const baseSrcDir    = path.join(__dirname, '../src');
const baseLibDir    = path.join(__dirname, '../lib');
const baseAssetsDir = path.join(__dirname, '../assets');

//https://hackernoon.com/webpack-3-quickstarter-configure-webpack-from-scratch-30a6c394038a

//auto inject css file in the head of html and js files at bottom of body
//https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel
const htmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: 'index.html',
    filename: 'index.html',
    inject: 'body',
    //sort injected script into alphabetical order
    chunksSortMode: (a, b) => {
        if(a.names[0] > b.names[0]) {
            return 1;
        }
        if(a.names[0] < b.names[0]) {
            return -1;
        }
        return 0;
    }
});


module.exports = {
    entry: {
        // 'lib/index': path.join(baseLibDir, 'index.js'),
        'main-bundle': [
            //react code bundle and scss (non-modular) input file
            path.join(baseSrcDir, 'js/index.js'),
            path.join(baseAssetsDir, 'scss/main.scss')
        ]
    },
    //only js files are outputted to a script tag
    output: {
        path: baseDistDir,
        filename: 'js/[name].js'
    },
    //avoids having to use js/jsx extensions in import calls
    //use path.resolve to import files from js folder root
    //http://discuss.babeljs.io/t/es6-import-jsx-without-suffix/172/2
    //https://moduscreate.com/blog/es6-es2015-import-no-relative-path-webpack/
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve('./src/js'),
            path.resolve('./lib/js'),
            path.resolve('./src/jsx'),
            path.resolve('./node_modules')
        ]
    },
    module: {
        rules: [
            //react/jsx/es6/es7 compilation
            //see .babelrc for babel rules
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, /src\/adobe/],
                loader: 'babel-loader'
            },
            //compile and bundle the css/scss
            {
                test: /\.(sass|scss)$/,
                exclude: [/node_modules/, /src/],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }                   
                    ]
                })
            },
            {
                test: /\.(sass|scss)$/,
                exclude: [/node_modules/, /assets\/scss/],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            //read in font awesome fonts and package them
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        htmlWebpackPluginConfig,
        new ExtractTextPlugin({
            filename: 'styles/[name].css',
            allChunks: true
        }),
        new CopyWebpackPlugin([
            { from: 'CSXS/manifest.xml', to: 'CSXS' },
            { from: '.debug', to: '.' },
            { from: 'src/adobe/indesign.jsx', to:'jsx' },
            { from: 'lib/*', to: 'js/lib', flatten: true },
            { from: 'assets/img/*', to: 'images', flatten: true }
        ]), 
    ]
}
