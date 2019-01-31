/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2019                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'dist', 'build');
var mainPath = path.resolve(__dirname, 'app', 'client');

var config = {
  devtool: 'cheap-module-source-map',
  entry: path.resolve(mainPath, 'app.jsx'),
  output: {
    path: buildPath,
    filename: 'bundle.js'
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new Webpack.EnvironmentPlugin([
      "npm_package_version"
    ])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        include: [mainPath],
        enforce: "pre",
        exclude: [nodeModulesPath]
      }
    ],
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath]
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  mode: 'production'
};

module.exports = config;
