'use strict';

var mkdirp = require('mkdirp');
var ncp = require('ncp');
var fs = require('fs');
var path = require('path');


function checkIfExists(path) {
  if(!fs.existsSync(path)){
    console.error('\n!!! Directory ', path, ' doesn\'t exist');
    return false;
  }
  return true;
};

function createDirRecursively(path) {
  mkdirp.sync(path);
};

function copyRecursively(source, target, filter) {
  if( source && target ) {
    // async copy
    ncp(source, target, {stopOnErr: true, filter: filter}, function (err) {
      if (err) {
        return console.error('\n!!! Can\'t make copy source:', source, 'to target:', target, ', error:', err);
      }
    });
  }
};


function CopyPlugin(options) {
  options = options || [];
  if( !(options instanceof Array) ) {
    options = [options];
  }
  this.options = options;
};

CopyPlugin.prototype.apply = function(compiler) {
  var self = this,
    options = this.options,
    rootDir = compiler.context;

  compiler.plugin('done', function(stats) {
  
    // handle all items in configuration
    options.map(function(parameters) {
      parameters = parameters || {};
      if( parameters.items ) {    // mode with base dirs and many items
        // check input parameters
        if( typeof parameters.baseSourceDir !== 'string' ) {
          parameters.baseSourceDir = rootDir;
        }
        if( typeof parameters.baseTargetDir !== 'string' ) {
          parameters.baseTargetDir = rootDir;
        }
        // copy all items recursively
        createDirRecursively(parameters.baseTargetDir);
        if( checkIfExists(parameters.baseSourceDir) &&
              checkIfExists(parameters.baseTargetDir)) {
          parameters.items.forEach(function(item, idx){
            if(item) {
              var source = path.normalize(path.join(parameters.baseSourceDir, item));
              if( checkIfExists(source) ) {
                copyRecursively(source, parameters.baseTargetDir, parameters.filter);
              }
            }
          });
        }
      } else if ( typeof parameters.source === 'string' ) { // mode with source and target only (one item)
        // check input parameters
        if( typeof parameters.target !== 'string' ) {
          parameters.target = rootDir;
        }
        createDirRecursively(parameters.target);
        // copy recursively
        if( checkIfExists(parameters.source) ) {
          copyRecursively(parameters.source, parameters.target, parameters.filter);
        }
      }
    });
  });
};

module.exports = CopyPlugin;
