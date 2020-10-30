module.exports = {
    entry: './src/index.js',

    module: {
        rules : [
            {
                test: /\.(js|jsx)$/,
                exclude : /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
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