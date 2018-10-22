const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
      clipjs: './src/clip.js',
      index: './src/index.js'
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].[hash:6].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/', // 图片输出的路径
                        limit: 5 * 1024
                    }
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['env', 'stage-0']
                    }
                }
            },
        ]
    },
    plugins: [
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, 'static'),
        //         to: path.resolve(__dirname, 'pages/static'),
        //         ignore: ['.*']
        //     }
        // ]),
        new CleanWebpackPlugin([path.join(__dirname, 'dist')]), // 清空打包目录
        new HtmlWebpackPlugin({
          template: 'src/index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: [path.join(__dirname, 'src')],
        port: 9090,
        host: 'localhost',
        overlay: true,
        compress: true,
        hot: true,
    },
    resolve: {
        extensions: ['.js', '.json', '.css'],
        alias: {
            
        }
    }
};