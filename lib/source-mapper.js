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
var stackRE = /(\sat .*)?(\[stdin\]|http\:\/\/.+)\:([0-9]+)/g;


exports.extract = function (js) {
  var map = convert.fromSource(js);
  var mapper;
  if (map) {
    map = map.toObject();
    delete map.sourcesContent;
    mapper = new sourceMap.SourceMapConsumer(map);
    js = convert.removeComments(js);
  }
  return {
    js  : js,
    map : mapper
  };
};


exports.stream = function (map) {
  var buf = '';
  return through(function (data) {
    if (data) {
      buf += data.toString();
      var p = buf.lastIndexOf('\n');
      if (p !== -1) {
        var str = buf.substring(0, p + 1).replace(stackRE,
          function (m, p1, p2, nr) {
            /*jslint unparam: true*/
            if (nr < 1) {
              return m;
            }
            var mapped = map.originalPositionFor({
              line   : Number(nr),
              column : 0
            });
            return (p1 || '') + mapped.source + ':' + mapped.line;
          });
        this.queue(str);
        buf = buf.substring(p + 1);
      }
      if (buf.length > 3 && !/^\s+at /.test(buf)) {
        this.queue(buf);
        buf = '';
      }
    }
  });

};
