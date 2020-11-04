const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devtool: 'source-map',
    
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist'),
        publicPath: '/'
    },

    plugins : [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './public/index.html'
        })
    ],

    module : {
        rules: [
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: true
                        }
                    },
                    'sass-loader'
                ]
            },

            {
                test: /\.module\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },

    devServer: {
        contentBase: path.join(process.cwd(), 'dist'),
        compress: true,
        port: 9000,
        historyApiFallback: true
    }
}