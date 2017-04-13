var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './client/app.js',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2016', 'react']
        }
      }
    ]
  },
};