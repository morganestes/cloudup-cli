#!/usr/bin/env node

/**
 * Module dependencies.
 */

var Cloudup = require('cloudup-client');
var pkg = require('./package');
var fs = require('fs');

/**
 * Configuration path.
 */

exports.configPath = process.env.HOME + '/.cloudup.json';

/**
 * Create a client with `opts`.
 *
 * @param {Object} opts
 * @return {Cloudup}
 * @api private
 */

exports.client = function(opts){
  opts = opts || {};
  opts.useragent = ' up/' + pkg.version;
  opts.url = opts.remote || 'https://api.cloudup.com';
  return new Cloudup(opts);
};

/**
 * Read config.
 *
 * @return {Object}
 * @api public
 */

exports.readConfig = function(){
  // read
  try {
    var json = fs.readFileSync(exports.configPath, 'utf8');
  } catch (err) {
    console.error('\n  Failed to load configuration.');
    console.error('  Execute: `up config` to get started!\n');
    process.exit(1);
  }

  // parse
  try {
    var obj = JSON.parse(json);
  } catch (err) {
    console.error('\n  Failed to parse ' + exports.configPath + '\n'); 
    process.exit(1);   
  }

  // validate
  if (!(obj.user && obj.fingerprint && obj.token)) {
    console.error('\n  Application token missing.');
    console.error('  Execute: `up config` to get a token!\n');
    process.exit(1);
  }

  return obj;
};

/**
 * Save config `obj`.
 *
 * @param {Object} obj
 * @api public
 */

exports.saveConfig = function(obj){
  var json = JSON.stringify(obj, null, 2);
  fs.writeFileSync(exports.configPath, json);
};