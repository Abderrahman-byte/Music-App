const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    devtool: false,

    output: {
        filename: 'static/[contenthash].js',
        path: path.resolve(process.cwd(), 'build')
    },

    optimization: {
        minimizer: [
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: './public/index.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            }),
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ]
    },

    plugins : [
        new MiniCssExtractPlugin({
            filename: 'static/[contenthash].css',
        
        }),
        new CleanWebpackPlugin()
    ],

    module : {
        rules: [
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: false
                        }
                    },
                    'sass-loader'
                ]
            },

            {
                test: /\.module\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: false
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    }
}