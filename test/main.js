'use strict';

var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    tplVarPlaceholder = require('../index');

function getFile(filePath) {
    return new gutil.File({
        path: path.resolve(filePath),
        cwd: './test/',
        base: path.dirname(filePath),
        contents: new Buffer(String(fs.readFileSync(filePath)))
    });
}

function compare(fixturePath, expectedPath, options, done) {
  options.tempfilename = 'temp.tmp';
    // Create a plugin stream
    options.takeOut = true;
    var stream = tplVarPlaceholder(options);

    // options.takeInto = true;
    // var stream = tplVarPlaceholder(options);

    // write the fake file to it
    stream.write(getFile(fixturePath));

    // wait for the file to come back out
    // stream.pipe(tplVarPlaceholder({takeInto:true}));

    stream.once('data', function (file) {
        // make sure it came out the same way it went in
        should.ok(file.isBuffer());

        // check the contents

        file.contents.toString('utf8').should.be.not.equal(String(fs.readFileSync(expectedPath)));
        done();
    });
}

describe('gulp-tpl-var-placeholder', function() {

    it('Should gulp-tpl-var-placeholder', function(done) {
        var options = {};
        compare(path.join('test', 'fixtures', 'in.html'), path.join('test', 'expected', 'out.html'), options, done);
    });

    it('Should gulp-tpl-var-placeholder in multiple HTML files', function(done) {
        var options = {};
        compare(path.join('test', 'fixtures', 'multiple', 'one', 'in.html'), path.join('test', 'expected', 'multiple', 'one', 'out.html'), options, function () {});
        compare(path.join('test', 'fixtures', 'multiple', 'two', 'in.html'), path.join('test', 'expected', 'multiple', 'two', 'out.html'), options, done);
    });
});