const merge = require('webpack-merge')

const commonConfig = require('./webpack.common')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')

module.exports = (env, argv) => {
    if(argv.mode === 'development') {
        return merge(commonConfig, devConfig)
    } 
    
    if(argv.mode === 'production') {
        return merge(commonConfig, prodConfig)
    }
}