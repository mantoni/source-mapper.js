/*
 * source-mapper.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var through   = require('through');
var convert   = require('convert-source-map');
var sourceMap = require('source-map');

/*jslint regexp: true*/
var stackRE = /(\[stdin\]|about:blank|(?:http|file)\:\/\/.+)\:([0-9]+)/g;


exports.extract = function (js) {
  var map = convert.fromSource(js);
  if (map) {
    map = map.toObject();
    delete map.sourcesContent;
    js = convert.removeComments(js);
  }
  return {
    js  : js,
    map : map
  };
};


exports.consumer = function (map) {
  return new sourceMap.SourceMapConsumer(map);
};


exports.line = function (consumer, line) {
  return line.replace(stackRE, function (m, p, nr) {
    /*jslint unparam: true*/
    if (nr < 1) {
      return m;
    }
    var mapped = consumer.originalPositionFor({
      line   : Number(nr),
      column : 0
    });
    return mapped.source + ':' + mapped.line;
  });
};


exports.stream = function (consumer) {
  if (!(consumer instanceof sourceMap.SourceMapConsumer)) {
    consumer = new sourceMap.SourceMapConsumer(consumer);
  }
  var buf = '';
  return through(function (data) {
    if (data) {
      buf += data.toString();
      var p = buf.lastIndexOf('\n');
      if (p !== -1) {
        this.queue(exports.line(consumer, buf.substring(0, p + 1)));
        buf = buf.substring(p + 1);
      }
      if (buf.length > 3 && !/^\s+at /.test(buf)) {
        this.queue(buf);
        buf = '';
      }
    }
  });
};
