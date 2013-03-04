/*
 * grunt-preload-assets
 * https://github.com/gunta/grunt-preload-assets
 *
 * Copyright (c) 2013 Gunther Brunner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// NodeJS libs
	var path = require('path');

	// External libs
	var _ = require('lodash');

	// Mixin Underscore.string methods
	_.str = require('underscore.string');
	_.mixin(_.str.exports());


	// Filename conversion for templates
	var defaultProcessName = function (name) {
		return name;
	};

	// SAMPLE
	// https://github.com/gruntjs/grunt-contrib-jst/blob/master/tasks/jst.js

	var getTypeByExtension = function (extension) {
		switch (extension) {
			case "jpeg":
			case "jpg":
			case "gif":
			case "png":
			case "webp":
			case "bmp":
				return "IMAGE";
			case "ogg":
			case "mp3":
			case "wav":
				return "SOUND";
			case "json":
				return "JSON";
			case "xml":
				return "XML";
			case "css":
				return "CSS";
			case "js":
				return "JAVASCRIPT";
			case 'svg':
				return "SVG";
			default:
				return "TEXT";
		}
	};

	grunt.registerMultiTask('preload_assets', 'A Grunt plugin for making preload assets manifest.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			key: 'filesManifest',
			template: 'custom-sample',
			basePath: undefined,
			ignoreBasePath: undefined,
			processContent: function (src) {
				return src;
			},
			processId: function (file) {
				return _.camelize(_.strLeftBack(path.normalize(file.src), path.extname(file.src)).replace(/\//g, '_'));
			},
			processType: function (file) {
				return getTypeByExtension(_.ltrim(path.extname(file.src), '.'));
			}
		});

//		var processName = options.processName || defaultProcessName;
		grunt.verbose.writeflags(options, 'Options');

		// If the extension is .jst, treat as preset template
		if (path.extname(options.template) !== ".jst") {
			grunt.log.debug("Trying to use preset template files.");
			var defaultTemplate = "./templates/" + options.template + '.jst';
			if (grunt.file.exists(defaultTemplate)) {
				options.template = defaultTemplate;
			}
		}

		// TODO: USE GRUNT
		var tpl = options.processContent(grunt.file.read(options.template));

		var outputData = {};
		outputData.key = options.key;
		outputData.files = [];

		// Iterate over all specified file groups.
		this.files.forEach(function (file) {

			var outputDataSample = {
				key: "filesToPreload",
				files: [
					{
						id: "folderImagex",
						src: "folder/image.png"
					},
					{
						id: "folder/sound2x",
						src: "folder/sound2.mp3",
						type: "SOUND",
						bytes: 1231251
					},
					{
						src: "folder/image3.jpg",
						width: 480,
						height: 640
					}
				],
				totalBytes: 1234567
			};

			// if a basePath is set, expand using the original file pattern
			var filesArr = [];
			// TODO: fix basePath
			if (options.basePath) {
				filesArr = grunt.file.expand({cwd: options.basePath}, file.orig.src);
			} else {
				filesArr = file.src;
			}

			// Filter existent files
			var src = file.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if no null was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
					// Add file src
					var fileProps = {};
					fileProps.src = filepath;
					grunt.verbose.writeln('Reading ' + filepath);
					outputData.files.push(fileProps);
				});

			// Generate ID for each file
			_.each(outputData.files, function (f) {
				// TODO: if enabled
				f.id = options.processId(f);

				f.type = options.processType(f);
			});

			var compiled;
			// Compile
			try {
				compiled = _.template(tpl, outputData, {});
			} catch (e) {
				grunt.log.error(e);
				grunt.fail.warn('JST failed to compile.');
			}

			try {
				grunt.file.write(file.dest, compiled);
				grunt.verbose.writeln(compiled);
				grunt.log.writeln('File "' + file.dest + '" created.');
			} catch (e) {
				grunt.log.error(e);
				grunt.fail.warn('Failed to save file.');
			}
		});
	});
};
