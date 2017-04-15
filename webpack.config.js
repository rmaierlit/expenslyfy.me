var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: path.join(__dirname, 'client', 'app.js'),
  output: { path: path.join(__dirname, 'client'), filename: 'bundle.js' },
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