/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'dist', 'build');
var mainPath = path.resolve(__dirname, 'app', 'client');

var config = {

  devtool: 'eval',
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(mainPath, 'app.jsx')
  ],
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {
        //Eslint loader
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        include: [mainPath],
        exclude: [nodeModulesPath]
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: [nodeModulesPath]
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },

  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.EnvironmentPlugin([
      "npm_package_version"
    ])
  ]
};

module.exports = config;
