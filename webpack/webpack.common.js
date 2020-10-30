const webpack = require('webpack')
const Webpack = require('webpack')

module.exports = {
    entry: './src/index.js',
    
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8000')
        })
    ],

    module: {
        rules : [
            {
                test: /\.(js|jsx)$/,
                exclude : /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-transform-runtime', 
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: 'media',
                        outputPath: 'media',
                        name: '[name].[ext]'
                    }
                }
            }
        ]
    }
}