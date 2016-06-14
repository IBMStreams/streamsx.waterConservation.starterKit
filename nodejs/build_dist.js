/* begin_generated_IBM_copyright_prolog                             */
/*                                                                  */
/* This is an automatically generated copyright prolog.             */
/* After initializing,  DO NOT MODIFY OR MOVE                       */
/* **************************************************************** */
/* (C) Copyright IBM Corp.  2016, 2016                              */
/* All Rights Reserved.                                             */
/* **************************************************************** */
/* end_generated_IBM_copyright_prolog                               */
const path = require('path');
const fs = require('fs');
const WEBPACK_CONFIG = './webpack.prod.config.js';

var buildPath = path.resolve(__dirname, 'dist');
var sourcePath = path.resolve(__dirname, 'app', 'www');
var webpack = require('webpack');
var config = require(WEBPACK_CONFIG);

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file,index) {
      var curPath = path + '/' + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
};

console.log('copying static assets: ');
console.log('  from ' + sourcePath + ' --> ' + buildPath);
deleteFolderRecursive(buildPath);
copyRecursiveSync(sourcePath, buildPath);

console.log('webpack processing ' + WEBPACK_CONFIG);
webpack(config, function(err, stats) {
  if (err) throw err;

  console.log(stats.toString());
  if (stats.hasErrors()) {
    throw new Error('Errors occured! Abort build.');
  }
});
