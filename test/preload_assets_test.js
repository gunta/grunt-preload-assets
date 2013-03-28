'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.preload_assets = {
	setUp: function (done) {
		// setup here if necessary
		done();
	},
	default_options: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/default_options.json');
		var expected = grunt.file.read('test/expected/default_options.json');
		test.equal(actual, expected);

		test.done();
	},
	custom_options: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/custom_options.js');
		var expected = grunt.file.read('test/expected/custom_options.js');
		test.equal(actual, expected);

		test.done();
	},
	csv_options: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/csv_options.csv');
		var expected = grunt.file.read('test/expected/csv_options.csv');
		test.equal(actual, expected);

		test.done();
	},
	json_full_options: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/json_full_options.json');
		var expected = grunt.file.read('test/expected/json_full_options.json');
		test.equal(actual, expected);

		test.done();
	},
	json_hash_options: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/json_hash_options.json');
		var expected = grunt.file.read('test/expected/json_hash_options.json');
		test.equal(actual, expected);

		test.done();
	},
	preloadjs_options: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/preloadjs_options.js');
		var expected = grunt.file.read('test/expected/preloadjs_options.js');
		test.equal(actual, expected);

		test.done();
	}
};
