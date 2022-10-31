const { merge } = require('webpack-merge')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = require('./webpack.config.js')

module.exports = merge(config,{

    mode:'development',
    devtool:'inline-source-map',
    devServer:{
      devMiddleware:{
        writeToDisk: true
      },
    },
    output:{
      path: path.resolve(__dirname, 'public'),
    },
    plugins:[
      new CleanWebpackPlugin()
  ],
})
