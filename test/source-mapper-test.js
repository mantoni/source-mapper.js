/*global describe, it, before, beforeEach*/
/*
 * source-mapper.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var assert     = require('assert');
var browserify = require('browserify');
var exec       = require('child_process').exec;
var path       = require('path');
var mapper     = require('../lib/source-mapper');


describe('source-mapper', function () {
  var js;
  var x;

  before(function (done) {
    var b = browserify();
    b.add('./test/fixture/thrower.js');
    b.bundle({ debug : true }, function (err, script) {
      js = script;
      done(err);
    });
  });

  beforeEach(function () {
    x = mapper.extract(js);
  });

  it('removes sourceMappingURL from js', function () {
    var xjs = x.js.trim();

    assert.equal(js.substring(0, xjs.length).trim(), xjs);
    assert.equal(x.js.indexOf('//# sourceMappingURL='), -1);
  });

  it('maps node stdin stack', function (done) {
    var node = exec('node', function (err) {
      if (!err) {
        assert.fail('Error expected');
      }
      var s = mapper.stream(x.map);
      var d = '';
      s.on('data', function (data) {
        d += data;
      });
      s.on('end', function () {
        var base = path.resolve('test', 'fixture', 'thrower.js');
        var arr  = d.split('\n');

        assert.equal(arr[1], base + ':4');
        assert.equal(arr[5], '    at ' + base + ':4:9');
        assert.equal(arr[6], '    at Object.<anonymous> (' + base + ':5:2)');
        done();
      });
      s.write(err.toString());
      s.end();
    });
    node.stdin.write(x.js);
    node.stdin.end();
  });

});
