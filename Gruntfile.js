/*
 * grunt-preload-assets
 * https://github.com/gunta/grunt-preload-assets
 *
 * Copyright (c) 2013 Gunther Brunner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		preload_assets: {
			default_options: {
				files: {
					'tmp/default_options.json': ['test/fixtures/*.png', 'test/fixtures/*.jpg']
				}
			},
			preloadjs_options: {
				options: {
					ignoreBasePath: 'test/fixtures/',
					template: 'preloadjs'
				},
				files: {
					'tmp/preloadjs_options.js': ['test/fixtures/*.png', 'test/fixtures/*.jpg']
				}
			},
			custom_options: {
				options: {
					template: 'custom-sample'
				},
				files: {
					'tmp/custom_options.js': ['test/fixtures/*.png', 'test/fixtures/*.jpg']
				}
			},
			json_full_options: {
				options: {
					template: 'json',
					detectId: true,
					detectBytes: true,
					detectTotalBytes: true,
					detectSrc: true,
					detectLastModified: false,
					detectMD5: true,
					detectBase64: true,
					detectDimensions: true
				},
				files: {
					'tmp/json_full_options.json': ['test/fixtures/*.*']
				}
			},
			json_hash_options: {
				options: {
					template: 'json-hash',
					ignoreBasePath: 'test/'
				},
				files: {
					'tmp/json_hash_options.json': ['test/fixtures/*.*']
				}
			},
			csv_options: {
				options: {
					template: 'csv'
				},
				files: {
					'tmp/csv_options.csv': ['test/fixtures/*.*']
				}
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'preload_assets', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
